import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import twilio from "twilio";
import {
  encryptBuffer,
  base64ToBuffer,
  validateRequiredFields,
  generateTrackingId,
  upsertComplainant,
  decryptBuffer,
  bufferToBase64DataUrl,
} from "@/lib/complaint";

const prisma = new PrismaClient();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      attachmentIDFront,
      attachmentIDBack,
      attachmentUtility,
      complaintAttachment = [],
    } = data;

    const missing = validateRequiredFields(data);
    if (missing) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          missingFields: missing,
        },
        { status: 400 }
      );
    }

    let encryptedIDFront = null;
    let encryptedIDBack = null;
    let encryptedUtility = null;

    try {
      if (data.proofType === "ID") {
        if (attachmentIDFront) {
          encryptedIDFront = await encryptBuffer(
            base64ToBuffer(attachmentIDFront)
          );
        }
        if (attachmentIDBack) {
          encryptedIDBack = await encryptBuffer(
            base64ToBuffer(attachmentIDBack)
          );
        }
      } else if (data.proofType === "UTILITY_BILL") {
        if (attachmentUtility) {
          encryptedUtility = await encryptBuffer(
            base64ToBuffer(attachmentUtility)
          );
        }
      }
    } catch (err) {
      console.error("Encryption error:", err);
      return NextResponse.json(
        { success: false, error: "Failed to process attachments." },
        { status: 400 }
      );
    }

    const complainantId = await upsertComplainant({
      ...data,
      attachmentIDFront: encryptedIDFront,
      attachmentIDBack: encryptedIDBack,
      attachmentUtility: encryptedUtility,
    });

    const trackingId = generateTrackingId();
    const complaint = await prisma.complaint.create({
      data: {
        trackingId,
        complainantId,
        description: data.description,
        category: data.category,
        incidentDateTime: new Date(data.incidentDateTime),
        location: data.location || null,
        subjectName: data.subjectName || null,
        subjectContext: data.subjectContext || null,
      },
    });

    await twilioClient.messages.create({
    body: `Your complaint has been submitted. Tracking ID: ${complaint.trackingId}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+63${phoneNumber.replace(/^0/, "")}`,
  });
  
    for (const file of complaintAttachment) {
      try {
        const encrypted = await encryptBuffer(base64ToBuffer(file));
        await prisma.complaintAttachment.create({
          data: {
            complaintId: complaint.id,
            file: encrypted,
          },
        });
      } catch (err) {
        console.warn("Skipped invalid incident file:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Complaint submitted successfully",
        trackingId,
        complaintId: complaint.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Complaint POST error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const where = {};
    if (status) where.status = status;

    const complaints = await prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        complainant: {
          select: {
            id: true,
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
        attachments: {
          select: {
            id: true,
            file: true,
          },
        },
      },
    });

    const enriched = await Promise.all(
      complaints.map(async (complaint) => {
        // Process complaint attachments
        const decryptedAttachments = await Promise.all(
          complaint.attachments.map(async (attachment) => {
            try {
              const decryptedBuffer = await decryptBuffer(attachment.file);
              const dataUrl = await bufferToBase64DataUrl(decryptedBuffer);
              return {
                id: attachment.id,
                file: dataUrl,
              };
            } catch (error) {
              console.warn("Failed to decrypt attachment:", error);
              return {
                id: attachment.id,
                file: null,
              };
            }
          })
        );

        const c = complaint.complainant || {};

        // Process complainant attachments
        const enrichedComplainant = {
          ...c,
          attachmentIDFront: null,
          attachmentIDBack: null,
          attachmentUtility: null,
        };

        // Decrypt complainant attachments if they exist
        try {
          if (c.attachmentIDFront) {
            const decryptedBuffer = await decryptBuffer(c.attachmentIDFront);
            enrichedComplainant.attachmentIDFront =
              await bufferToBase64DataUrl(decryptedBuffer);
          }
        } catch (error) {
          console.warn("Failed to decrypt ID front attachment:", error);
        }

        try {
          if (c.attachmentIDBack) {
            const decryptedBuffer = await decryptBuffer(c.attachmentIDBack);
            enrichedComplainant.attachmentIDBack =
              await bufferToBase64DataUrl(decryptedBuffer);
          }
        } catch (error) {
          console.warn("Failed to decrypt ID back attachment:", error);
        }

        try {
          if (c.attachmentUtility) {
            const decryptedBuffer = await decryptBuffer(c.attachmentUtility);
            enrichedComplainant.attachmentUtility =
              await bufferToBase64DataUrl(decryptedBuffer);
          }
        } catch (error) {
          console.warn("Failed to decrypt utility attachment:", error);
        }

        return {
          ...complaint,
          complainant: enrichedComplainant,
          attachments: decryptedAttachments,
        };
      })
    );

    const totalCount = await prisma.complaint.count({ where });

    return NextResponse.json({
      success: true,
      data: enriched,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch complaints" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
