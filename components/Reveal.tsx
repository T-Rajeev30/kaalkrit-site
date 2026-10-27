"use client";
import { useEffect, useRef } from "react";
import anime from "animejs";

/** Scroll choreography (entrances ease out, 60–90 ms stagger, nothing over ~1 s):
 *  [data-reveal] slides the last 28 px into place, [data-wipe] headings get a red newsprint bar that sweeps
 *  across and off, [data-draw] strokes draw themselves in. The section also gets .in, which CSS uses for
 *  meters and lines. Everything is readable before it runs. */
export default function Reveal({ children, className, as = "div", id }: { children: React.ReactNode; className?: string; as?: "div" | "section"; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.classList.add("in");
      if (calm) return;
      anime({ targets: el.querySelectorAll("[data-reveal]"), translateY: [28, 0], opacity: [0.45, 1], delay: anime.stagger(80), duration: 900, easing: "easeOutExpo" });
      el.querySelectorAll<HTMLElement>("[data-wipe]").forEach((h, i) => {
        const bar = document.createElement("span"); bar.className = "wipe"; h.appendChild(bar);
        anime.timeline({ delay: 120 + i * 120 })
          .add({ targets: bar, scaleX: [0, 1], duration: 420, easing: "easeInOutQuart", begin: () => { bar.style.transformOrigin = "left"; } })
          .add({ targets: bar, scaleX: [1, 0], duration: 420, easing: "easeInOutQuart", begin: () => { bar.style.transformOrigin = "right"; }, complete: () => bar.remove() });
      });
      const strokes = el.querySelectorAll<SVGPathElement>("[data-draw]");
      if (strokes.length) anime({ targets: strokes, strokeDashoffset: [anime.setDashoffset, 0], delay: anime.stagger(45), duration: 900, easing: "easeInOutSine" });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as as any;
  return <Tag ref={ref} className={className} id={id}>{children}</Tag>;
}