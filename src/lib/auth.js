import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function generateSequentialAdminId() {
  const lastAdmin = await prisma.admin.findFirst({
    where: {
      id: {
        startsWith: "ADM",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let nextNumber = 1001; // Start from 1001

  if (lastAdmin && lastAdmin.id.startsWith("ADM")) {
    const lastNumber = parseInt(lastAdmin.id.substring(3));
    nextNumber = lastNumber + 1;
  }

  return `ADM${nextNumber}`;
}
