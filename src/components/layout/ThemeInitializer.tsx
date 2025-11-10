"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setTheme } from "@/lib/features/theme/themeSlice";

export default function ThemeInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const theme = savedTheme || systemTheme;

    dispatch(setTheme(theme));
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [dispatch]);

  return null;
}
