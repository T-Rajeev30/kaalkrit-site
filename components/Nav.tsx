"use client";
import { useEffect, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";

const LINKS = [["domains", "What we do"], ["work", "Work"], ["process", "Process"], ["competitions", "Competitions"], ["team", "Team"], ["partner", "Partner"]];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={"nav" + (solid ? " solid" : "")}>
      <div className="wrap">
        <a className="brand" href="/">KaalKrit</a>
        <span className="label">Robotics · Edge AI · Drones</span>
        <nav aria-label="Sections">{LINKS.map(([id, t]) => <a key={id} href={`/#${id}`}>{t}</a>)}</nav>
        <ThemeSwitch />
      </div>
    </header>
  );
}