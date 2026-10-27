"use client";
import { useEffect, useRef } from "react";
import anime from "animejs";
import Counter from "./Counter";

const TITLE = "KaalKrit";

export default function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLElement>(null);

  // ---- indigo flow field: thousands of short strokes drifting along a slowly turning curl field
  useEffect(() => {
    const cv = canvas.current!, ctx = cv.getContext("2d")!;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, t = 0;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    type P = { x: number; y: number; life: number; hue: number };
    let ps: P[] = [];
    const seed = (p?: P): P => {
      const q = p || ({} as P);
      q.x = Math.random() * w; q.y = Math.random() * h; q.life = 60 + Math.random() * 180;
      q.hue = Math.random() < 0.12 ? 1 : 0;                   // a few red threads among the indigo
      return q;
    };
    let A = "110,112,240", B = "243,46,53", G = "8,7,11";
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      A = cs.getPropertyValue("--flow-a").trim() || A; B = cs.getPropertyValue("--flow-b").trim() || B; G = cs.getPropertyValue("--flow-ground").trim() || G;
    };
    readTheme();
    const size = () => {
      const r = cv.getBoundingClientRect();
      w = r.width; h = r.height; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(${G})`; ctx.fillRect(0, 0, w, h);
      ps = Array.from({ length: Math.round(Math.min(1400, (w * h) / 900)) }, () => seed());
    };
    const field = (x: number, y: number) => {
      const s = 0.0016;
      return Math.sin(x * s * 1.7 + t * 0.21) * 1.6 + Math.cos(y * s * 2.3 - t * 0.17) * 1.4 + Math.sin((x + y) * s * 0.9 + t * 0.11) * 1.2;
    };
    const step = () => {
      t += 0.016;
      ctx.fillStyle = `rgba(${G},0.075)`; ctx.fillRect(0, 0, w, h);   // trails fade into the black
      ctx.lineWidth = 0.9;
      for (const p of ps) {
        const a = field(p.x, p.y), nx = p.x + Math.cos(a) * 1.25, ny = p.y + Math.sin(a) * 1.25;
        const fade = Math.min(1, p.life / 40);
        ctx.strokeStyle = p.hue ? `rgba(${B},${0.55 * fade})` : `rgba(${A},${0.42 * fade})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        p.x = nx; p.y = ny;
        if (--p.life < 0 || nx < -10 || ny < -10 || nx > w + 10 || ny > h + 10) seed(p);
      }
    };
    const loop = () => { step(); raf = visible ? requestAnimationFrame(loop) : 0; };
    size();
    if (calm) { for (let i = 0; i < 240; i++) step(); }
    else raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !calm) raf = requestAnimationFrame(loop); });
    io.observe(cv);
    const ro = new ResizeObserver(() => size()); ro.observe(cv);
    const retheme = () => { readTheme(); size(); if (calm) for (let i = 0; i < 240; i++) step(); };
    const mq = matchMedia("(prefers-color-scheme: light)");
    window.addEventListener("kk-theme", retheme); mq.addEventListener("change", retheme);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.removeEventListener("kk-theme", retheme); mq.removeEventListener("change", retheme); };
  }, []);

  // ---- type and buttons: letters rise once on load, buttons lean toward the pointer
  useEffect(() => {
    const el = root.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add({ targets: el.querySelectorAll(".giant .ch"), translateY: ["38%", "0%"], rotate: [6, 0], opacity: [0.25, 1], delay: anime.stagger(55), duration: 1300 })
      .add({ targets: el.querySelectorAll(".slash span"), translateX: [-40, 0], opacity: [0.3, 1], delay: anime.stagger(120), duration: 900 }, "-=900")
      .add({ targets: el.querySelectorAll("[data-hero-fade]"), translateY: [16, 0], opacity: [0.35, 1], delay: anime.stagger(80), duration: 800 }, "-=700");
    const btns = [...el.querySelectorAll<HTMLElement>("[data-magnetic]")];
    const offs = btns.map((b) => {
      const move = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        anime({ targets: b, translateX: (e.clientX - r.left - r.width / 2) * 0.28, translateY: (e.clientY - r.top - r.height / 2) * 0.35, duration: 500, easing: "easeOutQuad" });
      };
      const leave = () => anime({ targets: b, translateX: 0, translateY: 0, duration: 900, easing: "easeOutElastic(1, .45)" });
      b.addEventListener("pointermove", move); b.addEventListener("pointerleave", leave);
      return () => { b.removeEventListener("pointermove", move); b.removeEventListener("pointerleave", leave); };
    });
    return () => offs.forEach((f) => f());
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <canvas className="flow" ref={canvas} aria-hidden="true" />
      <div className="wrap">
        <div className="issue label"><span>Team KaalKrit · Engineers</span><span><b>Robotics</b> · Edge AI · Drones · Robotic arms</span><span>Issue 01 — 2026</span></div>
        <h1 className="giant" aria-label={TITLE}>
          {TITLE.split("").map((c, i) => <span className="ch" key={i} aria-hidden="true">{c}</span>)}
        </h1>
        <div className="hero-row">
          <p className="slash"><span>We build machines /</span><span>that see, think and fly</span></p>
          <div>
            <p className="lede" data-hero-fade>A student engineering team of ten. We design, wire, calibrate and code our own drones, robots and robotic arms, put AI on the edge of them, and take them to national competitions: NIDAR, e-Yantra, MATLAB, ISRO and more.</p>
            <div className="ctas" data-hero-fade>
              <a className="btn solid" href="#work" data-magnetic>See our work ↓</a>
              <a className="btn ghost" href="#partner" data-magnetic>Partner with us</a>
            </div>
          </div>
        </div>
        <div className="hstats" data-hero-fade>
          <div><b><Counter to={10} /></b><span>engineers</span></div>
          <div><b><Counter to={8} /></b><span>competitions entered</span></div>
          <div><b><Counter to={4} /></b><span>domains: drones, robots, edge AI, arms</span></div>
          <div><b>Top <Counter to={80} /></b><span>of 358 teams at NIDAR 2026</span></div>
        </div>
      </div>
    </section>
  );
}
