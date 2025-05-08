import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32 bytes key

// Decrypt function
const decrypt = (encryptedData) => {
  try {
    const iv = encryptedData.slice(0, 16); // Extract IV
    const encryptedText = encryptedData.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString("base64"); // Convert back to base64
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const blotters = await prisma.blotter.findMany();

    const decryptedBlotters = blotters.map((blotter) => ({
      id: blotter.id,
      complainant: blotter.complainant,
      category: blotter.category,
      description: blotter.description,
      address: blotter.fullAddress,
      status: blotter.status,
      attachmentFront: decrypt(blotter.attachmentFront),
      attachmentBack: decrypt(blotter.attachmentBack),
    }));

    return NextResponse.json(decryptedBlotters, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
