import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.complaintActivity.findMany({
      include: {
        admin: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // optional: limit results
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to fetch complaint events:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
