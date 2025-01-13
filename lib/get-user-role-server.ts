import { createClient } from "@/supabase/server";

export async function getUserRoleServer() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return {
        role: null,
      };
    }

    const userId = user?.id;
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    return {
      role: userData?.role,
    };
  } catch (error) {
    console.log("getUserRole error: ", error);
    return {
      role: null,
    };
  }
}
