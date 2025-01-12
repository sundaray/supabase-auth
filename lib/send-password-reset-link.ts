import "server-only";
import { resend } from "@/lib/resend";
import { PasswordResetLinkTemplate } from "@/email/password-reset-link-template";

export async function sendPasswordResetLink(email: string, url: string) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset your password",
      react: PasswordResetLinkTemplate({ url }),
    });

    if (error) {
      console.log("Failed to send password reset link: ", error);
    }
  } catch (error) {
    console.log(
      "An unexpected error occured while sending the password reset link: ",
      error,
    );
    throw error;
  }
}
