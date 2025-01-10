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

  let errorOccurred = false;
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
    errorOccurred = true;
    return submission.reply({
      formErrors: ["An unexpected error occurred."],
    });
  } finally {
    if (!errorOccurred) {
      redirect("/signin/check-email");
    }
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

  let errorOccurred = false;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: submission.value.email,
      password: submission.value.password,
    });

    console.log("Email/password sign in data: ", data);
    console.log("Email/password sign in error: ", error);

    if (error) {
      errorOccurred = true;

      // Check if it's an invalid credentials error
      if (error.status === 400 && error.code === "invalid_credentials") {
        return submission.reply({
          formErrors: ["The email or password you entered is incorrect."],
        });
      }

      // Handle any other Supabase auth errors
      return submission.reply({
        formErrors: ["Something went wrong. Please try again."],
      });
    }
  } catch (error) {
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    // Only redirect if no errors occurred
    if (!errorOccurred) {
      redirect(next);
    }
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
