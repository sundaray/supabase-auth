"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  useEffect(() => {
    if (window.location.hash) {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (accessToken && refreshToken) {
        router.replace(
          `/api/auth/create-session?next=${next}&access_token=${accessToken}&refresh_token=${refreshToken}`,
        );
      }
    }
  }, [router]);

  return <p className="text-center text-sm">Processing sign-in...</p>;
}
