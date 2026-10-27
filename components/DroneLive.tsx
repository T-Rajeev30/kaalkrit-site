"use client";
import { useEffect, useRef } from "react";
import { iso, translateAlong, segment, ring } from "@/lib/iso/iso-kit.mjs";
import { blades } from "@/lib/figure.mjs";

type Cfg = { P: any; LEG: number; DROP: number; LIDAR: [number, number]; MOTORS: [string, number, number, string][] };

/** Hover model behind the figure: spool 2 s, climb at most 25 cm/s, descend at most 50 cm/s, a centimetre of
 *  wander that the flow sensor holds, lidar valid from 10 cm (backup rangefinder below that). */
export default function DroneLive({ cfg, children }: { cfg: Cfg; children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const { P, LEG, DROP, LIDAR, MOTORS } = cfg;
    const box = host.current!, stage = box.querySelector<HTMLElement>(".am-stage")!, svg = stage.querySelector("svg")!;
    const part = (n: string) => svg.querySelector<SVGElement>(`[data-part="${n}"]`)!;
    const drone = part("drone"), slider = part("slider"), beam = part("beam"), foot = part("footprint");
    const spot = part("spot").querySelector("circle")!, tether = part("tether");
    const tPath = tether.querySelector("path")!, tEnds = tether.querySelectorAll("circle");
    const props = MOTORS.map(([n]) => svg.querySelector<SVGPathElement>(`[data-prop="${n}"] [data-blades]`)!);
    const readout = box.querySelector<HTMLElement>("[data-readout]")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    const GROUND = (LEG - DROP) / 100;
    const S = { h: GROUND, v: 0, target: 0.4, phase: "landed", spool: 0, spin: 0, ang: 0, t: 0, dx: 0, dy: 0 };
    const TOUR: [number, string, number?][] = [[0, "go", 0.4], [7, "go", 0.7], [13, "go", 0.5], [19, "land"], [27, "loop"]];
    let frame = 0, last = 0, clock = 0, touring = true, visible = false, idle: any = 0, step = 0;
    const takeoff = (t: number) => { S.target = clamp(t, 0.3, 0.8); if (S.phase === "landed") { S.phase = "spool"; S.spool = 0; } else if (S.phase === "landing") S.phase = "flying"; };
    const land = () => { if (S.phase !== "landed") S.phase = "landing"; };
    const tether3 = (a: number[], b: number[]) => {
      const L = 120, dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], dist = Math.hypot(dx, dy, dz);
      const bow = Math.sqrt(Math.max(0, L * L - dist * dist)) * 0.2, pts: number[][] = [];
      for (let i = 0; i <= 16; i++) { const t = i / 16, s = 4 * t * (1 - t); pts.push(iso([a[0] + dx * t - bow * s * 0.35, a[1] + dy * t + bow * s, Math.max(0.7, a[2] + dz * t - bow * s * 0.25 * (1 - t))], P)); }
      return pts;
    };
    const draw = () => {
      const z0 = S.h * 100 + DROP;
      drone.setAttribute("transform", translateAlong(P, [S.dx, S.dy, z0]));
      slider.setAttribute("transform", translateAlong(P, [0, 0, S.h * 100]));
      const lx = LIDAR[0] + S.dx, ly = LIDAR[1] + S.dy;
      beam.setAttribute("d", segment([lx, ly, z0 - DROP], [lx, ly, 0.5], P));
      const [sx, sy] = iso([lx, ly, 0.5], P); spot.setAttribute("cx", sx.toFixed(1)); spot.setAttribute("cy", sy.toFixed(1));
      foot.setAttribute("d", ring(S.dx, S.dy, Math.max(1.5, (z0 - 1.4) * Math.tan((21 * Math.PI) / 180)), 0.5, P, 56));
      const pts = tether3([0, 0, 4.6], [-4.2 + S.dx, S.dy, z0 - 1.6]);
      tPath.setAttribute("d", "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L"));
      tEnds[0].setAttribute("cx", pts[0][0].toFixed(1)); tEnds[0].setAttribute("cy", pts[0][1].toFixed(1));
      tEnds[1].setAttribute("cx", pts[16][0].toFixed(1)); tEnds[1].setAttribute("cy", pts[16][1].toFixed(1));
      MOTORS.forEach(([, mx, my, dir], i) => props[i].setAttribute("d", blades(mx, my, (dir === "ccw" ? 1 : -1) * S.ang + i * 0.7, P)));
      const src = S.h < 0.1 ? "backup rangefinder" : "lidar", q = Math.round(40 + 100 * smooth(0.1, 0.4, S.h));
      const word = ({ landed: "landed", spool: "spooling up", landing: "landing", flying: Math.abs(S.target - S.h) < 0.02 ? "holding" : S.target > S.h ? "climbing" : "descending" } as any)[S.phase];
      const text = `${word} · ${S.h.toFixed(2)} m from ${src} · flow q ${q}`;
      if (readout.textContent !== text) readout.textContent = text;
      stage.setAttribute("aria-valuenow", S.h.toFixed(2)); stage.setAttribute("aria-valuetext", text);
    };
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60; last = now; S.t += dt;
      if (touring) {
        clock += dt;
        while (step < TOUR.length && clock >= TOUR[step][0]) {
          const [, act, val] = TOUR[step++];
          if (act === "go") takeoff(val!); else if (act === "land") land(); else { clock = 0; step = 0; }
        }
      }
      if (S.phase === "spool") { S.spool += dt; if (S.spool >= 2) S.phase = "flying"; }
      let want = 0;
      if (S.phase === "flying") want = clamp((S.target - S.h) * 1.6, -0.5, 0.25);
      if (S.phase === "landing") want = S.h > 0.3 ? -0.5 : -0.3;
      S.v += (want - S.v) * (1 - Math.exp(-dt / 0.35));
      S.h = Math.max(GROUND, S.h + S.v * dt);
      if (S.phase === "landing" && S.h <= GROUND + 1e-4) { S.phase = "landed"; S.v = 0; }
      const air = smooth(GROUND, GROUND + 0.15, S.h);
      S.dx = air * (1.1 * Math.sin(S.t * 0.7) + 0.5 * Math.sin(S.t * 1.9 + 1));
      S.dy = air * (0.9 * Math.sin(S.t * 0.53 + 2) + 0.4 * Math.sin(S.t * 1.6));
      const spinWant = S.phase === "landed" ? 0 : S.phase === "spool" ? Math.min(1, S.spool / 2) : 1;
      S.spin += (spinWant - S.spin) * (1 - Math.exp(-dt / 0.6));
      S.ang += S.spin * 2 * Math.PI * 1.6 * dt;
      draw();
      const settled = !touring && S.phase === "landed" && S.spin < 0.002;
      frame = visible && !settled ? requestAnimationFrame(tick) : 0;
    };
    const run = () => { if (!frame && visible && !still) { last = 0; frame = requestAnimationFrame(tick); } };
    const steer = (fn: () => void) => { touring = false; fn(); clearTimeout(idle); idle = setTimeout(() => { touring = true; clock = 0; step = 0; land(); run(); }, 5000); run(); };
    const io = new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" });
    io.observe(stage);
    const onMove = (e: PointerEvent) => { const b = svg.getBoundingClientRect(); steer(() => takeoff(0.3 + clamp(1 - (e.clientY - b.top) / b.height, 0, 1) * 0.5)); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") steer(() => takeoff((S.phase === "landed" ? 0.3 : S.target) + 0.1));
      else if (e.key === "ArrowDown") steer(() => takeoff(S.target - 0.1));
      else if (e.key === "l" || e.key === "L" || e.key === "End") steer(land);
      else return;
      e.preventDefault();
    };
    stage.addEventListener("pointermove", onMove); stage.addEventListener("keydown", onKey);
    if (still) { S.phase = "flying"; S.h = 0.4; S.target = 0.4; touring = false; }
    draw();
    return () => { cancelAnimationFrame(frame); io.disconnect(); clearTimeout(idle); stage.removeEventListener("pointermove", onMove); stage.removeEventListener("keydown", onKey); };
  }, [cfg]);
  return <div ref={host}>{children}</div>;
}
