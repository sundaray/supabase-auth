"use server";

import { redirect } from "next/navigation";
import { emailSchema, emailPasswordSchema } from "@/schema";
import { parseWithZod } from "@conform-to/zod";
import { checkUserExists } from "@/lib/check-user-exists";
import { sendEmailMagicLink } from "@/lib/send-email-magic-link";
import { sendEmailPasswordSignUpLink } from "@/lib/send-email-password-signup-link";
import { createClient } from "@/supabase/server";
import { adminAuthClient } from "@/supabase/admin";

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
    schema: emailSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const email = submission.value.email;

  let errorOccurred = false;

  try {
    // Generate the magic link
    const { data, error } = await adminAuthClient.generateLink({
      type: "magiclink",
      email,
    });

    if (error) throw error;

    const confirmUrl = new URL(
      "/api/auth/confirm",
      process.env.NEXT_PUBLIC_SITE_URL,
    );
    confirmUrl.searchParams.set("token_hash", data.properties.hashed_token);
    confirmUrl.searchParams.set("type", "magiclink");
    confirmUrl.searchParams.set("next", next);

    await sendEmailMagicLink(submission.value.email, confirmUrl.toString());
  } catch (error) {
    console.log("Failed to send Email magic link: ", error);
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
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
    schema: emailPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let signupSuccessful = false;
  const email = submission.value.email;
  const password = submission.value.password;

  try {
    // Check if user already exists
    const { exists, error: checkError } = await checkUserExists(email);

    if (checkError) {
      throw checkError;
    }

    if (exists) {
      return submission.reply({
        formErrors: ["An account with this email already exists."],
      });
    }

    // If user doesn't exist, proceed with signup
    const { data, error } = await adminAuthClient.generateLink({
      type: "signup",
      email,
      password,
    });

    if (error) throw error;

    // Create confirmation URL
    const confirmUrl = new URL(
      "/api/auth/confirm",
      process.env.NEXT_PUBLIC_SITE_URL,
    );
    confirmUrl.searchParams.set("token_hash", data.properties.hashed_token);
    confirmUrl.searchParams.set("type", "signup");
    confirmUrl.searchParams.set("next", next);

    // Send email with confirmation link
    await sendEmailPasswordSignUpLink(email, confirmUrl.toString());

    signupSuccessful = true;
  } catch (error) {
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (signupSuccessful) {
      redirect("/signup/check-email");
    }
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
    schema: emailPasswordSchema,
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
