import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib";
import { triggerActivityFeed } from "@/lib/triggerActivityFeed";
import { ComplaintStatus } from "@prisma/client";

export async function PATCH(req, { params }) {
  try {
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

    const token = cookies().get("auth")?.value;
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

    // 🔥 Trigger broadcast for both live feed and listeners
    triggerActivityFeed("complaint", id, status, adminName);

    return NextResponse.json({ success: true, updatedComplaint });
  } catch (err) {
    console.error("Complaint status update error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
