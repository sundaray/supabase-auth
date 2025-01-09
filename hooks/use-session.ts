import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/supabase/client";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  useEffect(() => {
    async function retrieveSession() {
      const supabase = createClient();
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setStatus("authenticated");
          return;
        }
        setStatus("unauthenticated");
      } catch (error) {
        setSession(null);
        setStatus("unauthenticated");
      }
    }

    retrieveSession();
  }, []);

  return { session, status };
}
