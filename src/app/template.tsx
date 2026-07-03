"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in zoom-in-[0.98] duration-300 ease-out w-full h-full">
      {children}
    </div>
  );
}
