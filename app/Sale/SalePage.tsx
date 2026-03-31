"use client";

import { useState } from "react"; 
interface SaleProducts{
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function SalePage() {
  const [cart, setCart] = useState<SaleProducts[]>([]);
  const saleProducts: SaleProducts[] = [
    {
      id: 1,  
      name: "Hoodie",
      price: 39.99,
      image: "/sale1.jpg"
    },
    {
      id: 2,
      name: "Shirt",
      price: 19.99,
      image: "/sale2.jpg"
    }
  ];


}