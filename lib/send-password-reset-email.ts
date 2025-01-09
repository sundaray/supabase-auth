import "server-only";
import { resend } from "@/lib/resend";
import { PasswordResetTemplate } from "@/components/password-reset-email-template";
import { PasswordResetError } from "@/lib/password-reset-error";

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = new URL(
    `/api/auth/verify-password-reset-token?token=${token}&email=${encodeURIComponent(email)}`,
    process.env.AUTH_URL,
  );

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset your password",
      react: PasswordResetTemplate({ url: url.toString() }),
    });

    if (error) {
      console.log("Failed to send password reset link: ", error);
      throw new PasswordResetError("EMAIL_NOT_SENT");
    }
  } catch (error) {
    console.log(
      "An unexpected error occured while sending the password reset link: ",
      error,
    );
    throw error;
  }
}
