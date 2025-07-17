import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { name, email, address, password } = await request.json();

    // Validate required fields
    if (!name || !email || !address || !password ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Password must contain at least one number and one special character
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~`])/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must contain at least one special symbol and one number.",
        },
        { status: 400 }
      );
    }

    // Check if the email already exists in Admin table
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Email is already in use by an admin." },
        { status: 400 }
      );
    }

    // Check if the email already exists in PendingAdmin table
    const existingPending = await prisma.pendingAdmin.findUnique({
      where: { email },
    });
    if (existingPending) {
      return NextResponse.json(
        { message: "Email is already in use and awaiting approval." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if there are any admins yet
    const adminCount = await prisma.user.count();
    if (adminCount === 0) {
      // First signup: auto-approve as admin
      const newAdminId = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.user.create({
        data: {
          name,
          email,
          address,
          password: hashedPassword,
          adminId: newAdminId,
        },
      });
      return NextResponse.json(
        { message: "First admin created and approved!", adminId: newAdminId },
        { status: 201 }
      );
    }

    // Otherwise, save as pending
    const pending = await prisma.pendingAdmin.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Signup request sent for approval.", pendingId: pending.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
