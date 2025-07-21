import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, verifyToken } from "@/lib";
import { ComplaintStatus } from "@prisma/client";
import createSocketClient from "@/lib/createSocketClient";

export async function PATCH(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { status } = await req.json();

    if (status !== "ESCALATED") {
      return NextResponse.json(
        { error: "Status not Escalated" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const adminId = decoded?.id;

    if (!adminId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    const blotter = await prisma.blotter.create({
      data: {
        trackingId: `BLTR-${Date.now()}`,
        description: complaint.description,
        category: complaint.category,
        incidentDateTime: complaint.incidentDateTime,
        location: complaint.location,
        subjectName: complaint.subjectName,
        subjectContext: complaint.subjectContext,
        complainantId: complaint.complainantId,
        fromComplaint: { connect: { id: complaint.id } },
        updatedByAdminId: adminId,
      },
    });

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        status: ComplaintStatus.ESCALATED,
        escalatedAt: new Date(),
        reviewedByAdmin: { connect: { id: adminId } },
        blotter: { connect: { id: blotter.id } },
        updatedAt: new Date(),
      },
    });

    console.log("STATUS CHANGED");

    await prisma.complaintEvent.create({
      data: {
        complaintId: complaint.id,
        action: "updated complaint",
        adminId: adminId,
      },
    });

    await prisma.blotterEvent.create({
      data: {
        blotterId: blotter.id,
        action: "filed blotter",
        adminId: adminId,
      },
    });

    const socket = createSocketClient();
    if (socket) {
      socket.emit("complaint-updated", {
        id: complaint.id,
        status: ComplaintStatus.ESCALATED,
      });
      console.log("✅ complaint-updated event emitted");

      socket.emit("blotter-created", {
        id: blotter.id,
        trackingId: blotter.trackingId,
        category: blotter.category,
        createdAt: blotter.createdAt,
      });
      console.log("📢 blotter-created event emitted");
    }

    return NextResponse.json({
      success: true,
      updatedComplaint,
      message: "Complaint escalated to blotter successfully",
    });
  } catch (error) {
    console.error("💥 Escalation error:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
