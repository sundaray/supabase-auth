"use server";

import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { signInWithEmailSchema } from "@/schema";
import { parseWithZod } from "@conform-to/zod";
import { signInWithEmailAndPasswordSchema } from "@/schema";

/************************************************
 * Sign In With Google
 ************************************************/

export async function signInWithGoogle(next: string) {
  let authUrl;
  try {
    const supabase = await createClient();

    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?next=${next}`,
      },
    });

    authUrl = data.url;
  } catch (error) {
    return {
      error: true,
      message: "Something went wrong. Please try again.",
    };
  } finally {
    redirect(authUrl as string);
  }
}

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
 * Sign Up With Email and Password
 ************************************************/

export async function signUpWithEmailAndPassword(
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

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: submission.value.email,
      password: submission.value.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm?next=${next}`,
      },
    });

    console.log("Signup response:", { data, error });

    if (error) {
      return submission.reply({
        formErrors: [error.message],
      });
    }

    // Log the user object to see what we got back
    console.log("User data:", data?.user);

    return submission.reply({
      formErrors: ["Check your email for email confirmation"],
    });
  } catch (error) {
    return submission.reply({
      formErrors: ["An unexpected error occurred."],
    });
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
