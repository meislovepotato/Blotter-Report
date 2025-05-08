import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, adminKey } = await request.json();

    // Check if adminKey is provided
    if (!adminKey) {
      return NextResponse.json({ message: "Admin key is required" }, { status: 400 });
    }
    
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Check if adminKey matches the stored adminId
    if (user.adminId !== adminKey) {
      return NextResponse.json({ message: "Invalid Admin key" }, { status: 401 });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, adminId: user.adminId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // You can adjust the expiration as needed
    );

    return NextResponse.json({ message: "Sign-in successful", token, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
