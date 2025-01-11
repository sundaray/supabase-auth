import { createClient } from "@/supabase/server";

const ADMIN_EMAILS = ["rawgrittt@gmail.com"];

export async function saveUser(
  userId: string,
  email: string,
  type: "magiclink" | "signup" | "google",
) {
  const supabase = await createClient();

  try {
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (existingUser) {
      return { user: existingUser, error: null };
    }

    // If user doesn't exist, create new user
    const role = ADMIN_EMAILS.includes(email) ? "admin" : "regular";

    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          email,
          role,
          providers: [type],
        },
      ])
      .select()
      .single();

    if (error) throw error;

    console.log("New user created: ", newUser);

    return { user: newUser, error: null };
  } catch (error) {
    console.log("saveUser error: ", error);
    return { user: null, error };
  }
}
