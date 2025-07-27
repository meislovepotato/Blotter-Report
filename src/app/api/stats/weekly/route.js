import { prisma, ensurePrismaConnected } from "@/lib";
import { NextResponse } from "next/server";
import { subDays, startOfDay } from "date-fns";

export async function GET() {
  await ensurePrismaConnected();

  const results = await Promise.all(
    [...Array(7)].map(async (_, i) => {
      const day = subDays(new Date(), 6 - i); // Go backwards from 6 days ago to today
      const start = startOfDay(day);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

      const [
        pendingComplaints,
        resolvedComplaints,
        resolvedBlotters,
        flaggedReports,
      ] = await Promise.all([
        prisma.complaint.count({
          where: {
            status: "PENDING",
            createdAt: { gte: start, lt: end },
          },
        }),
        prisma.complaint.count({
          where: {
            status: "RESOLVED",
            updatedAt: { gte: start, lt: end },
          },
        }),
        prisma.blotter.count({
          where: {
            status: "RESOLVED",
            updatedAt: { gte: start, lt: end },
          },
        }),
        prisma.complaint.count({
          where: {
            severity: { gte: 4 },
            status: { notIn: ["RESOLVED", "ESCALATED"] },
            createdAt: { gte: start, lt: end },
          },
        }),
      ]);

      return {
        date: start.toISOString().split("T")[0], // Just the YYYY-MM-DD part
        pendingComplaints,
        resolvedCases: resolvedComplaints + resolvedBlotters,
        flaggedReports,
      };
    })
  );

  return NextResponse.json(results);
}
