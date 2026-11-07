import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { useAppSelector } from "@/app/hooks";
import {
  useGetAdminUsersQuery,
  useSetUserBlockedMutation,
  useUpdateUserRoleMutation,
} from "@/features/admin/adminManageApi";
import type { AdminUser, UserRole } from "@/features/admin/types";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";

export default function AdminUsers() {
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const [params, setParams] = useSearchParams();
  const role = (params.get("role") ?? "") as UserRole | "";
  const page = Number(params.get("page") ?? 1);
  const urlSearch = params.get("search") ?? "";

  const [searchText, setSearchText] = useState(urlSearch);
  const debounced = useDebounce(searchText, 400);

  function update(changes: Record<string, string>) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  }

  useEffect(() => {
    if (debounced !== urlSearch) update({ search: debounced, page: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const { data, isLoading, isFetching, isError, refetch } = useGetAdminUsersQuery({
    search: urlSearch || undefined,
    role: role || undefined,
    page,
    limit: 10,
  });
  const [updateRole, { isLoading: isChangingRole }] = useUpdateUserRoleMutation();
  const [setBlocked, { isLoading: isBlocking }] = useSetUserBlockedMutation();

  async function handleRole(user: AdminUser, newRole: UserRole) {
    if (newRole === user.role) return;
    if (!window.confirm(`${user.name} istifadəçisinin rolunu "${newRole}" etmək istəyirsiniz?`)) return;
    try {
      await updateRole({ id: user.id, role: newRole }).unwrap();
      toast.success("Rol dəyişdi");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleBlock(user: AdminUser) {
    const block = !user.isBlocked;
    const text = block
      ? `${user.name} istifadəçisini bloklamaq istəyirsiniz? Daxil ola bilməyəcək.`
      : `${user.name} istifadəçisini blokdan çıxarmaq istəyirsiniz?`;
    if (!window.confirm(text)) return;
    try {
      await setBlocked({ id: user.id, isBlocked: block }).unwrap();
      toast.success(block ? "İstifadəçi bloklandı" : "Blok götürüldü");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">İstifadəçilər</h1>

      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Ad və ya email..."
          className="rounded-md border px-3 py-2 md:w-64"
        />
        <select
          value={role}
          onChange={(e) => update({ role: e.target.value, page: "" })}
          className="rounded-md border px-3 py-2"
        >
          <option value="">Bütün rollar</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {isLoading && <div className="h-60 animate-pulse rounded-xl bg-gray-200" />}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">İstifadəçiləri yükləmək mümkün olmadı.</p>
          <button onClick={() => refetch()} className="mt-2 underline">
            Yenidən cəhd et
          </button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <p className="py-12 text-center text-gray-500">İstifadəçi tapılmadı.</p>
      )}

      {data && data.items.length > 0 && (
        <>
          <div
            className={`overflow-x-auto rounded-xl border bg-white ${isFetching ? "opacity-60" : ""}`}
          >
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Ad</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sifariş</th>
                  <th className="px-4 py-3">Qeydiyyat</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((u) => {
                  const isSelf = u.id === currentUserId;
                  return (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">
                        {u.name}
                        {isSelf && <span className="ml-2 text-xs text-gray-500">(siz)</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={isSelf || isChangingRole}
                          onChange={(e) => handleRole(u, e.target.value as UserRole)}
                          className="rounded-md border px-2 py-1 disabled:opacity-50"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {u.isBlocked ? "Bloklanıb" : "Aktiv"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{u._count.orders}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleBlock(u)}
                          disabled={isSelf || isBlocking}
                          className="text-red-600 underline disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {u.isBlocked ? "Blokdan çıxar" : "Blokla"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => update({ page: String(page - 1) })}
              className="rounded-md border px-3 py-1 disabled:opacity-40"
            >
              Əvvəlki
            </button>
            <span className="text-sm">
              {data.page} / {data.totalPages} ({data.total} istifadəçi)
            </span>
            <button
              disabled={page >= data.totalPages}
              onClick={() => update({ page: String(page + 1) })}
              className="rounded-md border px-3 py-1 disabled:opacity-40"
            >
              Növbəti
            </button>
          </div>
        </>
      )}
    </div>
  );
}