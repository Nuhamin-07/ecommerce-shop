"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setTheme } from "@/lib/features/theme/themeSlice";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = (savedTheme as "light" | "dark") || systemTheme;

    dispatch(setTheme(initialTheme));
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, [dispatch]);

  return <>{children}</>;
}
