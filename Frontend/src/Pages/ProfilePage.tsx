import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { setUser } from "../store/authSlice";
import {
  useGetMeQuery,
  useRemoveAvatarMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "../store/authApi";
import defaultAvatar from "../assets/default_avatar.jpg";
import { avatarSrc } from "../utils/avatar";

const MAX_AVATAR_MB = 2;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function errorMessage(err: unknown, fallback: string) {
  return (err as { data?: { message?: string } })?.data?.message || fallback;
}

type Status = { type: "success" | "error"; text: string } | null;

function StatusMessage({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p className={`text-sm ${status.type === "success" ? "text-emerald-700" : "text-red-600"}`}>{status.text}</p>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  // Rendered inside AuthGuard, so the user is logged in
  const { data, isLoading, isError, refetch } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [removeAvatar, { isLoading: isRemoving }] = useRemoveAvatarMutation();
  const [profileStatus, setProfileStatus] = useState<Status>(null);
  const [avatarStatus, setAvatarStatus] = useState<Status>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  const user = data?.user;
  if (isError || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-slate-600">We couldn&apos;t load your profile.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Try again
        </button>
      </div>
    );
  }

  const handleAvatarFile = async (file: File | undefined) => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setAvatarStatus({ type: "error", text: "Please choose a JPG, PNG, WebP or GIF image." });
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setAvatarStatus({ type: "error", text: `The image must be ${MAX_AVATAR_MB}MB or smaller.` });
      return;
    }

    setAvatarStatus(null);
    try {
      const result = await uploadAvatar(file).unwrap();
      dispatch(setUser(result.user));
      setAvatarStatus({ type: "success", text: "Profile picture updated." });
    } catch (err) {
      setAvatarStatus({ type: "error", text: errorMessage(err, "Could not upload the picture.") });
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm("Remove your profile picture?")) return;
    setAvatarStatus(null);
    try {
      const result = await removeAvatar().unwrap();
      dispatch(setUser(result.user));
      setAvatarStatus({ type: "success", text: "Profile picture removed." });
    } catch (err) {
      setAvatarStatus({ type: "error", text: errorMessage(err, "Could not remove the picture.") });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();

    setProfileStatus(null);
    try {
      const result = await updateProfile({ name }).unwrap();
      dispatch(setUser(result.user));
      setProfileStatus({ type: "success", text: "Profile updated." });
    } catch (err) {
      setProfileStatus({ type: "error", text: errorMessage(err, "Failed to update profile. Please try again.") });
    }
  };

  const avatarBusy = isUploading || isRemoving;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      <p className="mt-1 text-slate-500">Edit your personal information</p>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-medium text-slate-700">Profile picture</h2>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <div className="relative">
            <img
              src={avatarSrc(user)}
              alt={user.name}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-slate-200"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultAvatar;
              }}
            />
            {avatarBusy && (
              <div className="absolute inset-0 grid place-items-center rounded-full bg-white/70">
                <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={avatarBusy}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                {isUploading ? "Uploading..." : user.avatar?.url ? "Change photo" : "Upload photo"}
              </button>
              {user.avatar?.url && (
                <button
                  type="button"
                  disabled={avatarBusy}
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">JPG, PNG, WebP or GIF, up to {MAX_AVATAR_MB}MB.</p>
            <StatusMessage status={avatarStatus} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            hidden
            onChange={(e) => handleAvatarFile(e.target.files?.[0])}
          />
        </div>
      </section>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
          <input
            id="name"
            type="text"
            name="name"
            required
            defaultValue={user.name}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={user.email}
            disabled
            className="mt-2 w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
        </div>

        <StatusMessage status={profileStatus} />

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
