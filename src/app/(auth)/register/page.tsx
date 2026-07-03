import RegisterForm from "@/components/auth/RegisterForm";
import { Logo } from "@/components/ui/Logo";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-12 md:pt-20 p-4">
      <div className="w-full max-w-md flex flex-col items-center mb-8">
        <Logo />
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-[15px] font-medium text-center">
          Discover your cosmic path
        </p>
      </div>
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
