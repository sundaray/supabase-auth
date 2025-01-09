import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const redirectToUrl = searchParams.get("redirectToUrl")!;
  const next = new URL(redirectToUrl).searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      // Successful verification - redirect to the original destination
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Handle errors by redirecting to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
