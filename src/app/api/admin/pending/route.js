import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const pending = await prisma.pendingAdmin.findMany();
  return NextResponse.json(pending, { status: 200 });
}

export async function POST(req) {
  try {
    const { id } = await req.json();

    const pending = await prisma.pendingAdmin.findUnique({ where: { id } });
    if (!pending) {
      return NextResponse.json(
        { message: "Pending admin not found" },
        { status: 404 }
      );
    }

    // Generate random 6-digit admin ID
    const adminId = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        address: pending.address,
        password: pending.password,
        adminId,
      },
    });

    await prisma.pendingAdmin.delete({ where: { id } });

    // --- Send the adminId to the first admin's Gmail ---
    // Find the first admin (oldest user)
    const firstAdmin = await prisma.user.findUnique({
      where: { id: 1 },
    });

    if (firstAdmin && firstAdmin.email) {
      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Replace with your Gmail App Password
        },
      });

      // Send the email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: firstAdmin.email,
        subject: "New Admin Key Created",
        text: `A new admin key was created: ${adminId}`,
      });
    }
    // --

    return NextResponse.json({ adminId }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error approving admin", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  // Reject: delete from pending
  const { id } = await req.json();
  await prisma.pendingAdmin.delete({ where: { id } });
  return new Response("Deleted", { status: 200 });
}
