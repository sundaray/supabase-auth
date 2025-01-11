import { createClient } from "@/supabase/server";

const ADMIN_EMAILS = ["rawgrittt@gmail.com"];

export async function saveUser(
  userId: string,
  email: string,
  type: "magiclink" | "signup" | "google",
) {
  const supabase = await createClient();

  try {
    // Step 1: Check if a user with the given email exists
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (findError) {
      // User not found, create a new user
      const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: userId,
            email,
            role,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Add `type` to the `providers` array for the new user
      const { error: rpcError } = await supabase.rpc("add_provider", {
        user_id: newUser.id,
        provider: type,
      });

      if (rpcError) throw rpcError;

      return { user: newUser, error: null };
    }

    if (existingUser) {
      // Check if the `type` is already in the `providers` array
      const { data: providerCheck, error: providerError } = await supabase
        .from("users")
        .select("providers")
        .eq("id", existingUser.id)
        .contains("providers", [type]); // Check if `type` exists in `providers`

      if (providerError) throw providerError;

      if (providerCheck.length > 0) {
        // If the `type` already exists, do nothing
        return { user: existingUser, error: null };
      }

      // `type` doesn't exist, so append it to the `providers` array
      const { error: rpcError } = await supabase.rpc("add_provider", {
        user_id: existingUser.id,
        provider: type,
      });

      if (rpcError) throw rpcError;

      return { user: existingUser, error: null };
    }
  } catch (error) {
    console.log("saveUser error: ", error);
    return { user: null, error };
  }
}
