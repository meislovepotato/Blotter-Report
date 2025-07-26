import { prisma, ensurePrismaConnected } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ensurePrismaConnected();

    const data = await prisma.complaintEvent.findMany({
      include: {
        admin: {
          select: { name: true },
        },
        complaint: {
          select: {
            trackingId: true,
            complainant: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to fetch complaint events:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
