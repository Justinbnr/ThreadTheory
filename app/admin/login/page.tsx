"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Only allow admin email
    if (email !== "admin@threadtheory.com") {
      setMessage("Access denied. Admin credentials required.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-6 font-sans selection:bg-white selection:text-black">
      <div className="w-full max-w-sm">

        {/* Back */}
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors mb-12 block">
          ← Back
        </Link>

        {/* Branding */}
        <div className="mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 text-white">
            ThreadTheory
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Admin Portal</p>
        </div>

        {/* Warning badge */}
        <div className="mb-8 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-yellow-400 text-xs">⚠</span>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Restricted Access — Staff Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-medium text-white placeholder:text-slate-600 focus:border-slate-500 transition-all"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-medium text-white placeholder:text-slate-600 focus:border-slate-500 transition-all"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-all active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-500"
          >
            {loading ? "Authenticating..." : "Access Console"}
          </button>
        </form>

        {message && (
          <p className="mt-8 text-center text-xs font-bold text-red-400 uppercase tracking-tighter animate-pulse">
            {message}
          </p>
        )}

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
            Customer?{" "}
            <Link href="/login" className="text-white hover:underline">
              Member Login →
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}