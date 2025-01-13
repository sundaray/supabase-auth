import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { saveUser } from "@/lib/save-user";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code && next) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the user data after verification
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Save user to public.users table
        await saveUser(user.id, user.email!, "google");
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
