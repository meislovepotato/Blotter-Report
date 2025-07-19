import { NextResponse } from "next/server";
import { decryptBuffer, bufferToBase64DataUrl } from "@/lib/complaint";
import { prisma } from "@/lib";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      100
    );
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    // Fetch paginated blotters and total count
    const [blotters, totalCount] = await Promise.all([
      prisma.blotter.findMany({
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
          fromComplaint: {
            select: {
              trackingId: true,
              status: true,
            },
          },
        },
      }),
      prisma.blotter.count({ where }),
    ]);

    // Decrypt attachments and complainant files
    const enriched = await Promise.all(
      blotters.map(async (blotter) => {
        const decryptedAttachments = await Promise.all(
          blotter.attachments.map(async (att) => {
            try {
              const buf = await decryptBuffer(att.file);
              return { id: att.id, file: await bufferToBase64DataUrl(buf) };
            } catch {
              return { id: att.id, file: null };
            }
          })
        );

        const c = blotter.complainant || {};
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
          ...blotter,
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
    console.error("Error fetching blotters:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blotters" },
      { status: 500 }
    );
  }
}
