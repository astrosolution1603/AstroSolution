import LoginForm from "@/components/auth/LoginForm";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-12 md:pt-20 p-4">
      <div className="w-full max-w-md flex flex-col items-center mb-8">
        <Logo />
        <p className="text-slate-500 mt-4 text-[15px] font-medium text-center">
          Welcome back to your cosmic<br />journey
        </p>
      </div>
      <div className="w-full max-w-md">
        <LoginForm expectedRole="USER" />
      </div>
    </div>
  );
}
