import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/shared";
import { RegisterRequestRole } from "@workspace/api-client-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([RegisterRequestRole.STUDENT, RegisterRequestRole.CITIZEN, RegisterRequestRole.ADMIN])
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerUser, isRegistering } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: RegisterRequestRole.CITIZEN }
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      await registerUser({ data });
      setLocation("/"); 
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="mx-auto h-12 w-12 rounded-xl shadow-sm" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-display font-extrabold text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-8">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <label className="cursor-pointer">
                  <input type="radio" value={RegisterRequestRole.CITIZEN} {...register("role")} className="peer sr-only" />
                  <div className="text-center px-4 py-3 border border-gray-200 rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-colors">
                    Citizen
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" value={RegisterRequestRole.STUDENT} {...register("role")} className="peer sr-only" />
                  <div className="text-center px-4 py-3 border border-gray-200 rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-colors">
                    Student
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isRegistering ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
