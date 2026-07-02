"use client";

import { useState } from "react";
import Image from "next/image";
import { gemstones, GemCategory } from "@/lib/gemstones";
import { cn } from "@/lib/utils";
import { ShoppingBag, Star, Sparkles, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ShopClient() {
  const [activeCategory, setActiveCategory] = useState<GemCategory | "All">("All");
  const { addToCart, cart, setIsCartOpen } = useCart();

  const filteredGems = activeCategory === "All" 
    ? gemstones 
    : gemstones.filter(g => g.category === activeCategory);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/stars-bg.png')] opacity-30 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" /> Cosmic Treasures
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Discover Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Gemstone</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl">
            Ethically sourced, astrologically potent gemstones. Align your energy, unlock your destiny, and invite prosperity.
          </p>
        </div>
        <div className="relative z-10 hidden md:block w-48 h-48 rounded-full shadow-[0_0_60px_rgba(245,158,11,0.3)] border-4 border-amber-500/20 overflow-hidden bg-black/50 backdrop-blur-sm">
          <Image src="/images/gemstones/ruby.png" alt="Ruby" fill className="object-cover hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Filter Tabs and Cart Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-20 bg-background/80 backdrop-blur-md p-4 rounded-3xl border shadow-sm">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShoppingBag className="text-primary w-6 h-6" /> Collection
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2 flex-1 md:justify-center">
          {(["All", "Navaratna"] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {cat === "Navaratna" ? "Gems" : cat}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-background">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGems.map(gem => (
          <div key={gem.id} className="group flex flex-col bg-card border rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300">
            <div className="relative h-56 bg-muted/30 flex items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
              {gem.image.startsWith("/") ? (
                <Image 
                  src={gem.image} 
                  alt={gem.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover z-0 group-hover:scale-110 transition-transform duration-700" 
                />
              ) : gem.image.startsWith("http") ? (
                <img
                  src={gem.image}
                  alt={gem.name}
                  className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/40 via-card to-background flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <span className="text-6xl filter drop-shadow-xl mb-2">{gem.image}</span>
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-50"></div>
                </div>
              )}
              <div className="absolute top-3 left-3 z-20">
                <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  {gem.category}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{gem.name}</h3>
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold ml-1">5.0</span>
                </div>
              </div>
              
              <div className="text-xs font-semibold text-primary/80 mb-3 bg-primary/10 inline-block px-2 py-1 rounded-md w-max">
                {gem.planetOrSign}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                {gem.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Price</span>
                  <span className="text-xl font-extrabold text-foreground">₹{gem.price.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => addToCart(gem)}
                  className="px-5 py-2.5 bg-foreground text-background font-bold rounded-xl hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
