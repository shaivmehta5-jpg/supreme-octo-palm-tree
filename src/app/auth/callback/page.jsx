"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    (async () => {
      // After Google redirects back, Supabase should have a session.
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        // If, for some reason, there’s still no session, retry OAuth.
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        return;
      }

      // Fetch or create profile
      const { data: profile, error } = await supabase
        .from("user_profile")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
        // Fallback: go to onboarding and let it handle creation
        router.replace("/onboarding");
        return;
      }

      if (!profile) {
        const { error: insertError } = await supabase
          .from("user_profile")
          .insert([{ user_id: session.user.id, completed_onboarding: false }]);

        if (insertError) {
          console.error("Profile create error:", insertError);
          router.replace("/onboarding");
          return;
        }
        router.replace("/onboarding");
        return;
      }

      // Route based on completion
      if (profile.completed_onboarding) {
        router.replace("/home");
      } else {
        router.replace("/onboarding");
      }
    })();
  }, [router, supabase]);

  return <p>Finishing sign-in…</p>;
}
