import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useLoginMutation } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";
import { getErrorMessage } from "@/lib/errors";

const schema = z.object({
  email: z.string().trim().email("Email düzgün deyil"),
  password: z.string().min(1, "Şifrəni yazın"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((s) => s.auth.user);
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  // Qorunan səhifədən gəlibsə, girişdən sonra ora qayıdırıq
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  if (currentUser) return <Navigate to="/" replace />;

  async function onSubmit(values: FormValues) {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Xoş gəldiniz, ${result.user.name}`);
      navigate(result.user.role === "ADMIN" ? "/admin" : (from ?? "/"), { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Daxil ol</h1>
      <p className="mb-6 mt-1 text-sm text-gray-500">BiteGo hesabınıza daxil olun</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ad@nümunə.az"
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Şifrə
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="w-full rounded-md border px-3 py-2 pr-20 outline-none focus:border-orange-500"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
            >
              {showPassword ? "Gizlət" : "Göstər"}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-orange-500 py-2 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {isLoading ? "Gözləyin..." : "Daxil ol"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Hesabınız yoxdur?{" "}
        <Link to="/register" className="font-medium text-orange-600 underline">
          Qeydiyyatdan keçin
        </Link>
      </p>
    </div>
  );
}