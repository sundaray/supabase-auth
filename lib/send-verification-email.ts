import { resend } from "@/lib/resend";
import { EmailVerificationTemplate } from "@/components/email-verification-template";

export async function sendVerificationEmail(email: string, token: string) {
  const url = new URL(
    `/api/auth/verify-credentials-email?token=${token}&email=${encodeURIComponent(email)}`,
    process.env.AUTH_URL,
  );

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Sign in to your account",
      react: EmailVerificationTemplate({ url: url.toString() }),
    });

    if (error) {
      console.log("Failed to send verification email:", error);
    }
  } catch (error) {
    console.log(
      "An unexpected error occurred while sending verification email:",
      error,
    );
  }
}
