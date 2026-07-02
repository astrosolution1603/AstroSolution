import { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Gem Store - Astro Solution",
  description: "Astrological gemstones for your cosmic needs.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <ShopClient />
    </div>
  );
}
