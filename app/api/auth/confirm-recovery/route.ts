import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const next = searchParams.get("next");
  const type = searchParams.get("type") as "recovery";
  const token_hash = searchParams.get("token_hash");

  if (token_hash && type && next) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
