import "server-only";
import { supabase } from "@/lib/supabase";

export async function saveToken(email: string, token: string) {
  try {
    const { error } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .insert({
        token,
        identifier: email,
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      });

    if (error) {
      console.log("Failed to save token: ", error);
    }
  } catch (error) {
    console.log("An unexpected error occured while saving token: ", error);
  }
}
