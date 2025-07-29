// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

async function ensurePrismaConnected() {
  if (!prisma._isConnected) {
    await prisma.$connect();
    prisma._isConnected = true;
  }
}

export { prisma, ensurePrismaConnected };
