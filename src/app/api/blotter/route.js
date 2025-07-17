import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decryptBuffer, bufferToBase64DataUrl } from "@/lib/complaint";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const where = {};
    if (status) where.status = status;

    const blotters = await prisma.blotter.findMany({
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
        attachments: true,
        fromComplaint: {
          select: { trackingId: true, status: true },
        },
      },
    });

    const enriched = await Promise.all(
      blotters.map(async (blotter) => {
        // Decrypt attachments
        const decryptedAttachments = await Promise.all(
          blotter.attachments.map(async (attachment) => {
            try {
              const decrypted = await decryptBuffer(attachment.file);
              const dataUrl = await bufferToBase64DataUrl(decrypted);
              return { ...attachment, file: dataUrl };
            } catch (err) {
              console.warn("Failed to decrypt blotter attachment:", err);
              return { ...attachment, file: null };
            }
          })
        );

        const c = blotter.complainant || {};
        const enrichedComplainant = {
          ...c,
          attachmentIDFront: null,
          attachmentIDBack: null,
          attachmentUtility: null,
        };

        // Decrypt complainant attachments if available
        try {
          if (c.attachmentIDFront) {
            const decrypted = await decryptBuffer(c.attachmentIDFront);
            enrichedComplainant.attachmentIDFront =
              await bufferToBase64DataUrl(decrypted);
          }
        } catch (err) {
          console.warn("Failed to decrypt ID front:", err);
        }

        try {
          if (c.attachmentIDBack) {
            const decrypted = await decryptBuffer(c.attachmentIDBack);
            enrichedComplainant.attachmentIDBack =
              await bufferToBase64DataUrl(decrypted);
          }
        } catch (err) {
          console.warn("Failed to decrypt ID back:", err);
        }

        try {
          if (c.attachmentUtility) {
            const decrypted = await decryptBuffer(c.attachmentUtility);
            enrichedComplainant.attachmentUtility =
              await bufferToBase64DataUrl(decrypted);
          }
        } catch (err) {
          console.warn("Failed to decrypt utility bill:", err);
        }

        return {
          ...blotter,
          attachments: decryptedAttachments,
          complainant: enrichedComplainant,
        };
      })
    );

    const totalCount = await prisma.blotter.count({ where });

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
  } catch (err) {
    console.error("Error fetching blotters:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blotters" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
