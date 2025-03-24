import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../../lib/prisma";

export async function POST(request) {
  try {
    const { name, email, address, password, staffId } = await request.json();

    // Validate required fields
    if (!name || !email || !address || !password || !staffId) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Password must contain at least one number and one special character
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~`])/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { message: "Password must contain at least one special symbol and one number." },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use." },
        { status: 400 }
      );
    }

    const existingStaffId = await prisma.user.findUnique({
      where: { staffId },
    });
    if (existingStaffId) {
      return NextResponse.json(
        { message: "staffID is already in use." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        staffId,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
