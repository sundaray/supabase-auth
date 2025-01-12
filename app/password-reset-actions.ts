"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { sendPasswordResetLink } from "@/lib/send-password-reset-link";
import { emailSchema, resetPasswordSchema } from "@/schema";
import { validateToken } from "@/lib/validate-token";
import { resetPassword } from "@/lib/reset-password";
import { PasswordResetError } from "@/lib/password-reset-error";
import { adminAuthClient } from "@/supabase/admin";

export async function requestPasswordReset(
  prevState: unknown,
  formData: FormData,
) {
  const submission = parseWithZod(formData, {
    schema: emailSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const email = submission.value.email;

  let errorOccured = false;

  try {
    // Generate the magic link
    const { data, error } = await adminAuthClient.generateLink({
      type: "recovery",
      email,
    });

    if (error) throw error;

    const confirmUrl = new URL(
      "/api/auth/confirm",
      process.env.NEXT_PUBLIC_SITE_URL,
    );
    confirmUrl.searchParams.set("token_hash", data.properties.hashed_token);
    confirmUrl.searchParams.set("type", "recovery");
    confirmUrl.searchParams.set("next", "/reset-password");

    await sendPasswordResetLink(email, confirmUrl.toString());
  } catch (error) {
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccured) {
      redirect("/forgot-password/check-email");
    }
  }
}

export async function resetUserPassword(
  prevState: unknown,
  formData: FormData,
) {
  const submission = parseWithZod(formData, {
    schema: resetPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let errorOccured = false;

  try {
  } catch (error) {
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccured) {
      redirect("/signin");
    }
  }
}
