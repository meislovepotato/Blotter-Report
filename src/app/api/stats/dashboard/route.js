import { ensurePrismaConnected, prisma } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ensurePrismaConnected();

    const [
      pendingComplaints,
      resolvedComplaints,
      resolvedBlotters,
      flaggedComplaints,
    ] = await Promise.all([
      prisma.complaint.count({
        where: { status: "PENDING" },
      }),
      prisma.complaint.count({
        where: { status: "RESOLVED" },
      }),
      prisma.blotter.count({
        where: { status: "RESOLVED" },
      }),
      prisma.complaint.count({
        where: {
          severity: { gte: 4 },
          status: { notIn: ["RESOLVED", "ESCALATED"] },
        },
      }),
    ]);

    return NextResponse.json({
      pendingComplaints,
      resolvedCases: resolvedComplaints + resolvedBlotters,
      flaggedReports: flaggedComplaints,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
