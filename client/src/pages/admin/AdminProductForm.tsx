import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  useCreateProductMutation,
  useGetAdminCategoriesQuery,
  useGetAdminProductByIdQuery,
  useUpdateProductMutation,
} from "@/features/admin/adminApi";
import { getErrorMessage } from "@/lib/errors";

const schema = z.object({
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  description: z.string().trim().min(5, "Təsvir ən azı 5 simvol olmalıdır"),
  price: z
    .string()
    .trim()
    .min(1, "Qiyməti yazın")
    .refine((v) => Number(v) > 0, "Qiymət 0-dan böyük olmalıdır"),
  imageUrl: z.string().trim().url("Şəkil linki düzgün deyil"),
  categoryId: z.string().min(1, "Kateqoriya seçin"),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  isAvailable: true,
  isFeatured: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: categories } = useGetAdminCategoriesQuery();
  const {
    data: product,
    isLoading: isLoadingProduct,
    isError,
  } = useGetAdminProductByIdQuery(id ?? "", { skip: !id });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues });

  // Redaktə rejimində məhsul gələndə formu doldur
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: Number(product.price).toFixed(2),
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        isAvailable: product.isAvailable,
        isFeatured: product.isFeatured,
      });
    }
  }, [product, reset]);

  async function onSubmit(values: FormValues) {
    const body = { ...values, price: Number(values.price) };
    try {
      if (id) {
        await updateProduct({ id, body }).unwrap();
        toast.success("Məhsul yeniləndi");
      } else {
        await createProduct(body).unwrap();
        toast.success("Məhsul əlavə olundu");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const imageUrl = watch("imageUrl");

  if (isEdit && isLoadingProduct) {
    return <div className="h-80 animate-pulse rounded-xl bg-gray-200" />;
  }
  if (isEdit && (isError || !product)) {
    return (
      <div className="py-12 text-center">
        <p>Məhsul tapılmadı.</p>
        <Link to="/admin/products" className="underline">
          Məhsullara qayıt
        </Link>
      </div>
    );
  }

  const inputClass = "w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500";

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/admin/products" className="text-sm text-gray-500 underline">
        ← Məhsullar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">
        {isEdit ? "Məhsulu redaktə et" : "Yeni məhsul"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-xl border bg-white p-5"
        noValidate
      >
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Ad
          </label>
          <input id="name" className={inputClass} {...register("name")} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Təsvir
          </label>
          <textarea
            id="description"
            rows={3}
            className={inputClass}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Qiymət (₼)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              {...register("price")}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
              Kateqoriya
            </label>
            <select id="categoryId" className={inputClass} {...register("categoryId")}>
              <option value="">Seçin...</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium">
            Şəkil linki
          </label>
          <input
            id="imageUrl"
            placeholder="https://..."
            className={inputClass}
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
          {imageUrl && !errors.imageUrl && (
            <img
              src={imageUrl}
              alt="Önbaxış"
              className="mt-2 h-32 w-44 rounded-md border object-cover"
            />
          )}
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-orange-500"
              {...register("isAvailable")}
            />
            Mövcuddur
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-orange-500"
              {...register("isFeatured")}
            />
            Ana səhifədə göstər
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-orange-500 px-5 py-2 font-medium text-white disabled:opacity-50"
          >
            {isSaving ? "Saxlanılır..." : "Saxla"}
          </button>
          <Link to="/admin/products" className="rounded-md border px-5 py-2">
            Ləğv et
          </Link>
        </div>
      </form>
    </div>
  );
}