// src/app/Learn/page.tsx
"use client"
import React from 'react';
import Link from "next/link";
import { supabase } from '../lib/supabaseClient'
export default function SubjectsPage() {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10">LOGIN</h1>
      
     <button
  onClick={async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: `${window.location.origin}/auth/callback` },

    });

    console.log("Returned data:", data);
    console.log("Returned URL:", data?.url);

    if (error) {
      console.error("Error signing in:", error);
    }

    if (data?.url) {
      window.location.href = data.url; // force redirect
    }
  }}
>
  Sign in with Google
</button>



    </main>

  );
}