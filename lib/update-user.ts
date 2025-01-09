import "server-only";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export async function updateUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { error } = await supabase
      .schema("next_auth")
      .from("users")
      .update({
        password: hashedPassword,
      })
      .eq("email", email)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to update user:", error);
    }
  } catch (error) {
    console.log("An unexpected error occurred while updating user: ", error);
  }
}
