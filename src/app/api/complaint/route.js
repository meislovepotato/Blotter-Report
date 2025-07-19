import { NextResponse } from "next/server";
import {
  encryptBuffer,
  base64ToBuffer,
  validateRequiredFields,
  generateTrackingId,
  upsertComplainant,
  decryptBuffer,
  bufferToBase64DataUrl,
} from "@/lib/complaint";
import { prisma } from "@/lib";

export async function POST(req) {
  try {
    const data = await req.json();
    const phoneNumber = data.phoneNumber;

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

    // Encrypt based on proof type
    let encryptedIDFront = null,
      encryptedIDBack = null,
      encryptedUtility = null;
    if (data.proofType === "ID") {
      if (data.attachmentIDFront)
        encryptedIDFront = await encryptBuffer(
          base64ToBuffer(data.attachmentIDFront)
        );
      if (data.attachmentIDBack)
        encryptedIDBack = await encryptBuffer(
          base64ToBuffer(data.attachmentIDBack)
        );
    } else if (data.proofType === "UTILITY_BILL" && data.attachmentUtility) {
      encryptedUtility = await encryptBuffer(
        base64ToBuffer(data.attachmentUtility)
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
        description: data.description || "",
        category: data.category,
        severity: data.severity || "INFORMATIONAL",
        incidentDateTime: new Date(data.incidentDateTime),
        location: data.location || null,
        subjectName: data.subjectName || null,
        subjectContext: data.subjectContext || null,
      },
    });

    // Save activity log
    await prisma.complaintEvent.create({
      data: {
        complaintId: complaint.id,
        action: "created complaint",
        adminId: null,
      },
    });

    // Encrypt and save attachments
    if (Array.isArray(data.complaintAttachment)) {
      for (const file of data.complaintAttachment) {
        try {
          const encrypted = await encryptBuffer(base64ToBuffer(file));
          await prisma.complaintAttachment.create({
            data: { complaintId: complaint.id, file: encrypted },
          });
        } catch (err) {
          console.warn("Skipped invalid file:", err);
        }
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
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      100
    ); // Max limit safety
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const [complaints, totalCount] = await Promise.all([
      prisma.complaint.findMany({
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
          attachments: { select: { id: true, file: true } },
        },
      }),
      prisma.complaint.count({ where }),
    ]);

    const enriched = await Promise.all(
      complaints.map(async (complaint) => {
        const decryptedAttachments = await Promise.all(
          complaint.attachments.map(async (att) => {
            try {
              const buf = await decryptBuffer(att.file);
              return { id: att.id, file: await bufferToBase64DataUrl(buf) };
            } catch {
              return { id: att.id, file: null };
            }
          })
        );

        const c = complaint.complainant || {};
        const enrichedComplainant = { ...c };

        for (const key of [
          "attachmentIDFront",
          "attachmentIDBack",
          "attachmentUtility",
        ]) {
          if (c[key]) {
            try {
              const buf = await decryptBuffer(c[key]);
              enrichedComplainant[key] = await bufferToBase64DataUrl(buf);
            } catch {
              enrichedComplainant[key] = null;
            }
          } else {
            enrichedComplainant[key] = null;
          }
        }

        return {
          ...complaint,
          complainant: enrichedComplainant,
          attachments: decryptedAttachments,
        };
      })
    );

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
  }
}
