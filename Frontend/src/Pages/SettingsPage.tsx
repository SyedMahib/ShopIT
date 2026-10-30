import { useState } from "react";
import { useUpdatePasswordMutation } from "../store/authApi";

export default function SettingsPage() {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Keep a reference: React clears e.currentTarget once we await
    const form = e.currentTarget;
    const formData = new FormData(form);
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", text: "New passwords do not match." });
      return;
    }

    setStatus(null);
    try {
      await updatePassword({ oldPassword, newPassword }).unwrap();
      form.reset();
      setStatus({ type: "success", text: "Password updated successfully." });
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setStatus({ type: "error", text: message || "Failed to update password. Please try again." });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mt-1 text-slate-500">Change your password and preferences</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Current Password</label>
          <input
            type="password"
            name="oldPassword"
            required
            minLength={6}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">New Password</label>
          <input
            type="password"
            name="newPassword"
            required
            minLength={6}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Confirm new password"
          />
        </div>

        {status && (
          <div
            className={`rounded-lg p-4 text-sm ${
              status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}
          >
            {status.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
