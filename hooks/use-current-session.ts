import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useCurrentSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  useEffect(() => {
    async function retrieveSession() {
      try {
        const sessionData = await getSession();
        if (sessionData) {
          setSession(sessionData);
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
