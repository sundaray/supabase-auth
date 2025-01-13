import { createClient } from "@/supabase/client";

export async function getUserRole(userId: string) {
  const supabase = await createClient();

  try {
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId!)
      .single();

    return {
      role: user?.role,
    };
  } catch (error) {
    console.log("getUserRole error: ", error);
    return {
      role: null,
    };
  }
}
