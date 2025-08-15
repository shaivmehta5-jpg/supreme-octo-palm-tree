"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Convert the hash to URLSearchParams format
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        // Store session in Supabase
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(({ error }) => {
          if (error) {
            console.error("Error setting session:", error);
          } else {
            // Session stored successfully → go to onboarding
            router.replace("/onboarding");
          }
        });
      } else {
        console.error("Missing access or refresh token in callback URL.");
        router.replace("/login");
      }
    } else {
      console.error("No hash in callback URL.");
      router.replace("/login");
    }
  }, [router, supabase]);

  return <p>Signing you in...</p>;
}