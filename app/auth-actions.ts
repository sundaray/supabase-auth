"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { adminAuthClient } from "@/supabase/admin";
import { parseWithZod } from "@conform-to/zod";
import {
  emailSchema,
  signInEmailPasswordSchema,
  signUpEmailPasswordSchema,
} from "@/schema";

import { checkUserExists } from "@/lib/check-user-exists";
import { sendEmailMagicLink } from "@/lib/send-email-magic-link";
import { sendEmailPasswordSignUpLink } from "@/lib/send-email-password-signup-link";

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
    if (authUrl) {
      redirect(authUrl);
    }
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
    const { data, error } = await adminAuthClient.generateLink({
      type: "magiclink",
      email,
    });

    if (error) throw error;

    const confirmUrl = new URL(
      "/api/auth/confirm-magiclink",
      process.env.NEXT_PUBLIC_SITE_URL,
    );
    confirmUrl.searchParams.set("token_hash", data.properties.hashed_token);
    confirmUrl.searchParams.set("type", "magiclink");
    confirmUrl.searchParams.set("next", next);

    await sendEmailMagicLink(submission.value.email, confirmUrl.toString());
  } catch (error) {
    console.log("Email magic link error: ", error);
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
    schema: signUpEmailPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let existingUserSignUpSuccessful = false;
  let newUserSignUpSuccessful = false;
  const email = submission.value.email;
  const password = submission.value.password;

  try {
    // Check if user already exists
    const {
      exists,
      id,
      hasSignedUp,
      error: checkError,
    } = await checkUserExists(email);

    if (checkError) {
      throw checkError;
    }

    // User exists and has already signed up
    if (exists && hasSignedUp) {
      return submission.reply({
        formErrors: ["An account with this email already exists."],
      });
    }

    // User exists but hasn't signed up
    if (exists && id && !hasSignedUp) {
      const supabase = await createClient();

      // Update the user's password
      await adminAuthClient.updateUserById(id, {
        password,
      });

      // Append "signup" to the `providers` array
      await supabase.rpc("add_provider", {
        user_id: id,
        provider: "signup",
      });

      existingUserSignUpSuccessful = true;
      return;
    }

    // New user (first time signup)
    const { data, error } = await adminAuthClient.generateLink({
      type: "signup",
      email,
      password,
    });

    if (error) throw error;

    // Create confirmation URL
    const confirmUrl = new URL(
      "/api/auth/confirm-signup",
      process.env.NEXT_PUBLIC_SITE_URL,
    );
    confirmUrl.searchParams.set("token_hash", data.properties.hashed_token);
    confirmUrl.searchParams.set("type", "signup");
    confirmUrl.searchParams.set("next", next);

    // Send email with sign-up link
    await sendEmailPasswordSignUpLink(email, confirmUrl.toString());

    newUserSignUpSuccessful = true;
  } catch (error) {
    console.log("Email/password sign up error: ", error);
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
    if (newUserSignUpSuccessful) {
      redirect("/signup/check-email");
    }
    if (existingUserSignUpSuccessful) {
      redirect("/signup/success");
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
    schema: signInEmailPasswordSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  let errorOccurred = false;

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: submission.value.email,
      password: submission.value.password,
    });

    if (error) {
      errorOccurred = true;

      // Check if it's an invalid credentials error
      if (error.status === 400 && error.code === "invalid_credentials") {
        return submission.reply({
          formErrors: ["The email or password you entered is incorrect."],
        });
      }
    }
  } catch (error) {
    errorOccurred = true;
    return submission.reply({
      formErrors: ["Something went wrong. Please try again."],
    });
  } finally {
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
