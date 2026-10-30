import { useSelector } from "react-redux";
import { useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useGetMeQuery, useUpdateProfileMutation } from "../store/authApi";
import defaultAvatar from "../assets/default_avatar.jpg";
import type { RootState } from "../store";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isError } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  if (isError) {
    navigate({ to: "/login" });
    return null;
  }

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
  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      const result = await updateProfile({ name }).unwrap();
      dispatch(setUser(result));
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      <p className="mt-1 text-slate-500">Edit your personal information</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <input
            type="text"
            name="name"
            defaultValue={user.name}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email Address</label>
          <input
            type="email"
            name="email"
            defaultValue={user.email}
            disabled
            className="mt-2 w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          {user.avatar?.url ? (
            <img
              src={`/api/avatar/${user._id}`}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200"
            />
          ) : (
            <img
              src={defaultAvatar}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200"
              onError={(e: any) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=random&size=64`;
              }}
            />
          )}
          <div>
            <p className="text-sm font-medium text-slate-700">Avatar</p>
            <p className="text-xs text-slate-500">Upload a new photo to update your avatar</p>
          </div>
        </div>

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
