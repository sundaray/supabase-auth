import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Get the pathname from the request URL
  const { nextUrl } = request;
  const path = nextUrl.pathname;
  // Get the current user from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users to sign-in page
  if (!user) {
    const signInUrl = new URL("/signin", nextUrl);
    signInUrl.searchParams.set("next", path);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users attempting to access the sign-in page to the home page
  if (user && path === "/signin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return supabaseResponse;
}
