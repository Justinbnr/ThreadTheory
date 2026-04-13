"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      router.push("/shop");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-slate-900 p-6 font-sans selection:bg-black selection:text-white">
      <div className="w-full max-w-sm">

        {/* Back */}
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-black transition-colors mb-12 block">
          ← Back
        </Link>

        {/* Branding */}
        <div className="mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
            ThreadTheory
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Create Account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium focus:bg-white focus:border-slate-300 transition-all"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium focus:bg-white focus:border-slate-300 transition-all"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium focus:bg-white focus:border-slate-300 transition-all"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all active:scale-[0.98] disabled:bg-slate-300"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="mt-8 text-center text-xs font-bold text-red-500 uppercase tracking-tighter animate-pulse">
            {message}
          </p>
        )}

        {/* Already have account */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
            Already have an account?{" "}
            <Link href="/login" className="text-black hover:underline">
              Sign In →
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}