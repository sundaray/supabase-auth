"use server";

import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { signInWithEmailSchema } from "@/schema";
import { parseWithZod } from "@conform-to/zod";
import { signInWithEmailAndPasswordSchema } from "@/schema";

/************************************************
 * Sign In With Google
 ************************************************/

export async function signInWithGoogle(from: string) {}

/************************************************
 * Sign In With Email (Magic Link)
 ************************************************/

export async function signInWithEmail(
  next: string,
  prevState: unknown,
  formData: FormData,
) {
  const submission = parseWithZod(formData, {
    schema: signInWithEmailSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: submission.value.email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm?next=${next}`,
      },
    });

    if (error) {
      return submission.reply({
        formErrors: [error.message],
      });
    }

    return submission.reply({
      formErrors: ["Check your email for the login link!"],
    });
  } catch (error) {
    return submission.reply({
      formErrors: ["An unexpected error occurred."],
    });
  }
}

/************************************************
 * Sign In With Email and Password
 ************************************************/

export async function signInWithEmailAndPassword(
  next: string,
  prevState: unknown,
  formData: FormData,
) {
  const submission = parseWithZod(formData, {
    schema: signInWithEmailAndPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
}

/************************************************
 * Sign Out Handler
 ************************************************/

export async function handleSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
