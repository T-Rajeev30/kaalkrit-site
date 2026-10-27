"use client";
import { useEffect, useRef } from "react";
import anime from "animejs";

const NODES = [
  ["01", "Web dashboard", "Laptop or phone browser"],
  ["02", "Raspberry Pi 5", "Ground station: control server, logs, health checks"],
  ["03", "433 MHz radio", "MAVLink both ways, 100 mW"],
  ["04", "Kakute H7", "ArduPilot 4.7 on the drone"],
];

/** A red command travels out to the flight controller; an indigo confirmation comes back.
 *  That loop is what "commands are resent until the drone confirms them" looks like. */
export default function ControlChain() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chain = ref.current!, dot = chain.querySelector<HTMLElement>(".packet")!;
    const nodes = [...chain.querySelectorAll<HTMLElement>(".node")];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let inView = false, running = false, stop = false;
    const at = (n: HTMLElement) => { const a = chain.getBoundingClientRect(), b = n.getBoundingClientRect(); return [b.left - a.left + b.width / 2, b.top - a.top + b.height]; };
    const flash = (n: HTMLElement, cls: string) => { n.classList.add(cls); setTimeout(() => n.classList.remove(cls), 700); };
    const cycle = () => {
      if (!inView || stop) { running = false; return; }
      running = true;
      const pts = nodes.map(at);
      const tl = anime.timeline({ easing: "easeInOutQuart", complete: () => setTimeout(cycle, 1200) });
      dot.classList.remove("ack");
      tl.add({ targets: dot, translateX: pts[0][0], translateY: pts[0][1], opacity: [0, 1], scale: [0.4, 1], duration: 350, begin: () => flash(nodes[0], "hot") });
      pts.slice(1).forEach((p, i) => tl.add({ targets: dot, translateX: p[0], translateY: p[1], duration: 620, complete: () => flash(nodes[i + 1], "hot") }));
      tl.add({ targets: dot, scale: [1, 1.8, 1], duration: 420, complete: () => dot.classList.add("ack") });
      [...pts].reverse().slice(1).forEach((p, i) => tl.add({ targets: dot, translateX: p[0], translateY: p[1], duration: 480, complete: () => flash(nodes[nodes.length - 2 - i], "ack") }));
      tl.add({ targets: dot, opacity: 0, scale: 0.4, duration: 320 });
    };
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView && !running) cycle(); }, { threshold: 0.35 });
    io.observe(chain);
    return () => { stop = true; io.disconnect(); };
  }, []);
  return (
    <>
      <div className="chain" ref={ref}>
        <span className="packet" aria-hidden="true" />
        {NODES.map(([n, b, s]) => <div className="node" key={n} data-reveal><span className="n">{n}</span><b>{b}</b><span>{s}</span></div>)}
      </div>
      <div className="keyrow label" aria-hidden="true">
        <span><i style={{ background: "var(--red)" }} />Command out</span>
        <span><i style={{ background: "var(--indigo)" }} />Confirmation back</span>
      </div>
    </>
  );
}
