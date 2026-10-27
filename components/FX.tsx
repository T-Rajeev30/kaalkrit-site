"use client";
import { useEffect, useRef } from "react";

/** Page-wide effects: a scroll progress bar, and a soft spotlight that follows the pointer on any .glow card. */
export default function FX() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const scroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const d = document.documentElement, p = d.scrollTop / Math.max(1, d.scrollHeight - window.innerHeight);
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      });
    };
    const glow = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.(".glow") as HTMLElement | null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`); t.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointermove", glow, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", scroll); window.removeEventListener("pointermove", glow); };
  }, []);
  return <div className="progress" ref={bar} aria-hidden="true" />;
}