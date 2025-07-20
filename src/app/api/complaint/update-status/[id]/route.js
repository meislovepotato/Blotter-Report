// /api/complaint/update-status/[id]/route.js
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

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    if (!Object.values(ComplaintStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid complaint status" },
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
    const adminName = decoded?.name || "An admin";

    const complaint = await prisma.complaint.findUnique({ where: { id } });

    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        status,
        reviewedByAdmin: { connect: { id: adminId } },
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

    const socket = createSocketClient();
    if (socket) {
      socket.emit("complaint-updated", {
        id,
        status,
      });
      console.log("✅ complaint-updated event emitted");
    }

    return NextResponse.json({
      success: true,
      updatedComplaint,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.error("Status update error:", err);
    return NextResponse.json(
      { error: "Something went wrong", message: err.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
