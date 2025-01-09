import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

type VerificationStatus =
  | "token-valid"
  | "token-invalid"
  | "token-expired"
  | "internal-error";

function getRedirectUrl(
  status: VerificationStatus,
  token?: string,
  email?: string,
) {
  if (
    status === "token-invalid" ||
    status === "token-expired" ||
    status === "internal-error"
  ) {
    return `/reset-password?message=${status}`;
  }
  return `/reset-password?message=${status}&token=${token}&email=${email}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const origin = request.nextUrl.origin;

  const createRedirect = (
    status: VerificationStatus,
    token?: string,
    email?: string,
  ) => {
    const redirectUrl = new URL(getRedirectUrl(status, token, email), origin);
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

    // Token exists and is not expired
    return createRedirect("token-valid", token!, email!);
  } catch (error) {
    return createRedirect("internal-error");
  }
}
