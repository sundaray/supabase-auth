import "server-only";
import { createClient } from "@/supabase/server";

export async function checkUserExists(email: string) {
  const supabase = await createClient();

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("email, providers")
      .eq("email", email)
      .single();

    if (error) {
      throw error;
    }

    // Check if the user has signed up with credentials
    const hasCredentials = user?.providers?.includes("credentials") ?? false;

    return {
      exists: true,
      hasCredentials,
      error: null,
    };
  } catch (error) {
    console.log("checkUserExists error: ", error);
    return {
      exists: false,
      hasCredentials: false,
      error,
    };
  }
}
