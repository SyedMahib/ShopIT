import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";

/**
 * Checks if the user is currently authenticated by calling the /me endpoint.
 * If a valid user is returned, updates Redux state and redirects to home.
 * This component renders nothing — it's used as a route wrapper.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/api/v1/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        if (data?.user) {
          dispatch(setUser(data.user));
        }
      })
      .catch(() => {
        // Not authenticated — guard will rely on router navigation elsewhere
      });
  }, [dispatch]);

  return <>{children}</>;
}
