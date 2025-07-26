import { prisma, ensurePrismaConnected } from "@/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ensurePrismaConnected();

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
      take: 50,
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to fetch blotter events:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
