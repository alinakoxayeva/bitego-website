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

  return (
    <div className="mx-auto mt-10 w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Qeydiyyat</h1>
      <p className="mb-6 mt-1 text-sm text-gray-500">BiteGo-da hesab yaradın</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block text-sm font-medium">
              {f.label}
            </label>
            <input
              id={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              className="w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500"
              {...register(f.name)}
            />
            {errors[f.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[f.name]?.message}</p>
            )}
          </div>
        ))}

        {(["password", "confirmPassword"] as const).map((name) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-sm font-medium">
              {name === "password" ? "Şifrə" : "Şifrə təkrarı"}
            </label>
            <div className="relative">
              <input
                id={name}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-md border px-3 py-2 pr-20 outline-none focus:border-orange-500"
                {...register(name)}
              />
              {name === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                >
                  {showPassword ? "Gizlət" : "Göstər"}
                </button>
              )}
            </div>
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]?.message}</p>}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-orange-500 py-2 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          {isLoading ? "Gözləyin..." : "Qeydiyyatdan keç"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        Artıq hesabınız var?{" "}
        <Link to="/login" className="font-medium text-orange-600 underline">
          Daxil olun
        </Link>
      </p>
    </div>
  );
}