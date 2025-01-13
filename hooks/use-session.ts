import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/supabase/client";
import { getUserRole } from "@/lib/get-user-role";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function retrieveSession() {
      const supabase = createClient();
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setStatus("unauthenticated");
          return;
        }

        const { role } = await getUserRole(session.user.id);
        setSession(session);
        setRole(role);
        setStatus("authenticated");
      } catch (error) {
        console.error("Session fetch error:", error);
        setError("Failed to check authentication status");
        setStatus("unauthenticated");
      }
    }

    retrieveSession();
  }, []);

  return { error, session, status, role };
}
