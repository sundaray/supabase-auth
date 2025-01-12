import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";
import { AuthMethodType } from "@/types";
import { saveUser } from "@/lib/save-user";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const next = searchParams.get("next");
  const type = searchParams.get("type") as AuthMethodType;
  const token_hash = searchParams.get("token_hash");

  if (token_hash && type && next) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && type !== "recovery") {
      // Get the user data after verification
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Save user to public.users table
        await saveUser(user.id, user.email!, type);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    if (!error && type === "recovery") {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
