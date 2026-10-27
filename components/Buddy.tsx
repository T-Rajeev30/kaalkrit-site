"use client";
import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import * as THREE from "three";
import { drone, stage } from "@/lib/models";

const LINES: Record<string, string[]> = {
  top: ["Hi, I’m Kaal, the team’s drone. Scroll down, I’ll show you around.", "Click me and I’ll do a flip."],
  domains: ["Drones, robots, edge AI and arms. Most of our builds use all four.", "That chip? It’s where the AI lives, right on the robot."],
  work: ["That’s my big sibling, AirMouse. It hovers without GPS!", "Move over the drawing and set its hover height."],
  competitions: ["Top 80 of 358 at NIDAR 2026. 38th overall!", "e-Yantra three years running. We like a challenge."],
  team: ["Ten engineers. Everyone solders, everyone codes.", "Faces coming soon. They’re busy calibrating compasses."],
  partner: ["Want to build the next one with us? Copy the email!", "We’re after carbon fibre, sensors and test space."],
};

/** A live 3D buddy: hovers in the corner, watches the cursor, blinks, talks about the section in view,
 *  and flips when clicked. Hidden with ×, and remembered. Still under reduced motion. */
export default function Buddy() {
  const cv = useRef<HTMLCanvasElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [line, setLine] = useState<{ tag: string; text: string }>({ tag: "Kaal", text: LINES.top[0] });
  const [talking, setTalking] = useState(true);
  const quiet = useRef<any>(0);

  useEffect(() => { try { setHidden(localStorage.getItem("kk-buddy") === "off"); } catch {} }, []);

  useEffect(() => {
    if (hidden) return;
    const canvas = cv.current!;
    try { const t = document.createElement("canvas"); if (!(t.getContext("webgl2") || t.getContext("webgl"))) return; } catch { return; }
    const { renderer, scene, camera, fit } = stage(canvas);
    const m = drone(true), rig = new THREE.Group(); rig.add(m.group); scene.add(rig);
    m.group.scale.setScalar(0.74);
    camera.position.set(3.5, 1.45, 1.25); camera.lookAt(0, 0.08, 0);
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const aim = { x: 0, y: 0 }, look = { x: 0, y: 0 }, flip = { a: 0 };
    let raf = 0, t = 0, last = 0, nextBlink = 2, blink = 0, visible = true;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      aim.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)));
      aim.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.5)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; t += dt;
      look.x += (aim.x - look.x) * (1 - Math.exp(-dt / 0.25)); look.y += (aim.y - look.y) * (1 - Math.exp(-dt / 0.25));
      rig.position.y = Math.sin(t * 1.6) * 0.08;                         // hover bob
      rig.rotation.y = -look.x * 0.9 + Math.sin(t * 0.7) * 0.06;          // turn to face the cursor
      rig.rotation.z = look.y * 0.18 + Math.sin(t * 1.1) * 0.03;          // nod toward it
      rig.rotation.x = flip.a;
      if (m.face) m.face.position.z = -look.x * 0.04;
      if ((nextBlink -= dt) < 0) { blink = 0.14; nextBlink = 2.2 + Math.random() * 3; }
      if (blink > 0) blink -= dt;
      m.eyes?.forEach((e) => e.scale.set(1, blink > 0 ? 0.15 : 1, 1));
      m.update(t, 1);
      renderer.render(scene, camera);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    const onVis = () => { visible = !document.hidden; if (visible && !raf && !calm) { last = 0; raf = requestAnimationFrame(frame); } };
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => { fit(); renderer.render(scene, camera); }); ro.observe(canvas);
    m.update(0); renderer.render(scene, camera);
    if (!calm) raf = requestAnimationFrame(frame);

    // talk about whatever section is on screen
    const ids = Object.keys(LINES);
    const said: Record<string, number> = {};
    const say = (id: string) => {
      const list = LINES[id]; said[id] = ((said[id] ?? -1) + 1) % list.length;
      setLine({ tag: id === "top" ? "Kaal" : "Kaal · " + id, text: list[said[id]] });
      setTalking(true); clearTimeout(quiet.current); quiet.current = setTimeout(() => setTalking(false), 6500);
      if (bubble.current && !calm) anime({ targets: bubble.current, scale: [0.85, 1], opacity: [0.4, 1], duration: 500, easing: "easeOutBack" });
    };
    let current = "";
    const io = new IntersectionObserver((list) => {
      const hit = list.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (hit && hit.target.id !== current) { current = hit.target.id; say(current); }
    }, { threshold: [0.35, 0.6] });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const click = () => {
      say(current || "top");
      if (calm) return;
      anime({ targets: flip, a: [0, Math.PI * 2], duration: 900, easing: "easeInOutBack", complete: () => (flip.a = 0) });
    };
    canvas.addEventListener("click", click);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); renderer.dispose();
      window.removeEventListener("pointermove", onMove); document.removeEventListener("visibilitychange", onVis); canvas.removeEventListener("click", click);
    };
  }, [hidden]);

  const toggle = () => { const h = !hidden; setHidden(h); try { localStorage.setItem("kk-buddy", h ? "off" : "on"); } catch {} };
  return (
    <div className={"buddy" + (hidden ? " hidden" : "")}>
      <div className={"say" + (talking ? "" : " quiet")} ref={bubble} aria-live="polite"><b>{line.tag}</b>{line.text}</div>
      <div style={{ position: "relative" }}>
        <canvas ref={cv} role="img" aria-label="Kaal, a small 3D drone that follows your cursor. Click it for a flip." />
        <button type="button" className="x" onClick={toggle} aria-label={hidden ? "Show Kaal" : "Hide Kaal"}>{hidden ? "Show Kaal" : "×"}</button>
      </div>
    </div>
  );
}
