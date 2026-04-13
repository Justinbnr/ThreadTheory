"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [orderTotal, setOrderTotal] = useState<string>("0.00");

  useEffect(() => {
    // We grab the total one last time before it's gone from state
    // Or you can pass it via URL params if you prefer.
    // For now, we'll just check if there's any residual total info or just show a clean state.
    const savedTotal = localStorage.getItem("last_order_total");
    if (savedTotal) setOrderTotal(savedTotal);
    
    // Ensure the cart is definitely empty now that the order is "complete"
    localStorage.removeItem("threadtheory_cart");
  }, []);

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center font-sans selection:bg-black selection:text-white">
      <div className="max-w-md w-full px-8 text-center space-y-12">
        
        {/* SUCCESS ICON/MARK */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border-2 border-black flex items-center justify-center rounded-full animate-in zoom-in duration-500">
            <span className="text-2xl font-black">✓</span>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="space-y-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Order Confirmed</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
            Your transaction has been processed. <br />
            An electronic receipt is being sent to your identity.
          </p>
        </div>

        {/* LOGO REPETITION */}
        <div className="py-10 border-y border-slate-50">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-200 mb-2">Authenticated By</p>
          <h2 className="text-sm font-black uppercase tracking-tighter italic">ThreadTheory</h2>
        </div>

        {/* ACTION */}
        <div className="pt-4">
          <Link href="/shop">
            <button className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-slate-800 transition-all active:scale-[0.98]">
              Return to Collections
            </button>
          </Link>
          <p className="mt-8 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
            Protocol 001-Success // System Ready
          </p>
        </div>

      </div>
    </main>
  );
}