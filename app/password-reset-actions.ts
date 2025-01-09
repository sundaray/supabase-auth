"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { validateAccount } from "@/lib/validate-account";
import { saveToken } from "@/lib/save-token";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";
import { forgotPasswordSchema, resetPasswordSchema } from "@/schema";
import { validateToken } from "@/lib/validate-token";
import { resetPassword } from "@/lib/reset-password";
import { PasswordResetError } from "@/lib/password-reset-error";

export async function requestPasswordReset(
  prevState: unknown,
  formData: FormData,
) {
  const submission = parseWithZod(formData, {
    schema: forgotPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const email = submission.value.email;
  const token = crypto.randomUUID();

  let errorOccured = false;

  try {
    await validateAccount(email);
    await saveToken(email, token);
    await sendPasswordResetEmail(email, token);
  } catch (error) {
    errorOccured = true;
    if (error instanceof PasswordResetError) {
      return submission.reply({
        formErrors: [PasswordResetError.getErrorMessage(error.code)],
      });
    }
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
  token: string,
  email: string,
  prevState: unknown,
  formData: FormData,
) {
  const submission = parseWithZod(formData, {
    schema: resetPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  if (!token) {
    return submission.reply({
      formErrors: ["Token not found."],
    });
  }

  if (!email) {
    return submission.reply({
      formErrors: ["User not found."],
    });
  }

  let errorOccured = false;

  console.log("User email inside reset password server action: ", email);

  try {
    await validateToken(token);
    await resetPassword(email, submission.value.newPassword, token);
  } catch (error) {
    errorOccured = true;
    if (error instanceof PasswordResetError) {
      return submission.reply({
        formErrors: [PasswordResetError.getErrorMessage(error.code)],
      });
    }
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (!errorOccured) {
      redirect("/reset-password/success");
    }
  }
}
