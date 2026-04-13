"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("threadtheory_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("last_order_total", total.toFixed(2));
    
    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("threadtheory_cart");
      router.push("/success");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-white text-black flex flex-col lg:flex-row font-sans selection:bg-black selection:text-white">
      
      {/* LEFT SIDE: Shipping Information */}
      <div className="flex-1 px-8 py-12 lg:px-20 border-r border-slate-50">
        <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-black transition-colors">
          ← Back to Shop
        </Link>
        
        <div className="mt-12 max-w-md">
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-black">Shipping Identity</h2>
            <div className="space-y-4">
              <input type="text" placeholder="FULL NAME" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-none outline-none focus:border-black text-[10px] font-bold uppercase" />
              <input type="email" placeholder="EMAIL ADDRESS" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-none outline-none focus:border-black text-[10px] font-bold uppercase" />
              <input type="text" placeholder="SHIPPING ADDRESS" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-none outline-none focus:border-black text-[10px] font-bold uppercase" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="CITY" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-none outline-none focus:border-black text-[10px] font-bold uppercase" />
                <input type="text" placeholder="POSTAL CODE" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-none outline-none focus:border-black text-[10px] font-bold uppercase" />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* RIGHT SIDE: Summary*/}
      <div className="lg:w-[450px] bg-slate-50 p-8 lg:p-12 flex flex-col">
        <div className="flex-grow">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-10 text-black border-b border-black pb-2">Order Summary</h2>
          
          <div className="space-y-6 mb-12 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
            {cart.length === 0 ? (
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Bag Empty</p>
            ) : (
              cart.map((item, i) => (
                <div key={i} className="flex justify-between items-start animate-in fade-in duration-500">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-tight text-black">{item.name}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                  </div>
                  <p className="text-[11px] font-black text-black">${item.price.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Section: Total and Button are now grouped at the top of the summary bottom */}
        <div className="border-t-2 border-black pt-8 space-y-8">
          <div className="flex justify-between items-baseline">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Total Due</span>
              <span className="text-[9px] font-bold text-slate-300 uppercase italic">Taxes Included</span>
            </div>
            <span className="text-4xl font-black tracking-tighter text-black">${total.toFixed(2)}</span>
          </div>

          <button 
  type="submit"
  form="checkout-form"
  disabled={loading}
  style={{ color: 'black', backgroundColor: 'white' }} // Force colors to override global CSS
  className="w-full py-6 rounded-none font-black uppercase tracking-[0.4em] text-[12px] hover:bg-slate-900 transition-all active:scale-[0.98] border border-black"
>
  {loading ? "Processing..." : "Authorize Transaction"}
</button>
          
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest text-center">
            Finalize order to secure inventory
          </p>
        </div>
      </div>
    </main>
  );
}