"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase"; 
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [user, setUser] = useState<any>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("threadtheory_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("threadtheory_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    async function getProducts() {
      try {
        setError(null);
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        setProducts(data || []);
      } catch (err: any) {
        console.error("Error loading products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, products]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    // Show brief "Added" confirmation
    const key = `${product.id}-${product.name}`;
    setAddedId(key);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-xs font-bold uppercase tracking-[0.4em] animate-pulse text-black">Loading Theory...</p>
    </div>
  );

  // ERROR STATE
  if (error) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="w-16 h-16 border-2 border-red-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">✕</span>
      </div>
      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Something went wrong</h2>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">{error}</p>
      <button
        onClick={() => { setLoading(true); setError(null); window.location.reload(); }}
        className="bg-black text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white relative">
      
      {/* --- NAVBAR --- */}
      <nav className="px-8 py-6 bg-white border-b border-slate-50 sticky top-0 z-40 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-sm font-black uppercase tracking-tighter italic cursor-pointer text-black">ThreadTheory</h1>
        </Link>
        <div className="flex gap-10">
          <Link href="/shop" className={`text-[10px] font-bold uppercase tracking-[0.2em] ${pathname === '/shop' ? 'text-black' : 'text-slate-300 hover:text-black'}`}>Shop</Link>
          {user ? (
            <>
              <Link href="/orders" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-black transition-colors">Orders</Link>
              <button onClick={handleSignOut} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 hover:text-red-500 transition-colors">Sign Out</button>
            </>
          ) : (
            <Link href="/login" className={`text-[10px] font-bold uppercase tracking-[0.2em] ${pathname === '/login' ? 'text-black' : 'text-slate-300 hover:text-black'}`}>Sign In</Link>
          )}
        </div>
        
        <Link href="/checkout" className="text-[10px] font-black uppercase tracking-[0.2em] text-black border-b border-black pb-0.5">
          Checkout ({cart.length})
        </Link>
      </nav>

      {/* --- FILTERS & SEARCH --- */}
      <section className="px-8 py-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-6 overflow-x-auto no-scrollbar w-full md:w-auto">
          {["All", "Apparel", "Accessories", "Footwear"].map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all pb-1 whitespace-nowrap ${
                selectedCategory === cat ? 'border-b-2 border-black text-black' : 'text-slate-300 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <input 
          type="text" 
          placeholder="SEARCH"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-50 border border-slate-100 rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-black w-full md:w-48 transition-all"
        />
      </section>

      {/* --- NO RESULTS --- */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-24">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">No products found</p>
          <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="mt-4 text-[10px] font-black uppercase tracking-widest text-black hover:underline">
            Clear Filters
          </button>
        </div>
      )}

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6 pb-32">
        {filteredProducts.map((product) => {
          const key = `product-${product.id}-${product.name}`;
          const justAdded = addedId === key;
          return (
            <div key={key} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full max-h-[400px] bg-slate-50 overflow-hidden mb-3 border border-slate-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                />
                <button 
                  onClick={() => addToCart(product)}
                  className={`absolute bottom-0 left-0 w-full backdrop-blur-sm border-t border-slate-100 py-3 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10 ${
                    justAdded ? "bg-black text-white" : "bg-white/95 text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {justAdded ? "✓ Added" : "Add to Bag"}
                </button>
              </div>
              
              <div className="space-y-0.5 text-black">
                <h3 className="text-[11px] font-bold uppercase tracking-tight leading-tight">{product.name}</h3>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{product.category}</p>
                <p className="text-[11px] font-black pt-1">${product.price.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}