"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      // Logic: Admin goes to dashboard, everyone else to shop
      if (email === "admin@threadtheory.com") {
        router.push("/admin");
      } else {
        router.push("/shop");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-slate-900 p-6">
      <div className="w-full max-w-sm">
        
        {/* Minimal Branding */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
            ThreadTheory
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Identity Verification</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium focus:bg-white focus:border-slate-300 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium focus:bg-white focus:border-slate-300 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all active:scale-[0.98] disabled:bg-slate-300"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
          
          <button 
            type="button"
            className="w-full text-slate-400 py-2 text-[10px] font-bold uppercase tracking-widest hover:text-black transition-all"
          >
            Request Access
          </button>
        </form>

        {message && (
          <p className="mt-8 text-center text-xs font-bold text-red-500 uppercase tracking-tighter animate-pulse">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}