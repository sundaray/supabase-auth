"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { sendPasswordResetLink } from "@/lib/send-password-reset-link";
import { emailSchema, resetPasswordSchema } from "@/schema";
import { createClient } from "@/supabase/server";
import { adminAuthClient } from "@/supabase/admin";

/************************************************
 * Forgot password
 ************************************************/

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
    const { data, error } = await adminAuthClient.generateLink({
      type: "recovery",
      email,
    });

    if (error) throw error;

    const confirmUrl = new URL(
      "/api/auth/confirm-recovery",
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

/************************************************
 * Reset password
 ************************************************/

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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Update the user's password
    if (user && user.id) {
      const response = await adminAuthClient.updateUserById(user.id, {
        password: submission.value.newPassword,
      });
    }
  } catch (error) {
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccured) {
      redirect("/reset-password/success");
    }
  }
}
