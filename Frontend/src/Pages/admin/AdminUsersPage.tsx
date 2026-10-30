import { useState } from "react";
import { useSelector } from "react-redux";
import { Search, Trash2 } from "lucide-react";
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserMutation } from "../../store/adminApi";
import type { RootState } from "../../store";

export default function AdminUsersPage() {
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const users = data?.users ?? [];
  const term = search.trim().toLowerCase();
  const visible = term
    ? users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
    : users;

  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setError("");
    try {
      await action();
    } catch (err) {
      setError((err as { data?: { message?: string } })?.data?.message || "Something went wrong.");
    } finally {
      setBusyId("");
    }
  };

  const handleRole = (id: string, name: string, role: string) => {
    if (!window.confirm(`Change ${name}'s role to ${role}?`)) return;
    run(id, () => updateUser({ id, body: { role } }).unwrap());
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}'s account? This can't be undone.`)) return;
    run(id, () => deleteUser(id).unwrap());
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Users</h1>
      <p className="mt-1 text-slate-500">{users.length} registered users</p>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading users...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-red-600">Could not load users.</td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No users found.</td>
              </tr>
            ) : (
              visible.map((u) => {
                const isSelf = u._id === currentUserId;
                const busy = busyId === u._id;
                return (
                  <tr key={u._id} className={busy ? "opacity-50" : ""}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">
                        {u.name} {isSelf && <span className="text-xs font-normal text-slate-400">(you)</span>}
                      </p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={isSelf || busy}
                        title={isSelf ? "You can't change your own role" : undefined}
                        onChange={(e) => handleRole(u._id, u.name, e.target.value)}
                        aria-label={`Role for ${u.name}`}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={isSelf || busy}
                        onClick={() => handleDelete(u._id, u.name)}
                        aria-label={`Delete ${u.name}`}
                        title={isSelf ? "You can't delete your own account" : undefined}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
