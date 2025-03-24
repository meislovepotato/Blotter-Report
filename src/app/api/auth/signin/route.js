import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, staffKey } = await request.json();

    // Check if staffKey is provided
    if (!staffKey) {
      return NextResponse.json({ message: "Staff key is required" }, { status: 400 });
    }
    
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Check if staffKey matches the stored staffId
    if (user.staffId !== staffKey) {
      return NextResponse.json({ message: "Invalid staff key" }, { status: 401 });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, staffId: user.staffId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // You can adjust the expiration as needed
    );

    return NextResponse.json({ message: "Sign-in successful", token, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
