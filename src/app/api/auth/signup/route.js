import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma"; // Update path to your Prisma instance

export async function POST(request) {
  const { name, email, address, password, role, staffId } = await request.json();

  if (role === "staff" && !staffId) {
    return NextResponse.json({ message: "Staff ID is required for staff role." }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role,
        staffId: role === "staff" ? staffId : null,
      },
    });
    return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
