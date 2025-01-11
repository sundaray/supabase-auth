import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next");
  const tokenHash = searchParams.get("token_hash");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: tokenHash!,
  });

  return NextResponse.redirect(`${origin}${next}`);
}
