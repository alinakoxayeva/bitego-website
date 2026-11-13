import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useRegisterMutation } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";
import { getErrorMessage } from "@/lib/errors";
import AuthPanel from "@/components/common/AuthPanel";

const schema = z
  .object({
    name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
    email: z.string().trim().email("Email düzgün deyil"),
    phone: z.string().trim().optional(),
    password: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
    confirmPassword: z.string().min(1, "Şifrəni təkrar yazın"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifrələr eyni deyil",
  });
type FormValues = z.infer<typeof schema>;

const fields = [
  { name: "name", label: "Ad", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Telefon (ixtiyari)", type: "tel", autoComplete: "tel" },
] as const;

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.user);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  if (currentUser) return <Navigate to="/" replace />;

  async function onSubmit(values: FormValues) {
    try {
      // confirmPassword serverə göndərilmir
      const result = await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      }).unwrap();

      dispatch(setCredentials(result));
      toast.success(`Qeydiyyat uğurludur, ${result.user.name}`);
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

    const inputClass =
    "w-full rounded-lg border border-cream bg-paper px-3 py-2.5 text-russet outline-none focus:border-fire";

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
      <AuthPanel
        title="Gəlin, bir yerdə yeyək."
        text="Hesab yaradın, sifarişlərinizi izləyin və sevimli yeməklərinizi tez tapın."
      />

      <div className="mx-auto w-full max-w-md">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-fire">
          Savor ailəsinə qoşulun
        </p>
        <h1 className="font-display text-4xl text-russet md:text-5xl">Hesab yarat.</h1>
        <p className="mb-8 mt-3 text-sm text-russet/80">Savor-da hesab yaradın</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {fields.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="mb-1 block text-sm font-bold text-russet">
                {f.label}
              </label>
              <input
                id={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                className={inputClass}
                {...register(f.name)}
              />
              {errors[f.name] && (
                <p className="mt-1 text-sm text-fire">{errors[f.name]?.message}</p>
              )}
            </div>
          ))}

          {(["password", "confirmPassword"] as const).map((name) => (
            <div key={name}>
              <label htmlFor={name} className="mb-1 block text-sm font-bold text-russet">
                {name === "password" ? "Şifrə" : "Şifrə təkrarı"}
              </label>
              <div className="relative">
                <input
                  id={name}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`${inputClass} pr-20`}
                  {...register(name)}
                />
                {name === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-russet/70"
                  >
                    {showPassword ? "Gizlət" : "Göstər"}
                  </button>
                )}
              </div>
              {errors[name] && (
                <p className="mt-1 text-sm text-fire">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-fire py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Gözləyin..." : "Qeydiyyatdan keç →"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-russet">
          Artıq hesabınız var?{" "}
          <Link to="/login" className="font-bold text-fire underline">
            Daxil olun
          </Link>
        </p>
      </div>
    </section>
  );
}