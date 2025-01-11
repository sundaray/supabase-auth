import "server-only";
import { resend } from "@/lib/resend";
import { EmailMagicLinkTemplate } from "@/email/email-magiclink-template";

export async function sendEmailMagicLink(email: string, url: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Sign in to your account",
      react: EmailMagicLinkTemplate({ url }),
    });
  } catch (error) {
    console.log("sendEmailSignInLink error: ", error);
    throw error;
  }
}
