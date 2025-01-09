import "server-only";
import { supabase } from "@/lib/supabase";
import { PasswordResetError } from "@/lib/password-reset-error";

export async function validateAccount(email: string) {
  try {
    // Fetch user details based on email
    const { data, error } = await supabase
      .schema("next_auth")
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw new PasswordResetError("USER_NOT_FOUND");
    }

    if (data.credentialsEmailVerified !== true) {
      throw new PasswordResetError("ACCOUNT_NOT_VERIFIED");
    }
  } catch (error) {
    console.error("Unexpected error during account validation:", error);
    throw error;
  }
}
