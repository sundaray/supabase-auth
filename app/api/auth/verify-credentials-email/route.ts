import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

type VerificationStatus =
  | "token-valid"
  | "token-invalid"
  | "token-expired"
  | "internal-error";

function getRedirectUrl(status: VerificationStatus) {
  return `/signin/verify-email/status?message=${status}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const origin = request.nextUrl.origin;

  const createRedirect = (status: VerificationStatus) => {
    const redirectUrl = new URL(getRedirectUrl(status), origin);
    return NextResponse.redirect(redirectUrl);
  };

  try {
    const { data, error } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .select("*")
      .eq("token", token!)
      .single();

    if (error) {
      return createRedirect("token-invalid");
    }

    // Check token expiration
    if (new Date(data.expires) < new Date()) {
      return createRedirect("token-expired");
    }

    // update user's email verification status
    await supabase
      .schema("next_auth")
      .from("users")
      .update({ credentialsEmailVerified: true })
      .eq("email", email!);

    // Delete the used token
    await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .delete()
      .eq("token", token!);

    // Token exists and is not expired
    return createRedirect("token-valid");
  } catch (error) {
    return createRedirect("internal-error");
  }
}
