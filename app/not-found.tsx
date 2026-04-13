import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center font-sans selection:bg-black selection:text-white overflow-hidden">
      
      {/* Background watermark */}
      <p className="fixed text-[30vw] font-black uppercase italic text-slate-50 select-none pointer-events-none z-0 leading-none">
        404
      </p>

      <div className="relative z-10 max-w-md w-full px-8 text-center space-y-10">

        {/* top label */}
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
          Error 404
        </p>

        {/* Heading */}
        <div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
            Lost<br />The<br />Thread.
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
            This page doesn't exist or has been moved.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 justify-center">
          <div className="w-12 h-px bg-slate-100" />
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-200">ThreadTheory</p>
          <div className="w-12 h-px bg-slate-100" />
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link href="/">
            <button className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-slate-800 transition-all active:scale-[0.98]">
              Back to Home
            </button>
          </Link>
          <Link href="/shop">
            <button className="w-full border border-black text-black py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-black hover:text-white transition-all active:scale-[0.98]">
              Browse Collection
            </button>
          </Link>
        </div>

        <p className="text-[8px] font-bold text-slate-200 uppercase tracking-widest">
          Protocol 404 // Page Not Found
        </p>

      </div>
    </main>
  );
}