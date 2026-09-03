import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function RootLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("/api/v1/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data?.user) dispatch(setUser(data.user));
      })
      .catch(() => {});
  }, [dispatch]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default RootLayout;
