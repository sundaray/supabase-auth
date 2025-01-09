import "server-only";
import { supabase } from "@/lib/supabase";
import { PasswordResetError } from "@/lib/password-reset-error";

export async function validateToken(token: string) {
  console.log("Token inside validate token: ", token);

  try {
    // Check if token exists
    const { data, error } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error) {
      throw new PasswordResetError("TOKEN_NOT_FOUND");
    }

    // Check token expiry
    if (new Date(data.expires) < new Date()) {
      throw new PasswordResetError("TOKEN_EXPIRED");
    }
  } catch (error) {
    throw error;
  }
}
