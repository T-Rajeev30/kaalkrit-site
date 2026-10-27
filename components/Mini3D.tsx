"use client";
import { useEffect, useRef } from "react";
import { MAKERS, stage } from "@/lib/models";

/** A small rotating 3D model for a domain card. Renders only while on screen; hover spins it faster. */
export default function Mini3D({ kind, label }: { kind: string; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    let ok = true;
    try { const t = document.createElement("canvas"); ok = !!(t.getContext("webgl2") || t.getContext("webgl")); } catch { ok = false; }
    if (!ok) return;
    const { renderer, scene, camera, fit } = stage(cv);
    const m = MAKERS[kind](); scene.add(m.group);
    camera.position.set(2.6, 1.7, 2.9); camera.lookAt(0, 0.05, 0);
    m.group.rotation.y = -0.5;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = false, last = 0, t = 0, boost = 0;
    const card = cv.closest(".domain") as HTMLElement | null;
    const enter = () => (boost = 1), leave = () => (boost = 0);
    card?.addEventListener("pointerenter", enter); card?.addEventListener("pointerleave", leave);
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; t += dt;
      m.group.rotation.y += dt * (0.35 + boost * 1.8);
      m.update(t, 0.6 + boost);
      renderer.render(scene, camera);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !calm) { last = 0; raf = requestAnimationFrame(frame); } });
    io.observe(cv);
    const ro = new ResizeObserver(() => { fit(); renderer.render(scene, camera); }); ro.observe(cv);
    m.update(0); renderer.render(scene, camera);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); card?.removeEventListener("pointerenter", enter); card?.removeEventListener("pointerleave", leave); renderer.dispose(); };
  }, [kind]);
  return <canvas ref={ref} className="mini3d" role="img" aria-label={label} />;
}
