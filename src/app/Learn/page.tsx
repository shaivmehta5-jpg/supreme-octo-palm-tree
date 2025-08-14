// src/app/Learn/page.tsx
"use client"
import React from 'react';
import Link from "next/link";
import { supabase } from '../lib/supabaseClient'
export default function SubjectsPage() {
  const subjects = [
    { name: "Physics", href: "Learn/physics" },
    { name: "Chemistry", href: "Learn/chemistry" },
    { name: "Math", href: "Learn/math" },
  ];

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10">Choose a Subject</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full">
        {subjects.map(({ name, href }) => (
          <Link
            key={name}
            href={href}
            className="bg-gray-800 hover:bg-green-600 transition rounded-lg p-8 text-center text-2xl font-semibold shadow-md"
          >
            {name}
          </Link>
        ))}
      </div>
      <button
        onClick={async () => {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${location.origin}/auth/callback`,
            },
          });
          if (error) console.error("Error signing in:", error);
        }}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md"
      >
        Sign in with Google
      </button>
    </main>

  );
}
