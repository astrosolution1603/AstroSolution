import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 text-center">
      <div className="text-6xl mb-6">🌌</div>
      <h2 className="text-3xl font-bold text-white mb-4">Lost in Space</h2>
      <p className="text-white/60 mb-8 max-w-md text-lg">
        The page you are looking for has drifted into another dimension. Let's get you back on your path.
      </p>
      <Link href="/">
        <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-8 py-6 rounded-full">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
