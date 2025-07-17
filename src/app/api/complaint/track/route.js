import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { trackingId } = await req.json();
    if (!trackingId) {
      return NextResponse.json({ error: "Missing trackingId" }, { status: 400 });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { trackingId },
      include: {
        complainant: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            phoneNumber: true,
            fullAddress: true,
            residencyProof: true,
            attachmentIDFront: true,
            attachmentIDBack: true,
            attachmentUtility: true,
          },
        },
        attachments: true,
      },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    // Decrypt attachments if needed (optional, for preview)
    // ...add decryption logic if you want to show images...

    return NextResponse.json({ success: true, complaint });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}