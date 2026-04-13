"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [orderTotal, setOrderTotal] = useState<string>("0.00");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const savedTotal = localStorage.getItem("last_order_total");
    if (savedTotal) setOrderTotal(savedTotal);
    localStorage.removeItem("threadtheory_cart");
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center font-sans selection:bg-black selection:text-white">
      <div className={`max-w-md w-full px-8 text-center space-y-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>

        {/* SUCCESS ICON */}
        <div className="flex justify-center">
          <div className="w-16 h-16 border-2 border-black flex items-center justify-center rounded-full">
            <span className="text-2xl font-black">✓</span>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Order Confirmed</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
            Your transaction has been processed. <br />
            An electronic receipt is being sent to your identity.
          </p>
        </div>

        {/* ORDER TOTAL */}
        {orderTotal !== "0.00" && (
          <div className="border border-slate-100 rounded-2xl py-6 px-8 flex justify-between items-baseline">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Total Paid</span>
            <span className="text-3xl font-black tracking-tighter">${orderTotal}</span>
          </div>
        )}

        {/* LOGO */}
        <div className="py-8 border-y border-slate-50">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-200 mb-2">Authenticated By</p>
          <h2 className="text-sm font-black uppercase tracking-tighter italic">ThreadTheory</h2>
        </div>

        {/* ACTIONS */}
        <div className="space-y-4">
          <Link href="/shop">
            <button className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-slate-800 transition-all active:scale-[0.98]">
              Return to Collections
            </button>
          </Link>
          <Link href="/">
            <button className="w-full border border-slate-100 text-slate-400 py-4 font-black uppercase tracking-[0.4em] text-[10px] hover:border-black hover:text-black transition-all active:scale-[0.98]">
              Back to Home
            </button>
          </Link>
        </div>

        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
          Protocol 001-Success // System Ready
        </p>

      </div>
    </main>
  );
}