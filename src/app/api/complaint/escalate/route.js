import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🚀 Incoming escalate request body:", body);

    const { complaintId } = body;

    if (!complaintId) {
      console.warn("⚠️ Missing complaintId");
      return NextResponse.json(
        { error: "Missing complaintId" },
        { status: 400 }
      );
    }
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;
    console.log("🔐 Token from cookie:", token);
    if (!token) {
      console.warn("❌ No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    console.log("🔓 Decoded token:", decoded);
    const adminId = decoded?.id || decoded?.adminId;

    if (!adminId) {
      console.warn("❌ Invalid token structure");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });
    if (!complaint) {
      console.warn("❌ Complaint not found for ID:", complaintId);
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
    console.log("📄 Blotter created:", blotter);

    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: "ESCALATED",
        escalatedAt: new Date(),
        updatedAt: new Date(),
        reviewedByAdmin: { connect: { id: adminId } },
        blotter: { connect: { id: blotter.id } },
      },
    });

    console.log("✅ Complaint escalated:", updatedComplaint);
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
