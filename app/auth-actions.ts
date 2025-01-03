"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithGoogle() {
  try {
    await signIn("google", { redirectTo: "/" });
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return {
      error: true,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}
