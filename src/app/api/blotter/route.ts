import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const {
      complainant,
      fullAddress,
      description,
      phoneNumber,
      attachmentFront,
      attachmentBack,
    } = body;

    if (
      !complainant ||
      !fullAddress ||
      !description ||
      !phoneNumber ||
      !attachmentFront ||
      !attachmentBack
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    console.log("complainant", complainant);
    console.log("fullAddress", fullAddress);
    console.log("description", description);
    console.log("phoneNumber", phoneNumber);

    const base64Front = attachmentFront.replace(/^data:image\/\w+;base64,/, "");
    const bufferFront = Buffer.from(base64Front, "base64");
    const base64Back = attachmentBack.replace(/^data:image\/\w+;base64,/, "");
    const bufferBack = Buffer.from(base64Back, "base64");

    const newBlotterEntry = await prisma.blotter.create({
      data: {
        complainant: complainant,
        fullAddress: fullAddress,
        description: description,
        phoneNumber: phoneNumber,
        attachmentFront: bufferFront,
        attachmentBack: bufferBack,
      },
    });

    console.log("newBlotterEntry", newBlotterEntry);
    return NextResponse.json(newBlotterEntry, { status: 201 });
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
