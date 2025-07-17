import { NextResponse } from "next/server";
import { createToken, prisma, verifyPassword } from "@/lib";

export async function POST(req) {
  try {
    const { adminId, password } = await req.json();

    if (!adminId || !password) {
      return NextResponse.json(
        { error: "Missing admin ID or password." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Add await here!
    const token = await createToken({
      id: admin.id,
      name: admin.name,
      dashboardRole: admin.dashboardRole,
      hierarchyRole: admin.hierarchyRole,
    });

    // Create blank response
    const response = new NextResponse(
      JSON.stringify({ message: "Login successful." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Set the cookie
    response.cookies.set("auth", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
