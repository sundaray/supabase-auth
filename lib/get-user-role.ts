import { User } from "next-auth";

import { supabase } from "@/lib/supabase";

export async function getUserRole(user: User) {
  try {
    const { data: userData, error } = await supabase
      .schema("next_auth")
      .from("users")
      .select("role")
      .eq("email", user.email!)
      .single();

    if (error) {
      return { success: false };
    }

    return {
      success: true,
      role: userData.role,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
