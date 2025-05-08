import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const id = parseInt(context.params.id, 10); // Use `context.params.id`

    const updatedBlotter = await prisma.blotter.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedBlotter, { status: 200 });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
