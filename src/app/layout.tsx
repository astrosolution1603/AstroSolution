import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Astro Solution — AI Vedic Astrologer",
  description: "Personalized AI Vedic Astrology. Ask anything about your destiny.",
};

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const getGlobalSettings = unstable_cache(
  async () => {
    return prisma.platformSettings.findUnique({
      where: { id: "global" }
    });
  },
  ['global-theme-settings'],
  { revalidate: 60, tags: ['theme'] }
);

import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/shop/CartSidebar";
import { CapacitorAppListener } from "@/components/CapacitorAppListener";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let themeName = "cosmic";
  try {
    const settings = await getGlobalSettings();
    if (settings) {
      themeName = settings.themeName;
    }
  } catch (e) {
    console.error("Failed to fetch global theme settings:", e);
  }

  // Force pure dark/light mode for specific themes
  const forceTheme = themeName === "midnight" ? "dark" : themeName === "snowfall" ? "light" : undefined;

  return (
    <html lang="en" suppressHydrationWarning data-theme={themeName}>
      <body className={`${inter.className} min-h-screen antialiased bg-background text-foreground overflow-x-hidden`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem 
          forcedTheme={forceTheme}
        >
          <SessionProvider>
            <CartProvider>
              <CapacitorAppListener />
              {/* Dynamic Theme Background */}
              <div className={`fixed inset-0 z-[-1] theme-bg-${themeName}`}></div>
              
              <div className="relative z-0">
                {children}
              </div>
              <CartSidebar />
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
