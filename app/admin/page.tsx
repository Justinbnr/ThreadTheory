"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
 
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("new-drop");
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
      router.push("/admin/login");
      return;
    }
 
    const [prodRes, orderRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
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
    setActiveTab("new-drop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const handleDelete = async (productId: number, imageUrl: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const { error: dbError } = await supabase.from("products").delete().eq("id", productId);
      if (dbError) throw dbError;
      const fileName = imageUrl.split("/").pop();
      if (fileName) {
        await supabase.storage.from("products").remove([`product-images/${fileName}`]);
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error: any) {
      alert("Delete failed: " + error.message);
    }
  };
 
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setStatus("Name & price required");
      return;
    }
    setStatus(editingId ? "Updating..." : "Uploading...");
    try {
      let finalImageUrl = existingImageUrl;
 
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("products").upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }
 
      const productData = { name: name.trim(), price: parseFloat(price), category, image: finalImageUrl };
 
      if (editingId) {
        const { error } = await supabase.from("products").update(productData).eq("id", editingId);
        if (error) throw error;
        setStatus("Updated");
      } else {
        if (!imageFile) throw new Error("Please upload an image for new products.");
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        setStatus("Product added");
      }
 
      setTimeout(async () => {
        await fetchData();
        setEditingId(null);
        setName("");
        setPrice("");
        setImageFile(null);
        setExistingImageUrl("");
        setStatus("");
        setActiveTab("inventory");
      }, 1000);
    } catch (error: any) {
      setStatus("Error");
      alert(error.message || "An unknown error occurred");
    }
  };
 
  // Derived stats
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400 font-medium">Authenticating...</p>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
 
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3.5 sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium tracking-tight">ThreadTheory</span>
          <span className="text-xs text-gray-300 font-normal tracking-wide">Admin console</span>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
          className="text-xs text-gray-400 border border-gray-200 px-3.5 py-1.5 rounded-lg hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
        >
          Sign out
        </button>
      </nav>
 
      <div className="max-w-3xl mx-auto px-6 py-7">
 
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-7">
          {[
            { label: "Products in stock", value: products.length, sub: `${[...new Set(products.map(p => p.category))].length} categories` },
            { label: "Total orders", value: orders.length, sub: "All time" },
            { label: "Revenue", value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: "All time" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-100 rounded-xl px-4 py-4">
              <p className="text-xs text-gray-400 mb-1.5">{s.label}</p>
              <p className="text-2xl font-medium text-gray-900 tracking-tight leading-none">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
 
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
          {[
            { id: "new-drop", label: editingId ? "Edit drop" : "New drop" },
            { id: "inventory", label: `Inventory (${products.length})` },
            { id: "orders", label: `Orders (${orders.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== "new-drop") {
                  setEditingId(null);
                  setName("");
                  setPrice("");
                }
              }}
              className={`flex-1 py-2 text-xs rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
 
        {/* New Drop / Edit Form */}
        {activeTab === "new-drop" && (
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <form onSubmit={handleSaveProduct} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Product name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Oversized hoodie"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
                />
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400">Price ($)</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 transition-colors appearance-none"
                  >
                    <option>Apparel</option>
                    <option>Accessories</option>
                    <option>Footwear</option>
                  </select>
                </div>
              </div>
 
              <div className="h-px bg-gray-100" />
 
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400">Product image</label>
                <div className="relative bg-gray-50 border border-dashed border-gray-200 rounded-lg px-6 py-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-lg text-gray-300 mb-1.5">↑</p>
                  <p className="text-xs text-gray-400">
                    {imageFile ? `✓ ${imageFile.name}` : editingId ? "Keep current or upload new" : "Drag & drop or click to upload"}
                  </p>
                </div>
              </div>
 
              <button
                type="submit"
                disabled={status.endsWith("...")}
                className="w-full py-3 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-300"
              >
                {status || (editingId ? "Save changes" : "Confirm drop")}
              </button>
            </form>
          </div>
        )}
 
        {/* Inventory */}
        {activeTab === "inventory" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">All products</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{products.length} items</span>
            </div>
 
            {products.length === 0 ? (
              <p className="text-center py-16 text-sm text-gray-300">No products yet</p>
            ) : (
              <div className="flex flex-col gap-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-gray-200 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="w-11 h-14 object-cover rounded-lg border border-gray-100 bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-700">${product.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditInit(product)}
                        className="text-xs px-3.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 hover:bg-white hover:text-gray-900 hover:border-gray-300 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.image)}
                        className="text-xs px-3.5 py-1.5 border border-red-100 rounded-lg text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
 
        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Recent orders</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{orders.length} total</span>
            </div>
 
            {orders.length === 0 ? (
              <p className="text-center py-16 text-sm text-gray-300">No orders yet</p>
            ) : (
              <div className="flex flex-col gap-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gray-200 transition-colors"
                  >
                    <div>
                      <p className="text-xs text-gray-300 font-mono mb-1">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer_email || "Guest checkout"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <p className="text-lg font-medium tracking-tight">${parseFloat(order.total).toFixed(2)}</p>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full ${
                          order.status === "fulfilled"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {order.status === "fulfilled" ? "Fulfilled" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}