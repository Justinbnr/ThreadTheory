"use client";

import { useState } from "react";
import Link from "next/link";

interface Products{
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function StorePage() {
  const [cart, setCart] = useState<Products[]>([]);
  
  const products: Products[] = [
    {
      id: 1,
      name: "Product 1",
      price: 19.99,
      image: "/product1.jpg"
    },
    {
      id: 2,
      name: "Product 2",
      price: 29.99,
      image: "/product2.jpg"  
    },
    {
      id: 3,
      name: "Product 3",
      price: 39.99,
      image: "/product3.jpg"
    },
    {
      id: 4,
      name: "Product 4",
      price: 49.99,
      image: "/product4.jpg"
    },
    {
      id: 5,
      name: "Product 5",
      price: 59.99,
      image: "/product5.jpg"
    }
  ];
  
  const addToCart = (product: Products) => {
    setCart([...cart, product]);
    console.log(`Added ${product.name} to cart!`);
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-black tracking-tighter">ThreadTheory</h1>
        <div className="flex space-x-4">
    
          <Link href="/shop" className="text-slate-500 hover:text-slate-900 transition-colors">Shop</Link>
          <Link href="/about" className="text-slate-500 hover:text-slate-900 transition-colors">About</Link>
          <Link href="/contact" className="text-slate-500 hover:text-slate-900 transition-colors">Contact</Link>
          <Link href="/Home" className="text-slate-500 hover:text-slate-900 transition-colors">Sign Out</Link>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
          🛒 Cart ({cart.length})
        </div>
      </nav>

      {/* Hero */}
      <header className="py-16 px-4 text-center">
        <h2 className="text-5xl font-extrabold mb-4 text-black">Hottest Drops</h2>
        <p className="text-slate-500">Quality goods delivered to your door.</p>
      </header>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover bg-slate-200" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-blue-600 font-bold text-lg mb-4">${product.price.toFixed(2)}</p>
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
