"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  created_at: string;
  total: number;
  customer_email: string;
  items?: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_email", user.email)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-xs font-bold uppercase tracking-[0.4em] animate-pulse text-black">Loading Orders...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="w-16 h-16 border-2 border-red-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">✕</span>
      </div>
      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Something went wrong</h2>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-black text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

      {/* NAVBAR */}
      <nav className="px-8 py-6 bg-white border-b border-slate-50 sticky top-0 z-40 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-sm font-black uppercase tracking-tighter italic cursor-pointer text-black">ThreadTheory</h1>
        </Link>
        <div className="flex gap-10">
          <Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-black transition-colors">Shop</Link>
          <Link href="/orders" className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Orders</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">

        <div className="mb-12">
          <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-black transition-colors">
            ← Back to Shop
          </Link>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mt-6">Order History</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mt-2">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-slate-100 rounded-2xl">
            <div className="w-16 h-16 border-2 border-slate-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">∅</span>
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter mb-3">No Orders Yet</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-10">
              You haven't placed any orders yet
            </p>
            <Link href="/shop">
              <button className="bg-black text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all active:scale-[0.98]">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          /* ORDERS LIST */
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-slate-100 rounded-2xl p-8 flex justify-between items-center hover:border-black transition-all group">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-tight">{order.customer_email}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black tracking-tighter italic">${Number(order.total).toFixed(2)}</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-300 mt-1">Confirmed</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}