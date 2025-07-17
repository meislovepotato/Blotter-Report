import { NextResponse } from "next/server";
import { hashPassword, prisma } from "@/lib";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phoneNumber, password, confirmPassword } = body;

    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Check if email/phone already exists in Admin or PendingAdmin
    const existingAdmin = await prisma.admin.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    const existingPending = await prisma.pendingAdmin.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (existingAdmin || existingPending) {
      return NextResponse.json(
        {
          error:
            "Email or phone number already registered or pending approval.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.pendingAdmin.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Signup successful. Awaiting admin approval." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Pending signup error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
