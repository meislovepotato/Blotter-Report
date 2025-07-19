import { NextResponse } from "next/server";
import { prisma } from "@/lib";
import { sendEmail } from "@/lib/server/sendEmail";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const pending = await prisma.pendingAdmin.findUnique({ where: { id } });

    if (!pending) {
      return NextResponse.json(
        { error: "Pending admin not found." },
        { status: 404 }
      );
    }

    // Delete the pending admin
    await prisma.pendingAdmin.delete({ where: { id } });

    // Send rejection email
    await sendEmail({
      to: pending.email,
      subject: "Admin Request Rejected",
      html: `<p>Hi ${pending.name},</p>
             <p>Unfortunately, your admin account request has been rejected by the barangay staff.</p>
             <p>If you believe this was a mistake, please reach out directly.</p>`,
    });

    return NextResponse.json({ message: "Admin rejected and notified." });
  } catch (err) {
    console.error("Rejection error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
