import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Lock, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { useResetPasswordMutation } from "../../store/authApi";

interface ErrorResponse {
  data?: { message?: string };
  error?: string;
}

export default function ResetPasswordPage() {
  const { token } = useParams({ from: "/auth/password/reset/$token" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // The server signs the user in after a successful reset
      await resetPassword({ token, ...formData }).unwrap();
      const meResponse = await fetch("/api/v1/me", { credentials: "include" });
      const profileData = await meResponse.json();
      if (profileData?.user) {
        dispatch(setUser(profileData.user));
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error?.data?.message || error?.error || "Could not reset your password");
    }
  };

  const isExpired = error?.toLowerCase().includes("invalid or has been expired");

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Set a new password
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Choose a password with at least 6 characters.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                <div className="text-sm text-red-700">
                  <p>{error}</p>
                  {isExpired && (
                    <Link to="/password/forgot" className="mt-1 inline-block font-semibold underline">
                      Request a new link
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {(["password", "confirmPassword"] as const).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-slate-700">
                {field === "password" ? "New password" : "Confirm new password"}
              </label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name={field}
                  id={field}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={formData[field]}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Reset password"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
