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
import AuthPanel from "@/components/common/AuthPanel";

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

    const inputClass =
    "w-full rounded-lg border border-cream bg-paper px-3 py-2.5 text-russet outline-none focus:border-fire";

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
      <AuthPanel
        title="Həmişə sizin üçün bir stul var."
        text="Sevimli yeməkləriniz, kiçik üstünlüklər və təzə yemək bir toxunuş uzaqlıqda."
      />

      <div className="mx-auto w-full max-w-md">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-fire">
          Sevimliləriniz sizi gözləyir
        </p>
        <h1 className="font-display text-4xl text-russet md:text-5xl">Xoş gəldiniz.</h1>
        <p className="mb-8 mt-3 text-sm text-russet/80">Savor hesabınıza daxil olun</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-bold text-russet">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ad@nümunə.az"
              className={inputClass}
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-sm text-fire">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-bold text-russet">
              Şifrə
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`${inputClass} pr-20`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-russet/70"
              >
                {showPassword ? "Gizlət" : "Göstər"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-fire">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-fire py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Gözləyin..." : "Daxil ol →"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-russet">
          Yenisiniz?{" "}
          <Link to="/register" className="font-bold text-fire underline">
            Hesab yaradın
          </Link>
        </p>
      </div>
    </section>
  );
}