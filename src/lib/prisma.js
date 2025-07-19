import { PrismaClient } from "@prisma/client";

// Use a global variable only in development
const globalForPrisma = globalThis;

// Add fallback in case it doesn't exist yet
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
