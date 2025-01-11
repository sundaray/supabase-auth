import "server-only";
import { resend } from "@/lib/resend";
import { EmailSignInTemplate } from "@/email/email-signin-template";

export async function sendEmailSignInLink(email: string, url: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Sign in to your account",
      react: EmailSignInTemplate({ url }),
    });
  } catch (error) {
    console.log("sendEmailSignInLink error: ", error);
    throw error;
  }
}
