import "server-only";
import { createClient } from "@/supabase/server";

export async function checkUserExists(email: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw error;
    }

    return {
      exists: true,
      error: null,
    };
  } catch (error) {
    console.log("checkUserExists error: ", error);
    return {
      exists: false,
      error,
    };
  }
}
