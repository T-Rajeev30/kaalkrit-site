"use client";
import { useEffect, useRef } from "react";
import { PROCESS } from "@/data/site";

/** Four build stages on a track that fills as you scroll through it; each stage lights when the fill reaches it. */
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!, steps = [...el.querySelectorAll<HTMLElement>(".pstep")];
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect(), vh = window.innerHeight;
        const p = Math.max(0, Math.min(1, (vh * 0.8 - r.top) / (r.height + vh * 0.25)));
        el.style.setProperty("--p", p.toFixed(3));
        steps.forEach((s, i) => s.classList.toggle("lit", p >= (i / (steps.length - 1)) * 0.92 + 0.02));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return (
    <div className="process" ref={ref}>
      <div className="ptrack" aria-hidden="true"><i /></div>
      <ol>
        {PROCESS.map((s) => (
          <li className="pstep" key={s.k}>
            <span className="pdot">{s.k}</span>
            <h3>{s.name}</h3>
            <p>{s.line}</p>
            <span className="label">{s.tags.join(" · ")}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}