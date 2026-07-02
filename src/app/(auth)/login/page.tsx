import LoginForm from "@/components/auth/LoginForm";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <p className="text-muted-foreground">Welcome back to your cosmic journey</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
