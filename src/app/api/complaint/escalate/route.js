import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, verifyToken } from "@/lib";
import { triggerActivityFeed } from "@/lib/triggerActivityFeed";

export async function POST(req) {
  try {
    const { complaintId } = await req.json();
    if (!complaintId) {
      return NextResponse.json(
        { error: "Missing complaintId" },
        { status: 400 }
      );
    }

    const token = cookies().get("auth")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: adminId, name: adminName = "An admin" } =
      (await verifyToken(token)) || {};
    if (!adminId)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });
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
      where: { id: complaintId },
      data: {
        status: "ESCALATED",
        escalatedAt: new Date(),
        reviewedByAdmin: { connect: { id: adminId } },
        blotter: { connect: { id: blotter.id } },
      },
    });

    triggerActivityFeed("complaint", complaintId, "ESCALATED", adminName);

    return NextResponse.json({ success: true, updatedComplaint });
  } catch (error) {
    console.error("💥 Escalation error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
