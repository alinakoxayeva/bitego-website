import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useGetAdminCategoriesQuery } from "@/features/admin/adminApi";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/features/admin/adminManageApi";
import type { AdminCategory } from "@/features/admin/types";
import { getErrorMessage } from "@/lib/errors";

const schema = z.object({
  name: z.string().trim().min(2, "Ad ən azı 2 simvol olmalıdır"),
  imageUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\//.test(v), "Şəkil linki düzgün deyil"),
  isActive: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

interface FormProps {
  category: AdminCategory | null; // null = yeni kateqoriya
  nextSortOrder: number;
  onClose: () => void;
}

function CategoryForm({ category, nextSortOrder, onClose }: FormProps) {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? "",
      imageUrl: category?.imageUrl ?? "",
      isActive: category?.isActive ?? true,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (category) {
        await updateCategory({ id: category.id, body: values }).unwrap();
        toast.success("Kateqoriya yeniləndi");
      } else {
        await createCategory({ ...values, sortOrder: nextSortOrder }).unwrap();
        toast.success("Kateqoriya əlavə olundu");
      }
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const inputClass = "w-full rounded-md border px-3 py-2 outline-none focus:border-orange-500";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-6 space-y-4 rounded-xl border bg-white p-5"
      noValidate
    >
      <h2 className="font-semibold">{category ? "Kateqoriyanı redaktə et" : "Yeni kateqoriya"}</h2>

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Ad
        </label>
        <input id="name" className={inputClass} {...register("name")} />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="imageUrl" className="mb-1 block text-sm font-medium">
          Şəkil linki (ixtiyari)
        </label>
        <input
          id="imageUrl"
          placeholder="https://..."
          className={inputClass}
          {...register("imageUrl")}
        />
        {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-orange-500" {...register("isActive")} />
        Aktivdir (menyuda göstərilir)
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-orange-500 px-5 py-2 font-medium text-white disabled:opacity-50"
        >
          {isSaving ? "Saxlanılır..." : "Saxla"}
        </button>
        <button type="button" onClick={onClose} className="rounded-md border px-5 py-2">
          Ləğv et
        </button>
      </div>
    </form>
  );
}

export default function AdminCategories() {
  // null = form bağlıdır, "new" = yeni kateqoriya, obyekt = redaktə
  const [editing, setEditing] = useState<AdminCategory | "new" | null>(null);

  const { data: categories, isLoading, isError, refetch } = useGetAdminCategoriesQuery();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  async function handleToggle(c: AdminCategory, isActive: boolean) {
    try {
      await updateCategory({ id: c.id, body: { isActive } }).unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete(c: AdminCategory) {
    if (!window.confirm(`"${c.name}" kateqoriyasını silmək istədiyinizə əminsiniz?`)) return;
    try {
      await deleteCategory(c.id).unwrap();
      toast.success("Kateqoriya silindi");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  // Siyahıda yeri dəyişir: bütün siyahıya 0,1,2... sıra nömrəsi verilir
  async function move(index: number, dir: -1 | 1) {
    if (!categories) return;
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;

    const reordered = [...categories];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    try {
      await Promise.all(
        reordered.map((c, i) =>
          c.sortOrder !== i ? updateCategory({ id: c.id, body: { sortOrder: i } }).unwrap() : null,
        ),
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kateqoriyalar</h1>
        {editing === null && (
          <button
            onClick={() => setEditing("new")}
            className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white"
          >
            + Yeni kateqoriya
          </button>
        )}
      </div>

      {editing !== null && (
        <CategoryForm
          key={editing === "new" ? "new" : editing.id}
          category={editing === "new" ? null : editing}
          nextSortOrder={categories?.length ?? 0}
          onClose={() => setEditing(null)}
        />
      )}

      {isLoading && <div className="h-60 animate-pulse rounded-xl bg-gray-200" />}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">Kateqoriyaları yükləmək mümkün olmadı.</p>
          <button onClick={() => refetch()} className="mt-2 underline">
            Yenidən cəhd et
          </button>
        </div>
      )}

      {categories && categories.length === 0 && (
        <p className="py-12 text-center text-gray-500">Hələ kateqoriya yoxdur.</p>
      )}

      {categories && categories.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Sıra</th>
                <th className="px-4 py-3">Ad</th>
                <th className="px-4 py-3">Məhsul sayı</th>
                <th className="px-4 py-3">Aktiv</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="px-1 disabled:opacity-30"
                      aria-label="Yuxarı"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === categories.length - 1}
                      className="px-1 disabled:opacity-30"
                      aria-label="Aşağı"
                    >
                      ↓
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c._count.products}</td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={c.isActive}
                      onChange={(e) => handleToggle(c, e.target.checked)}
                      className="h-4 w-4 accent-orange-500"
                      aria-label="Aktiv"
                    />
                  </td>
                  <td className="space-x-3 px-4 py-3 text-right">
                    <button onClick={() => setEditing(c)} className="text-orange-600 underline">
                      Redaktə
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      disabled={isDeleting || c._count.products > 0}
                      title={
                        c._count.products > 0
                          ? "Məhsulu olan kateqoriya silinə bilməz"
                          : "Kateqoriyanı sil"
                      }
                      className="text-red-600 underline disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}