"use client";
import { useEffect, useState } from "react";

/** Follows the visitor's system setting until they choose; the choice is remembered on this device. */
export default function ThemeSwitch() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const set = document.documentElement.dataset.theme as "dark" | "light" | undefined;
    setTheme(set || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  }, []);
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("kk-theme", next); } catch {}
    window.dispatchEvent(new Event("kk-theme"));
    setTheme(next);
  };
  return (
    <button type="button" className="tswitch" onClick={flip} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      <span className="sw" aria-hidden="true"><i /></span>{theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
