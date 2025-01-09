import { User } from "next-auth";

import { supabase } from "@/lib/supabase";

export async function assignUserRole({ user }: { user: User }) {
  const ADMIN_EMAILS = ["rawgrittt@gmail.com"];

  // Determine if this email should have admin privileges
  const role = ADMIN_EMAILS.includes(user.email!) ? "admin" : "user";

  try {
    const { error } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ role: role })
      .eq("email", user.email!);

    if (error) {
      console.log(`Failed to assign admin role to ${user.email}:`, error);
    }
  } catch (error) {
    console.log(
      `Unexpected error while assigning admin role to ${user.email}:`,
      error,
    );
  }
}
