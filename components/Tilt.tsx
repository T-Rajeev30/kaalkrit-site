"use client";
import { useRef } from "react";
import anime from "animejs";

/** A card that leans toward the pointer and springs back. */
export default function Tilt({ children, className, max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const calm = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const move = (e: React.PointerEvent) => {
    if (calm() || e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    anime({ targets: ref.current, rotateY: x * max * 2, rotateX: -y * max * 2, translateZ: 0, duration: 400, easing: "easeOutQuad" });
  };
  const leave = () => { if (!calm()) anime({ targets: ref.current, rotateY: 0, rotateX: 0, duration: 1000, easing: "easeOutElastic(1, .5)" }); };
  return <div ref={ref} className={className} onPointerMove={move} onPointerLeave={leave} style={{ transformStyle: "preserve-3d" }}>{children}</div>;
}
