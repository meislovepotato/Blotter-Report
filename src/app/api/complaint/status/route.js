import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib";

export async function POST(req) {
  try {
    const { complaintId, status } = await req.json();

    console.log("complaint id:", complaintId);

    if (!complaintId || !status) {
      return NextResponse.json(
        { error: "Missing complaintId or status" },
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

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });
    if (!complaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status,
        updatedAt: new Date(),
        reviewedByAdmin: { connect: { id: adminId } },
      },
    });

    return NextResponse.json({ success: true, updatedComplaint });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
