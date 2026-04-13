"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-black tracking-tighter">ThreadTheory</h1>
        <div>
          <Link href="/shop" className="text-sm font-medium text-slate-700 hover:text-slate-900">Shop</Link>
          <Link href="/admin" className="text-sm font-medium text-slate-700 hover:text-slate-900">Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="py-16 px-4 text-center">
        <h2 className="text-5xl font-extrabold mb-4 text-black">Welcome to ThreadTheory</h2>
        <p className="text-slate-500">Where the highest quality goods delivered to your door.</p>
        <p className="text-slate-500 mt-4">Login in to view our exclusive collection of products and experience the best in fashion and lifestyle. Shop now and elevate your style with ThreadTheory.</p>
      </header>
      
      {/* This is where we will have a sign in button that will take the user to view the nav bar */}
    </main>
  );
}
