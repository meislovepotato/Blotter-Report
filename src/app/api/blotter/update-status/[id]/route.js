import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, verifyToken } from "@/lib";
import createSocketClient from "@/lib/createSocketClient";
import { BlotterStatus } from "@prisma/client";

export async function PATCH(req, context) {
  try {
    const { id } = context.params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 });
    }

    if (!Object.values(BlotterStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid blotter status" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const adminId = decoded?.id;

    if (!adminId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const blotter = await prisma.blotter.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!blotter) {
      return NextResponse.json({ error: "Blotter not found" }, { status: 404 });
    }

    const updatedBlotter = await prisma.blotter.update({
      where: { id },
      data: {
        status,
        updatedByAdmin: { connect: { id: adminId } },
      },
    });

    await prisma.blotterEvent.create({
      data: {
        blotterId: id,
        action: `Status changed from ${blotter.status} to ${status}`,
        adminId,
      },
    });

    const socket = createSocketClient();
    if (socket) {
      socket.emit("blotter-updated", { id, status });
      console.log("📢 blotter-updated event emitted");
    }

    return NextResponse.json({
      success: true,
      updatedBlotter,
      message: "Blotter status updated successfully",
    });
  } catch (err) {
    console.error("Status update error:", err);
    return NextResponse.json(
      { error: "Something went wrong", message: err.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
