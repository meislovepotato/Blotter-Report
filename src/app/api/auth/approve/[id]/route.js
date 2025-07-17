import { NextResponse } from "next/server";
import { prisma, generateSequentialAdminId } from "@/lib";
import { sendEmail } from "@/lib/server/sendEmail";

export async function POST(req, context) {
  const { params } = context;
  const id = params.id;

  try {
    // Get the pending admin
    const pending = await prisma.pendingAdmin.findUnique({ where: { id } });

    if (!pending) {
      return NextResponse.json(
        { error: "Pending admin not found." },
        { status: 404 }
      );
    }

    // Generate official Admin ID
    const adminId = await generateSequentialAdminId();

    // Create in Admin table
    await prisma.admin.create({
      data: {
        id: adminId,
        name: pending.name,
        email: pending.email,
        phoneNumber: pending.phoneNumber,
        password: pending.password, // already hashed from signup
        dashboardRole: "STAFF",
        hierarchyRole: "CLERK",
      },
    });

    // Delete from PendingAdmin
    await prisma.pendingAdmin.delete({ where: { id } });

    // Send login ID via email (stubbed)
    await sendEmail({
      to: pending.email,
      subject: "Your Admin Account Has Been Approved",
      html: `<p>Hi ${pending.name},</p>
             <p>Your admin request has been approved! You can now log in using the following credentials:</p>
             <p><strong>Admin ID:</strong> ${adminId}</p>
             <p><strong>Password:</strong> (the one you set)</p>
             <p>Please log in and complete your profile if needed.</p>`,
    });

    return NextResponse.json({
      message: "Admin approved and notified via email.",
    });
  } catch (err) {
    console.error("Approval error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
