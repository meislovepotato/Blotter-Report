import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Your Barangay <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (err) {
    console.error("sendEmail error:", err);
    throw err;
  }
}
