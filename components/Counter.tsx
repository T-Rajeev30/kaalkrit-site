"use client";
import { useEffect, useRef } from "react";
import anime from "animejs";

/** A number that counts up to its value when it first scrolls into view; the final value is in the HTML. */
export default function Counter({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) => prefix + v.toFixed(decimals) + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const o = { v: 0 };
      anime({ targets: o, v: to, duration: 1600, easing: "easeOutExpo", update: () => { el.textContent = fmt(o.v); } });
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <span ref={ref}>{fmt(to)}</span>;
}
