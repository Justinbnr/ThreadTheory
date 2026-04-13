"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("add-product");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Form States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const router = useRouter();

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "admin@threadtheory.com") {
      router.push("/login");
      return;
    }

    const [prodRes, orderRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false })
    ]);

    setProducts(prodRes.data || []);
    setOrders(orderRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleEditInit = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setExistingImageUrl(product.image);
    setActiveTab("add-product");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId: number, imageUrl: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    
    try {
      const { error: dbError } = await supabase.from('products').delete().eq('id', productId);
      if (dbError) throw dbError;

      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('products').remove([`product-images/${fileName}`]);
      }

      setProducts(prev => prev.filter(p => p.id !== productId));
      alert("Product deleted.");
    } catch (error: any) {
      alert("Delete failed: " + error.message);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) { 
      setStatus("Error: Name & Price Required"); 
      return; 
    }
    
    setStatus(editingId ? "Updating Database..." : "Uploading Asset...");
    
    try {
      let finalImageUrl = existingImageUrl;

      // Handle Image Upload if a new file is present
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`; // Use Date.now for better collision avoidance
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('products').upload(filePath, imageFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }

      const productData = {
        name: name.trim(),
        price: parseFloat(price),
        category,
        image: finalImageUrl
      };

      if (editingId) {
        // UPDATE LOGIC
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
        
        if (updateError) throw updateError;
        setStatus("Update Successful");
      } else {
        // INSERT LOGIC
        if (!imageFile) throw new Error("Please upload an image for new products.");
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);
        
        if (insertError) throw insertError;
        setStatus("Product Added");
      }

      // Refresh and Reset
      setTimeout(async () => {
        await fetchData(); // Refresh local list
        setEditingId(null);
        setName("");
        setPrice("");
        setImageFile(null);
        setExistingImageUrl("");
        setStatus("");
        setActiveTab("inventory");
      }, 1000);

    } catch (error: any) {
      console.error("Supabase Error:", error);
      setStatus("Error: See Console");
      alert(error.message || "An unknown error occurred");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-black bg-white">AUTHENTICATING ADMIN...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <nav className="bg-white border-b p-4 sticky top-0 z-20 flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter text-black uppercase italic">ThreadTheory <span className="text-[10px] font-bold text-slate-300 not-italic tracking-[0.3em] ml-4">Admin Console</span></h1>
        <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))} className="text-xs font-bold uppercase hover:text-red-500 transition-colors">Sign Out</button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* TAB NAVIGATION */}
        <div className="flex gap-8 mb-12 border-b border-slate-100">
          <button onClick={() => { setActiveTab("add-product"); setEditingId(null); setName(""); setPrice(""); }} className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "add-product" ? "border-b-2 border-black text-black" : "text-slate-300 hover:text-black"}`}>
            {editingId ? "Edit Drop" : "New Drop"}
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "inventory" ? "border-b-2 border-black text-black" : "text-slate-300 hover:text-black"}`}>Stock ({products.length})</button>
          <button onClick={() => setActiveTab("orders")} className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "orders" ? "border-b-2 border-black text-black" : "text-slate-300 hover:text-black"}`}>Orders ({orders.length})</button>
        </div>

        {/* ADD / EDIT FORM */}
        {activeTab === "add-product" && (
          <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-10">{editingId ? "Edit Existing Asset" : "Push New Asset"}</h2>
            <form onSubmit={handleSaveProduct} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Product Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-black uppercase font-bold text-sm" placeholder="e.g. OVERSIZED HOODIE" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Price ($)</label>
                  <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-black font-bold text-sm" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-black font-bold text-sm appearance-none">
                    <option>Apparel</option>
                    <option>Accessories</option>
                    <option>Footwear</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Product Image</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center relative bg-slate-50 hover:border-black transition-colors">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  <p className="text-xs font-bold uppercase tracking-tight">
                    {imageFile ? `✓ ${imageFile.name}` : editingId ? "Keep current or Upload New" : "Select Image Asset"}
                  </p>
                </div>
              </div>
              <button type="submit" disabled={status.includes("ing")} className="w-full bg-black text-white p-5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all disabled:bg-slate-300">
                {status || (editingId ? "Save Changes" : "Confirm Drop")}
              </button>
            </form>
          </div>
        )}

        {/* INVENTORY LIST */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            {products.length === 0 ? <p className="text-center py-20 text-slate-300 font-bold uppercase text-xs">Stock is empty</p> : 
              products.map(product => (
                <div key={product.id} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 group hover:border-black transition-all">
                  <div className="flex items-center gap-4">
                    <img src={product.image} className="w-16 h-20 object-cover rounded-lg border bg-white shadow-sm" alt="" />
                    <div>
                      <h4 className="font-bold uppercase text-xs tracking-tight">{product.name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">${product.price} <span className="mx-2">|</span> {product.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditInit(product)} className="px-5 py-2 text-[10px] font-bold uppercase border border-slate-200 rounded-lg bg-white hover:bg-black hover:text-white transition-all">Edit</button>
                    <button onClick={() => handleDelete(product.id, product.image)} className="px-5 py-2 text-[10px] font-bold uppercase border border-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">Delete</button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ORDERS LIST */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? <p className="text-center py-20 text-slate-300 font-bold uppercase text-xs">No pending orders</p> : 
              orders.map(order => (
                <div key={order.id} className="bg-white border border-slate-100 p-8 rounded-2xl flex justify-between items-center group hover:border-black transition-all">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 mb-2 uppercase tracking-widest">Order ID: {order.id.slice(0,8)}</p>
                    <p className="text-xs font-bold uppercase tracking-tighter">{order.customer_email || "Guest Checkout"}</p>
                  </div>
                  <p className="text-2xl font-black tracking-tighter italic">${order.total}</p>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}