import { prisma } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.blotterEvent.findMany({
      include: {
        admin: {
          select: { name: true },
        },
        blotter: {
          select: { trackingId: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // optional: limit results
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to fetch blotter events:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
