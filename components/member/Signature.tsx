"use client";
import { useEffect, useRef } from "react";
import type { Motif } from "@/data/members";

/** Generative artwork that surrounds a member's portrait. The member's slug seeds it, so no two
 *  profiles draw the same picture, and the motif picks the machine it echoes. Follows the portrait
 *  ([data-anchor]), drifts against the pointer, pauses off screen, and holds still under reduced motion. */
const TAU = Math.PI * 2;
const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
type C = { ctx: CanvasRenderingContext2D; w: number; h: number; cx: number; cy: number; R: number; acc: string; fg: string };
type Art = { fade: number; draw: (c: C, t: number) => void };
const dot = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };

const ARTS: Record<Motif, (r: () => number) => Art> = {
  // orbit rings, spinning rotors and satellites
  rotor: (r) => {
    const rings = Array.from({ length: 6 + Math.floor(r() * 3) }, (_, i) => ({ k: 1.12 + i * 0.2 + r() * 0.06, d: 3 + r() * 16, g: 5 + r() * 28, s: (r() - 0.5) * 0.5, hot: r() < 0.35 }));
    const sats = Array.from({ length: 22 }, () => ({ k: rings[Math.floor(r() * rings.length)].k, a: r() * TAU, s: (0.1 + r() * 0.4) * (r() < 0.5 ? -1 : 1), z: 1.2 + r() * 2.4 }));
    const n = r() < 0.5 ? 3 : 4, off = r() * TAU;
    return { fade: 1, draw: ({ ctx, cx, cy, R, acc, fg }, t) => {
      for (const g of rings) {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * g.s); ctx.setLineDash([g.d, g.g]);
        ctx.strokeStyle = g.hot ? acc : fg; ctx.globalAlpha = g.hot ? 0.8 : 0.22;
        ctx.beginPath(); ctx.arc(0, 0, g.k * R, 0, TAU); ctx.stroke(); ctx.restore();
      }
      ctx.setLineDash([]);
      for (let i = 0; i < n; i++) {
        const a = off + (i * TAU) / n + t * 0.05, x = cx + Math.cos(a) * R * 2.05, y = cy + Math.sin(a) * R * 2.05, rr = R * 0.42, b = t * (i % 2 ? -7 : 7);
        ctx.globalAlpha = 0.2; ctx.strokeStyle = fg; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R * 1.05, cy + Math.sin(a) * R * 1.05); ctx.lineTo(x, y); ctx.stroke();
        ctx.globalAlpha = 0.5; ctx.strokeStyle = acc; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.stroke();
        ctx.globalAlpha = 0.9; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(x + Math.cos(b) * rr * 0.9, y + Math.sin(b) * rr * 0.9); ctx.lineTo(x - Math.cos(b) * rr * 0.9, y - Math.sin(b) * rr * 0.9); ctx.stroke(); ctx.lineWidth = 1;
        ctx.fillStyle = acc; dot(ctx, x, y, 3);
      }
      ctx.fillStyle = acc; ctx.globalAlpha = 0.85;
      for (const s of sats) { const a = s.a + t * s.s; dot(ctx, cx + Math.cos(a) * s.k * R, cy + Math.sin(a) * s.k * R, s.z); }
    } };
  },
  // PCB traces routing in toward the portrait, with signals running along them
  circuit: (r) => {
    const D = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]].map(([x, y]) => { const l = Math.hypot(x, y); return [x / l, y / l]; });
    const traces = Array.from({ length: 28 }, () => {
      const a = r() * TAU, st = 2.4 + r() * 1.8; let x = Math.cos(a) * st, y = Math.sin(a) * st, n = 0;
      const pts: number[][] = [[x, y]];
      while (n < 90 && Math.hypot(x, y) > 1.16) {
        const d = Math.hypot(x, y), tx = -x / d, ty = -y / d;
        const ok = D.map((v, i) => [i, v[0] * tx + v[1] * ty]).filter(([, dp]) => dp > 0.35);
        const dir = ok[Math.floor(r() * ok.length)][0], run = 2 + Math.floor(r() * 6);
        for (let k = 0; k < run && Math.hypot(x, y) > 1.16; k++, n++) { x += D[dir][0] * 0.1; y += D[dir][1] * 0.1; pts.push([x, y]); }
      }
      return { pts, sp: 0.08 + r() * 0.18, off: r(), hot: r() < 0.45 };
    });
    return { fade: 1, draw: ({ ctx, cx, cy, R, acc, fg }, t) => {
      const P = (p: number[]) => [cx + p[0] * R, cy + p[1] * R];
      for (const tr of traces) {
        ctx.strokeStyle = fg; ctx.globalAlpha = 0.2; ctx.lineWidth = 1.2; ctx.beginPath();
        tr.pts.forEach((p, i) => { const [x, y] = P(p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
        const [sx, sy] = P(tr.pts[0]); ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.arc(sx, sy, 3.2, 0, TAU); ctx.stroke();
        if (!tr.hot || tr.pts.length < 3) continue;
        const pos = ((t * tr.sp + tr.off) % 1) * (tr.pts.length - 1), i = Math.floor(pos);
        ctx.strokeStyle = acc; ctx.globalAlpha = 0.95; ctx.lineWidth = 2; ctx.beginPath();
        for (let k = Math.max(0, i - 6); k <= Math.min(i + 1, tr.pts.length - 1); k++) { const [x, y] = P(tr.pts[k]); k === Math.max(0, i - 6) ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); const [hx, hy] = P(tr.pts[Math.min(i + 1, tr.pts.length - 1)]); ctx.fillStyle = acc; dot(ctx, hx, hy, 2.6);
      }
      ctx.strokeStyle = acc; ctx.globalAlpha = 0.5; ctx.lineWidth = 2; ctx.beginPath();
      for (let k = 0; k < 64; k++) { const a = (k / 64) * TAU; ctx.moveTo(cx + Math.cos(a) * R * 1.09, cy + Math.sin(a) * R * 1.09); ctx.lineTo(cx + Math.cos(a) * R * 1.15, cy + Math.sin(a) * R * 1.15); }
      ctx.stroke(); ctx.lineWidth = 1;
    } };
  },
  // a lidar sweep painting the room around the portrait
  lidar: (r) => {
    const H = Array.from({ length: 5 }, (_, k) => ({ a: (r() * 0.35) / (k + 1), p: r() * TAU, k: k + 2 }));
    const base = 2.3 + r() * 0.6, N = 540, sp = 0.9 + r() * 0.6;
    const pts = Array.from({ length: N }, (_, i) => { const a = (i / N) * TAU; let d = base; H.forEach((h) => (d += h.a * Math.sin(h.k * a + h.p) * base)); return { a, d: d * (1 + (r() - 0.5) * 0.03) }; });
    for (let o = 0; o < 4; o++) { const a = r() * TAU, d = 1.45 + r() * 0.6, n = 10 + Math.floor(r() * 14), w = 0.08 + r() * 0.1; for (let i = 0; i < n; i++) pts.push({ a: a + (i / n - 0.5) * w * 2, d: d + (r() - 0.5) * 0.04 }); }
    return { fade: 1, draw: ({ ctx, cx, cy, R, acc, fg }, t) => {
      ctx.strokeStyle = fg; ctx.globalAlpha = 0.1;
      for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.arc(cx, cy, R * (0.6 + k * 0.6), 0, TAU); ctx.stroke(); }
      const s = (t * sp) % TAU; ctx.fillStyle = acc;
      for (let j = 0; j < 14; j++) {
        ctx.globalAlpha = 0.1 * (1 - j / 14); ctx.beginPath();
        ctx.arc(cx, cy, R * 3.6, s - (j + 1) * 0.035, s - j * 0.035); ctx.arc(cx, cy, R * 1.05, s - j * 0.035, s - (j + 1) * 0.035, true); ctx.fill();
      }
      for (const p of pts) {
        let age = (s - p.a) % TAU; if (age < 0) age += TAU;
        ctx.globalAlpha = Math.max(0.1, Math.exp(-age * 0.7));
        ctx.fillRect(cx + Math.cos(p.a) * p.d * R - 1.2, cy + Math.sin(p.a) * p.d * R - 1.2, 2.4, 2.4);
      }
      ctx.strokeStyle = acc; ctx.globalAlpha = 0.9; ctx.beginPath();
      ctx.moveTo(cx + Math.cos(s) * R * 1.05, cy + Math.sin(s) * R * 1.05); ctx.lineTo(cx + Math.cos(s) * R * 3.6, cy + Math.sin(s) * R * 3.6); ctx.stroke();
    } };
  },
  // robot arms reaching out from the portrait and drawing with their end effectors
  linkage: (r) => {
    const arms = Array.from({ length: r() < 0.5 ? 2 : 1 }, (_, i) => ({
      base: r() * TAU + i * Math.PI, L: [0.95 + r() * 0.3, 0.75 + r() * 0.3, 0.5 + r() * 0.25, 0.3 + r() * 0.15],
      f: Array.from({ length: 4 }, () => 0.2 + r() * 0.5), ph: Array.from({ length: 4 }, () => r() * TAU),
      amp: [0.6, 1.1, 1.4, 1.8].map((a) => a * (0.6 + r() * 0.6)), trail: [] as number[][],
    }));
    return { fade: 1, draw: ({ ctx, cx, cy, R, acc, fg }, t) => {
      for (const arm of arms) {
        const b = arm.base + Math.sin(t * 0.1) * 0.3; let x = cx + Math.cos(b) * R * 1.08, y = cy + Math.sin(b) * R * 1.08, ang = b;
        const js = [[x, y]];
        arm.L.forEach((L, k) => { ang += arm.amp[k] * Math.sin(arm.f[k] * t + arm.ph[k]) * 0.5; x += Math.cos(ang) * L * R; y += Math.sin(ang) * L * R; js.push([x, y]); });
        arm.trail.push([(x - cx) / R, (y - cy) / R]); if (arm.trail.length > 280) arm.trail.shift();
        ctx.strokeStyle = acc; ctx.lineWidth = 1.4;
        for (let i = 1; i < arm.trail.length; i++) {
          ctx.globalAlpha = (i / arm.trail.length) * 0.8; ctx.beginPath();
          ctx.moveTo(cx + arm.trail[i - 1][0] * R, cy + arm.trail[i - 1][1] * R); ctx.lineTo(cx + arm.trail[i][0] * R, cy + arm.trail[i][1] * R); ctx.stroke();
        }
        ctx.lineCap = "round"; ctx.strokeStyle = fg; ctx.globalAlpha = 0.2; ctx.lineWidth = 9; ctx.beginPath();
        js.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.stroke();
        ctx.strokeStyle = acc; ctx.globalAlpha = 0.9; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineCap = "butt";
        ctx.fillStyle = fg; js.forEach(([px, py], i) => { ctx.globalAlpha = 0.9; dot(ctx, px, py, i === js.length - 1 ? 4 : 3); });
      }
      ctx.lineWidth = 1;
    } };
  },
  // contour lines breathing around the portrait
  topo: (r) => {
    const K = Array.from({ length: 4 }, (_, i) => ({ k: i + 2 + Math.floor(r() * 3), a: 0.04 + r() * 0.08, p: r() * TAU, s: (r() - 0.5) * 0.6 }));
    return { fade: 1, draw: ({ ctx, cx, cy, R, acc, fg }, t) => {
      for (let i = 0; i < 16; i++) {
        const base = 1.1 + i * 0.15; ctx.beginPath();
        for (let j = 0; j <= 180; j++) {
          const th = (j / 180) * TAU; let d = base;
          for (const k of K) d += k.a * (1 + i * 0.25) * Math.sin(k.k * th + k.p + t * k.s + i * 0.15);
          const x = cx + Math.cos(th) * d * R, y = cy + Math.sin(th) * d * R; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        const hot = i % 4 === 0; ctx.strokeStyle = hot ? acc : fg; ctx.globalAlpha = hot ? 0.8 : 0.16; ctx.lineWidth = hot ? 1.4 : 1; ctx.stroke();
      }
      ctx.fillStyle = acc; ctx.globalAlpha = 1;
      for (let i = 0; i < 3; i++) { const a = t * (0.2 + i * 0.07) + i * 2; const d = 1.1 + (i * 4 + 4) * 0.15; dot(ctx, cx + Math.cos(a) * d * R, cy + Math.sin(a) * d * R, 3.5); }
      ctx.lineWidth = 1;
    } };
  },
  // a swarm chasing moving waypoints and steering clear of the portrait
  swarm: (r) => {
    const A = Array.from({ length: 3 }, () => ({ rx: 1.6 + r() * 1.2, ry: 1.2 + r(), fx: 0.15 + r() * 0.25, fy: 0.15 + r() * 0.25, p: r() * TAU }));
    const ag = Array.from({ length: 170 }, (_, i) => ({ x: (r() - 0.5) * 6, y: (r() - 0.5) * 4, vx: 0, vy: 0, a: i % 3, ox: (r() - 0.5) * 0.9, oy: (r() - 0.5) * 0.9, hot: r() < 0.3 }));
    let last = -1;
    return { fade: 0.16, draw: ({ ctx, cx, cy, R, acc, fg }, t) => {
      const dt = last < 0 ? 0.016 : Math.min(0.05, Math.max(0, t - last)); last = t;
      ctx.lineWidth = 1.6;
      for (const g of ag) {
        const T = A[g.a], tx = Math.cos(t * T.fx + T.p) * T.rx + g.ox, ty = Math.sin(t * T.fy * 1.3 + T.p) * T.ry + g.oy;
        let ax = (tx - g.x) * 0.9 + (Math.random() - 0.5) * 1.6, ay = (ty - g.y) * 0.9 + (Math.random() - 0.5) * 1.6;
        const d = Math.hypot(g.x, g.y) || 1; if (d < 1.3) { ax += (g.x / d) * (1.3 - d) * 24; ay += (g.y / d) * (1.3 - d) * 24; }
        g.vx = (g.vx + ax * dt) * 0.995; g.vy = (g.vy + ay * dt) * 0.995;
        const v = Math.hypot(g.vx, g.vy); if (v > 1.6) { g.vx *= 1.6 / v; g.vy *= 1.6 / v; }
        g.x += g.vx * dt; g.y += g.vy * dt;
        ctx.strokeStyle = g.hot ? acc : fg; ctx.globalAlpha = g.hot ? 0.9 : 0.4; ctx.beginPath();
        ctx.moveTo(cx + (g.x - g.vx * 0.07) * R, cy + (g.y - g.vy * 0.07) * R); ctx.lineTo(cx + g.x * R, cy + g.y * R); ctx.stroke();
      }
      ctx.lineWidth = 1;
    } };
  },
};

const ticks = ({ ctx, w, h, fg }: C) => {
  ctx.strokeStyle = fg; ctx.globalAlpha = 0.07; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 24; x < w; x += 48) for (let y = 24; y < h; y += 48) { ctx.moveTo(x - 3, y); ctx.lineTo(x + 3, y); ctx.moveTo(x, y - 3); ctx.lineTo(x, y + 3); }
  ctx.stroke();
};

export default function Signature({ seed, motif, accent }: { seed: string; motif: Motif; accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!;
    const art = ARTS[motif](rng(hash(seed)));
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0, raf = 0, visible = true, last = 0, t = 8, fg = "#ece8e1", ground = "8,7,11";
    const ptr = { x: 0, y: 0 }, off = { x: 0, y: 0 };
    const theme = () => { const cs = getComputedStyle(document.documentElement); fg = cs.getPropertyValue("--bone").trim() || fg; ground = cs.getPropertyValue("--flow-ground").trim() || ground; };
    const anchor = () => {
      const a = cv.parentElement?.querySelector<HTMLElement>("[data-anchor]"), cr = cv.getBoundingClientRect();
      if (!a) return { cx: w / 2, cy: h / 2, R: Math.min(w, h) * 0.18 };
      const r = a.getBoundingClientRect(); return { cx: r.left - cr.left + r.width / 2, cy: r.top - cr.top + r.height / 2, R: r.width / 2 };
    };
    const paint = () => {
      off.x += (ptr.x - off.x) * 0.06; off.y += (ptr.y - off.y) * 0.06;
      ctx.globalAlpha = 1;
      if (art.fade >= 1) ctx.clearRect(0, 0, w, h); else { ctx.fillStyle = `rgba(${ground},${art.fade})`; ctx.fillRect(0, 0, w, h); }
      const A = anchor(), c: C = { ctx, w, h, cx: A.cx + off.x, cy: A.cy + off.y, R: A.R, acc: accent, fg };
      if (art.fade >= 1) ticks(c);
      ctx.save(); art.draw(c, t); ctx.restore();
    };
    const size = () => {
      const r = cv.getBoundingClientRect(); w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (calm) { for (let i = 0; i < 120; i++) { t += 0.03; paint(); } }
    };
    const frame = (now: number) => { const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; t += dt; paint(); raf = visible ? requestAnimationFrame(frame) : 0; };
    const move = (e: PointerEvent) => { ptr.x = (e.clientX - window.innerWidth / 2) * -0.03; ptr.y = (e.clientY - window.innerHeight / 2) * -0.03; };
    const retheme = () => { theme(); if (calm) size(); };
    theme(); size();
    if (!calm) { raf = requestAnimationFrame(frame); window.addEventListener("pointermove", move, { passive: true }); }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !calm) { last = 0; raf = requestAnimationFrame(frame); } });
    io.observe(cv);
    const ro = new ResizeObserver(size); ro.observe(cv);
    const mq = matchMedia("(prefers-color-scheme: light)");
    window.addEventListener("kk-theme", retheme); mq.addEventListener("change", retheme);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", move); window.removeEventListener("kk-theme", retheme); mq.removeEventListener("change", retheme);
    };
  }, [seed, motif, accent]);
  return <canvas ref={ref} className="m-art" aria-hidden="true" />;
}