"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-white text-black font-sans overflow-hidden selection:bg-black selection:text-white">

      {/* NAVBAR */}
      <nav className="px-8 py-6 bg-white border-b border-slate-50 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="text-sm font-black uppercase tracking-tighter italic text-black">ThreadTheory</h1>
        <div className="flex gap-10">

        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[90vh] flex flex-col justify-center px-8 md:px-20 max-w-6xl mx-auto relative">

        {/* Background text watermark */}
        <p
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black uppercase italic text-slate-50 select-none pointer-events-none whitespace-nowrap z-0"
          aria-hidden
        >
          TT
        </p>

        {/* Main content */}
        <div className={`relative z-10 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8">
            SS25 Collection — Now Live
          </p>

          <h2 className="text-[clamp(3rem,10vw,9rem)] font-black uppercase italic tracking-tighter leading-none text-black mb-8">
            Dress<br />
            <span className="text-stroke">The</span><br />
            Theory.
          </h2>

          <p className="text-xs font-medium text-slate-400 max-w-xs leading-relaxed mb-12 uppercase tracking-widest">
            Elevated streetwear for those who move with intention. Limited drops. No restocks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <button className="bg-black text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all active:scale-[0.98]">
                Enter Shop
              </button>
            </Link>
            <Link href="/login">
              <button className="border border-black text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all active:scale-[0.98]">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3">
          <div className="w-8 h-px bg-slate-200" />
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-slate-300">Scroll</p>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="border-y border-slate-100 py-4 overflow-hidden bg-white">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 mx-12">
              ThreadTheory &nbsp;·&nbsp; SS25 &nbsp;·&nbsp; Limited Edition &nbsp;·&nbsp; No Restocks &nbsp;·&nbsp; New Drops Weekly
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-12">Browse By Category</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Apparel", desc: "Hoodies, tees & more" },
            { name: "Accessories", desc: "Caps, bags & details" },
            { name: "Footwear", desc: "Kicks that hit different" },
          ].map((cat) => (
            <Link href="/shop" key={cat.name}>
              <div className="group border border-slate-100 p-10 hover:border-black transition-all duration-300 cursor-pointer bg-white hover:bg-slate-50">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 group-hover:translate-x-1 transition-transform">{cat.name}</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">{cat.desc}</p>
                <div className="mt-8 flex items-center gap-2">
                  <div className="w-4 h-px bg-black group-hover:w-8 transition-all duration-300" />
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Shop Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="border-t border-slate-100 py-24 text-center px-8">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300 mb-6">Members Only</p>
        <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-8">Join The Theory.</h3>
        <Link href="/login">
          <button className="bg-black text-white px-16 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all active:scale-[0.98]">
            Create Account
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-50 px-8 py-8 flex justify-between items-center">
        <p className="text-[9px] font-black uppercase italic tracking-tighter text-slate-200">ThreadTheory</p>
        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-200">© 2025 All Rights Reserved</p>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .text-stroke {
          -webkit-text-stroke: 2px black;
          color: transparent;
        }
      `}</style>
    </main>
  );
}