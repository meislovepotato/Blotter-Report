import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const ensureBufferOrNull = (val) => (Buffer.isBuffer(val) ? val : null);

export async function upsertComplainant(data) {
  const {
    phoneNumber,
    complainantFirstName,
    complainantMiddleName,
    complainantLastName,
    fullAddress,
    otherContacts,
    proofType,
    attachmentIDFront,
    attachmentIDBack,
    attachmentUtility,
  } = data;

  const safePayload = {
    firstName: complainantFirstName,
    middleName: complainantMiddleName || null,
    lastName: complainantLastName,
    fullAddress,
    otherContacts: otherContacts || null,
    residencyProof: proofType,
    attachmentIDFront: ensureBufferOrNull(attachmentIDFront),
    attachmentIDBack: ensureBufferOrNull(attachmentIDBack),
    attachmentUtility: ensureBufferOrNull(attachmentUtility),
  };

  const existing = await prisma.complainant.findUnique({
    where: { phoneNumber },
  });

  if (existing) {
    await prisma.complainant.update({
      where: { id: existing.id },
      data: safePayload,
    });
    return existing.id;
  }

  const newComplainant = await prisma.complainant.create({
    data: {
      phoneNumber,
      ...safePayload,
    },
  });

  return newComplainant.id;
}
