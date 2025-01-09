import "server-only";

import { EmailSignInTemplate } from "@/email/email-signin-template";

import { resend } from "@/lib/resend";

export async function sendEmailSignInLink(email: string, url: string) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Sign in to your account",
      react: EmailSignInTemplate({ url }),
    });

    if (error) {
      console.log("Failed to send sign-in email: ", error);
      return {
        success: false,
      };
    }
    return { success: true };
  } catch (error) {
    console.log(
      "An unexpected error occured while sending the sign-in email: ",
      error,
    );
    return { success: false, error };
  }
}
