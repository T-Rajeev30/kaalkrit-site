"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import anime from "animejs";
import Signature from "./Signature";
import Counter from "@/components/Counter";
import type { Member } from "@/data/members";

const pad = (n: number) => String(n).padStart(2, "0");
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/** Profile hero: generative artwork wrapped around a shaped portrait, a rotating name ring,
 *  letters that rise in, and a portrait that leans with the pointer. */
export default function MemberHero({ m, index, total }: { m: Member; index: number; total: number }) {
  const root = useRef<HTMLElement>(null);
  const ring = `${m.name} · ${m.role} · ${m.callsign} · Team KaalKrit · `.toUpperCase();

  useEffect(() => {
    const el = root.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    anime.timeline({ easing: "easeOutExpo" })
      .add({ targets: el.querySelectorAll(".m-name .ch"), translateY: ["60%", "0%"], rotate: [8, 0], opacity: [0.2, 1], delay: anime.stagger(40), duration: 1100 })
      .add({ targets: el.querySelector(".m-shape"), scale: [0.8, 1], rotate: [-6, 0], opacity: [0.2, 1], duration: 1400 }, 0)
      .add({ targets: el.querySelectorAll("[data-hero-fade]"), translateY: [18, 0], opacity: [0.2, 1], delay: anime.stagger(70), duration: 800 }, "-=900");
    const fr = el.querySelector<HTMLElement>(".m-frame")!;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      fr.style.setProperty("--rx", `${-y * 10}deg`); fr.style.setProperty("--ry", `${x * 12}deg`);
      fr.style.setProperty("--tx", `${x * 16}px`); fr.style.setProperty("--ty", `${y * 16}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <section className="m-hero" id="top" ref={root}>
      <Signature seed={m.slug} motif={m.motif} accent={m.accent} />
      <div className="wrap m-grid">
        <div className="m-copy">
          <Link href="/#team" className="m-back label" data-hero-fade>← All members</Link>
          <p className="label" data-hero-fade>
            Member {pad(index + 1)} / {pad(total)} · <b>{m.callsign}</b>
            {m.placeholder && <span className="m-sample">Sample profile</span>}
          </p>
          <h1 className="m-name" aria-label={m.name}>
            {m.name.split(" ").map((w, i) => (
              <span className="w" key={i} aria-hidden="true">{w.split("").map((c, j) => <span className="ch" key={j}>{c}</span>)}</span>
            ))}
          </h1>
          <p className="m-role" data-hero-fade>{m.role}</p>
          <div className="m-tags" data-hero-fade>{m.focus.map((f) => <i key={f}>{f}</i>)}</div>
          <div className="m-stats" data-hero-fade>
            <div><b><Counter to={m.projects.length} /></b><span>projects</span></div>
            <div><b><Counter to={m.competitions.length} /></b><span>competitions</span></div>
            <div><b><Counter to={m.tools.length} /></b><span>tools</span></div>
            <div><b>{m.joined}</b><span>joined</span></div>
          </div>
        </div>

        <div className="m-portrait" data-anchor>
          <div className="m-frame">
            <svg className="m-ring" viewBox="0 0 200 200" aria-hidden="true">
              <defs><path id={`rp-${m.slug}`} d="M100,100 m-92,0 a92,92 0 1,1 184,0 a92,92 0 1,1 -184,0" /></defs>
              <text><textPath href={`#rp-${m.slug}`} textLength="574" lengthAdjust="spacing">{ring}</textPath></text>
            </svg>
            <svg className="m-ticks" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="99" /></svg>
            <div className={`m-shape shape-${m.shape}`}>
              {m.photo ? <img src={m.photo} alt={m.name} /> : <span className="ini">{m.placeholder ? pad(index + 1) : initials(m.name)}</span>}
              <span className="dots" aria-hidden="true" />
            </div>
            <span className="m-badge">{m.motif}</span>
          </div>
        </div>
      </div>
    </section>
  );
}