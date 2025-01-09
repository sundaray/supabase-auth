import "server-only";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export async function saveUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { error } = await supabase
      .schema("next_auth")
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        credentialsEmailVerified: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Failed to save user:", error);
    }
  } catch (error) {
    console.log("An unexpected error occurred while saving user: ", error);
  }
}
