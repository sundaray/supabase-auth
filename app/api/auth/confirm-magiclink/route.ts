import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";
import { saveUser } from "@/lib/save-user";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const next = searchParams.get("next");
  const type = searchParams.get("type") as "magiclink";
  const token_hash = searchParams.get("token_hash");

  if (token_hash && type && next) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await saveUser(user.id, user.email!, type);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}
