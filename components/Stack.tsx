"use client";
import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { STACK } from "@/data/site";

const CATS = ["All", ...Array.from(new Set(STACK.map((s) => s.cat)))];

/** The hardware and software we fly with, filterable by category; cards shuffle in on each filter. */
export default function Stack() {
  const [cat, setCat] = useState("All");
  const grid = useRef<HTMLDivElement>(null), first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    anime({ targets: grid.current!.querySelectorAll(".chip"), translateY: [14, 0], scale: [0.94, 1], opacity: [0, 1], delay: anime.stagger(40), duration: 650, easing: "easeOutExpo" });
  }, [cat]);
  const list = cat === "All" ? STACK : STACK.filter((s) => s.cat === cat);
  return (
    <>
      <div className="tabs" role="group" aria-label="Filter the toolkit" data-reveal>
        {CATS.map((c) => (
          <button type="button" key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}<sup>{c === "All" ? STACK.length : STACK.filter((s) => s.cat === c).length}</sup>
          </button>
        ))}
      </div>
      <div className="chips" ref={grid}>
        {list.map((s) => (
          <div className="chip glow" key={s.name} data-reveal>
            <span className="label">{s.cat}</span><b>{s.name}</b><span>{s.note}</span>
          </div>
        ))}
      </div>
    </>
  );
}