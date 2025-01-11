import { resend } from "@/lib/resend";
import { EmailPasswordSignUpLinkTemplate } from "@/components/email-password-signup-link-template";

export async function sendEmailPasswordSignUpLink(email: string, url: string) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Sign in to your account",
      react: EmailPasswordSignUpLinkTemplate({ url }),
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
