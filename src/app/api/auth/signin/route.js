// app/api/auth/signin/route.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, role, staffkey } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== role) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (role === "staff" && user.staffId !== staffkey) {
      return NextResponse.json({ message: "Invalid staff key" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ message: "Sign-in successful", token, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
