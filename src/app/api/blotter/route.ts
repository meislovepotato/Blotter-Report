import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";


// Category to severity mapping
const categorySeverityMap: Record<string, "EMERGENCY" | "URGENT" | "MODERATE" | "MINOR" | "INFORMATIONAL"> = {
  ACCIDENT: "URGENT",
  ANIMAL_COMPLAINT: "MINOR",
  ASSAULT: "EMERGENCY",
  DISORDERLY_CONDUCT: "MINOR",
  DISTURBANCE_OF_PEACE: "MINOR",
  DOMESTIC_VIOLENCE: "EMERGENCY",
  DRUG_RELATED: "MODERATE",
  FIRE: "EMERGENCY",
  FRAUD: "MINOR",
  HARASSMENT: "MODERATE",
  ILLEGAL_STRUCTURE: "MINOR",
  LOST_AND_FOUND: "INFORMATIONAL",
  MISSING_PERSON: "URGENT",
  NOISE_COMPLAINT: "MINOR",
  VANDALISM: "MODERATE",
  PUBLIC_DISTURBANCE: "MINOR",
  SUSPICIOUS_ACTIVITY: "MODERATE",
  THEFT: "MODERATE",
  TRAFFIC_INCIDENT: "URGENT",
  TRESPASSING: "MINOR",
  VIOLATION_OF_ORDINANCE: "MINOR",
  WEAPONS_OFFENSE: "EMERGENCY",
  OTHER: "INFORMATIONAL",
};

const prisma = new PrismaClient();
console.log(Buffer.from(process.env.ENCRYPTION_KEY, "hex").length); // Should be 32
// Encryption configuration
const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32 bytes key (use a secure key from env)
const iv = crypto.randomBytes(16); // 16 bytes initialization vector

export const config = {
  api: {
    bodyParser: true,
  },
};


// Encrypt function
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const {
      complainant,
      fullAddress,
      description,
      category,
      phoneNumber,
      attachmentFront,
      attachmentBack,
    } = body;

    if (
      !complainant ||
      !fullAddress ||
      !description ||
      !category ||
      !phoneNumber ||
      !attachmentFront ||
      !attachmentBack
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // console.log("complainant", complainant);
    // console.log("fullAddress", fullAddress);
    // console.log("description", description);
    // console.log("category", category);

    const base64Front = attachmentFront.replace(/^data:image\/\w+;base64,/, "");
    const bufferFront = Buffer.from(base64Front, "base64");
    const base64Back = attachmentBack.replace(/^data:image\/\w+;base64,/, "");
    const bufferBack = Buffer.from(base64Back, "base64");

    const encryptedFront = encrypt(bufferFront);
    const encryptedBack = encrypt(bufferBack);
    // console.log("encryptedFront", encryptedFront);
    // console.log("encryptedBack", encryptedBack); 
    
    // Map category to severity
    const severity = categorySeverityMap[category] || "INFORMATIONAL";

    const newBlotterEntry = await prisma.blotter.create({
      data: {
        complainant: complainant,
        fullAddress: fullAddress,
        description: description,
        category: category,
        phoneNumber: phoneNumber,
        attachmentFront: encryptedFront,
        attachmentBack: encryptedBack,
        severity: severity, 
      },
    });

    // console.log("newBlotterEntry", newBlotterEntry);
    return NextResponse.json(newBlotterEntry, { status: 201 });
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
