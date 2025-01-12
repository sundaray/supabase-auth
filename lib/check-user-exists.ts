import "server-only";
import { createClient } from "@/supabase/server";

export async function checkUserExists(email: string) {
  const supabase = await createClient();

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, providers")
      .eq("email", email)
      .single();

    // Check if the user has signed up with email/password
    const hasSignedUp = user?.providers?.includes("signup") ?? false;

    return {
      exists: true,
      id: user?.id,
      hasSignedUp,
      error: null,
    };
  } catch (error) {
    console.log("checkUserExists error: ", error);
    return {
      exists: false,
      id: false,
      hasSignedUp: false,
      error,
    };
  }
}
