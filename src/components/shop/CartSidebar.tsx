"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { CheckoutModal } from "./CheckoutModal";

export const CartSidebar = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
      
      <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-background/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col transition-transform transform translate-x-0">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Your Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
              <ShoppingBag className="w-20 h-20 mb-4" />
              <p className="text-xl">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/50">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                    <p className="text-sm text-primary">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/40">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-auto text-xs text-red-400 hover:text-red-300 underline">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/20">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-muted-foreground">Subtotal</span>
              <span className="text-2xl font-bold">₹{cartTotal.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold text-lg shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all hover:scale-[1.02]"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>

      {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />}
    </>
  );
};
