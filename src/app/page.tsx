import React from 'react';
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col items-center px-5">
      <header className="pt-10 pb-5 text-center">
        <h1 className="text-5xl font-bold">Placeholder</h1>
      </header>
      <main className="max-w-3xl text-center">
        <p className="text-lg leading-relaxed text-gray-400 mb-10">
          Welcome to Placeholder — Doing the simple things, but better. Unlock your potential through modern, customised, and holistic learning methods.
        </p>
        <section className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-14">
          <div className="bg-[#1e1e1e] p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform duration-200">
            <h3 className="text-teal-400 font-semibold mb-2">Personalized Learning</h3>
            <p>Adaptive paths designed to match your strengths, weaknesses, and pace of learning.</p>
          </div>
          <div className="bg-[#1e1e1e] p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform duration-200">
            <h3 className="text-teal-400 font-semibold mb-2">2x Learning Speed</h3>
            <p>Techniques rooted in cognitive science and focus optimization to maximize efficiency.</p>
          </div>
          <div className="bg-[#1e1e1e] p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform duration-200">
            <h3 className="text-teal-400 font-semibold mb-2">Holistic Growth</h3>
            <p>Combining academics with reflective writing, reading, and problem-solving skills.</p>
          </div>
        </section>
        <section className="max-w-xl mx-auto text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
      <p className="text-gray-300 mb-6">
        High-quality, personalized learning methods built on cognitive psychology principles.
      </p>
      
      {/* Start Learning Button */}
      <Link
        href="/login"
        className="px-6 py-3 bg-green-600 rounded-md text-white font-semibold shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
      >
        Start Learning
      </Link>
      
    </section>
      </main>
      <footer className="py-5 text-sm text-gray-500">
        &copy; 2025 Placeholder. All rights reserved.
      </footer>
    </div>
  );
}