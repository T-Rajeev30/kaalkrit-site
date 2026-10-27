# Team KaalKrit: animated sections + member profile pages (/team/<slug>) + .gitignore
# Run this from the project folder (the one with package.json), then: npm run dev
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath 'package.json')) { throw 'Run this inside the project folder (where package.json is).' }
$utf8 = New-Object System.Text.UTF8Encoding $false
function W([string]$p, [string]$c) {
  $f = [IO.Path]::Combine((Get-Location).Path, $p)
  [void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($f))
  [IO.File]::WriteAllText($f, $c.Replace("`r`n", "`n"), $utf8)
  Write-Host "  wrote $p" -ForegroundColor Green
}

W '.gitignore' @'
# dependencies
node_modules/
.pnp
.pnp.js
.yarn/install-state.gz

# next.js build output
.next/
out/
build/

# typescript
*.tsbuildinfo
next-env.d.ts

# env files
.env
.env*.local
.env.development
.env.production

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# vercel / netlify
.vercel
.netlify

# editors and OS
.vscode/*
!.vscode/extensions.json
.idea/
*.swp
.DS_Store
Thumbs.db
desktop.ini
'@

W 'data/members.ts' @'
// Team members. Each one gets a profile page at /team/<slug> with its own generative artwork.
// photo: put the image in /public/team/ and write "/team/name.jpg" (square, at least 800×800). Leave "" for initials.
// accent + motif + shape make every profile look different. Motifs: rotor, circuit, lidar, linkage, topo, swarm.
// Shapes: hex, circle, notch, diamond, blob, slant, oct. slug is made from the name unless you set one.
export type Motif = "rotor" | "circuit" | "lidar" | "linkage" | "topo" | "swarm";
export type Shape = "hex" | "circle" | "notch" | "diamond" | "blob" | "slant" | "oct";
export type Skill = { name: string; level: number };
export type Project = { title: string; line: string; tags: string[] };
export type Member = {
  slug: string; name: string; role: string; callsign: string; focus: string[]; photo: string;
  accent: string; motif: Motif; shape: Shape;
  bio: string; quote: string; joined: string;
  skills: Skill[]; projects: Project[]; competitions: string[]; tools: string[];
  linkedin?: string; github?: string; email?: string; placeholder?: boolean;
};
type Input = Omit<Member, "slug"> & { slug?: string };

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-");
const define = (list: Input[]): Member[] => list.map((m) => ({ ...m, slug: m.slug || slugify(m.name) }));

// ---- sample content for the placeholders; replace with each member's real details ----
const SAMPLE: Record<string, Pick<Member, "skills" | "projects" | "tools" | "bio">> = {
  Drones: {
    bio: "Sample bio. Write two or three lines about what this member builds: airframes, flight controllers, tuning, test flights.",
    skills: [{ name: "Flight control & PID tuning", level: 82 }, { name: "ArduPilot configuration", level: 76 }, { name: "Sensor calibration", level: 70 }, { name: "Field testing", level: 88 }],
    projects: [{ title: "Project title", line: "One line on the build and your part in it.", tags: ["ArduPilot", "Kakute H7"] }, { title: "Project title", line: "One line on the build and your part in it.", tags: ["Optical flow", "LiDAR"] }],
    tools: ["ArduPilot", "Mission Planner", "Kakute H7", "EKF3", "Soldering"],
  },
  Robotics: {
    bio: "Sample bio. Write two or three lines about the robots this member builds: chassis, motor control, sensor fusion, navigation.",
    skills: [{ name: "Embedded C/C++", level: 78 }, { name: "Sensor fusion", level: 68 }, { name: "Motor control", level: 80 }, { name: "Navigation", level: 64 }],
    projects: [{ title: "Project title", line: "One line on the build and your part in it.", tags: ["Raspberry Pi 5", "2D LiDAR"] }, { title: "Project title", line: "One line on the build and your part in it.", tags: ["SLAM", "Mapping"] }],
    tools: ["Raspberry Pi 5", "2D LiDAR", "Python", "C++", "KiCad"],
  },
  "Edge AI": {
    bio: "Sample bio. Write two or three lines about the models this member trains and squeezes onto the robot.",
    skills: [{ name: "Computer vision", level: 84 }, { name: "Model optimisation", level: 72 }, { name: "Python", level: 88 }, { name: "Dataset building", level: 74 }],
    projects: [{ title: "Project title", line: "One line on the model and where it runs.", tags: ["YOLO", "Jetson"] }, { title: "Project title", line: "One line on the model and where it runs.", tags: ["OpenCV", "Edge"] }],
    tools: ["YOLO", "OpenCV", "PyTorch", "Jetson", "Python"],
  },
  "Robotic arms": {
    bio: "Sample bio. Write two or three lines about the manipulators this member designs and moves.",
    skills: [{ name: "Kinematics", level: 78 }, { name: "Mechanical CAD", level: 82 }, { name: "Servo & stepper control", level: 74 }, { name: "Fabrication", level: 70 }],
    projects: [{ title: "Project title", line: "One line on the arm and your part in it.", tags: ["Kinematics", "CAD"] }, { title: "Project title", line: "One line on the arm and your part in it.", tags: ["Servos", "Pick & place"] }],
    tools: ["Fusion 360", "SolidWorks", "Arduino", "3D printing", "MATLAB"],
  },
};

const LOOKS: Pick<Member, "accent" | "motif" | "shape" | "callsign">[] = [
  { accent: "#f32e35", motif: "rotor", shape: "hex", callsign: "Rotor" },
  { accent: "#4e50de", motif: "circuit", shape: "notch", callsign: "Trace" },
  { accent: "#2ec4b6", motif: "lidar", shape: "circle", callsign: "Sweep" },
  { accent: "#ff8a3d", motif: "linkage", shape: "slant", callsign: "Joint" },
  { accent: "#c084fc", motif: "topo", shape: "blob", callsign: "Contour" },
  { accent: "#f5c542", motif: "swarm", shape: "diamond", callsign: "Swarm" },
  { accent: "#38bdf8", motif: "lidar", shape: "oct", callsign: "Echo" },
  { accent: "#ff4d8d", motif: "rotor", shape: "circle", callsign: "Thrust" },
  { accent: "#7ee081", motif: "circuit", shape: "hex", callsign: "Volt" },
  { accent: "#c7cbd1", motif: "linkage", shape: "notch", callsign: "Servo" },
];
const FOCUS = [["Drones"], ["Robotics"], ["Edge AI"], ["Robotic arms"], ["Drones", "Edge AI"]];
const COMPS = [["NIDAR 2026", "NIDAR 2.0", "MATLAB Mini Drone"], ["e-Yantra 2026", "e-Yantra 2025"], ["NIDAR 2026", "ISRO Drone Challenge"], ["e-Yantra 2024", "Pravega IX"]];

export const MEMBERS: Member[] = define(
  LOOKS.map((look, i) => {
    const focus = FOCUS[i % FOCUS.length], s = SAMPLE[focus[0]];
    return {
      ...look, ...s, focus,
      name: `Member ${String(i + 1).padStart(2, "0")}`,
      role: "Role · e.g. Flight software",
      photo: "",
      joined: "2024",
      quote: "A line this member lives by. Keep it short.",
      competitions: COMPS[i % COMPS.length],
      placeholder: true,
    };
  })
);

export const memberBySlug = (slug: string) => MEMBERS.find((m) => m.slug === slug);
'@

W 'data/site.ts' @'
// Facts shown on the site. Only things the team has stated; edit freely.
export const DOMAINS = [
  { k: "01", name: "Drones", line: "GPS-denied flight, autonomous hover and no-RC control over telemetry.", icon: "drone" },
  { k: "02", name: "Robotics", line: "Mobile robots, sensor fusion and navigation stacks built from the ground up.", icon: "robot" },
  { k: "03", name: "Edge AI", line: "Vision models that run on the robot itself, on Raspberry Pi and Jetson-class boards.", icon: "chip" },
  { k: "04", name: "Robotic arms", line: "Manipulators, kinematics and motion control for pick, place and inspect.", icon: "arm" },
] as const;

export const COMPETITIONS = [
  { name: "NIDAR 2026", org: "National Innovation Challenge for Drone Application and Research", result: "Top 80 of 358 teams · 38th overall" },
  { name: "NIDAR 2.0", org: "Drone application and research challenge", result: "Competed" },
  { name: "e-Yantra 2026", org: "Robotics competition", result: "Competed" },
  { name: "e-Yantra 2025", org: "Robotics competition", result: "Competed" },
  { name: "e-Yantra 2024", org: "Robotics competition", result: "Competed" },
  { name: "MATLAB Mini Drone", org: "MathWorks mini-drone competition", result: "Competed" },
  { name: "ISRO Drone Challenge", org: "Indian Space Research Organisation", result: "Competed" },
  { name: "Pravega IX", org: "IISc Bengaluru science and technology fest", result: "Competed" },
];

export const PROCESS = [
  { k: "01", name: "Design", line: "Frames in CAD, wiring diagrams on paper, and a simulation before anything is cut.", tags: ["CAD", "Simulation", "Wiring"] },
  { k: "02", name: "Build", line: "We cut, print, solder and flash it ourselves, then label every wire.", tags: ["Fabrication", "Soldering", "Firmware"] },
  { k: "03", name: "Calibrate & test", line: "Sensors calibrated, loops tuned, failsafes proven on the bench before the first flight.", tags: ["PID tuning", "Failsafes", "Test flights"] },
  { k: "04", name: "Compete", line: "Design reviews, reports, pitches and the arena itself, at national challenges.", tags: ["NIDAR", "e-Yantra", "ISRO"] },
];

export const STACK = [
  { name: "ArduPilot 4.7", cat: "Flight", note: "Flight firmware on AirMouse" },
  { name: "Kakute H7", cat: "Flight", note: "Flight controller" },
  { name: "EKF3", cat: "Flight", note: "Fuses optical flow, lidar and compass" },
  { name: "Optical flow", cat: "Flight", note: "Holds position without GPS" },
  { name: "LiDAR rangefinder", cat: "Flight", note: "Holds hover height" },
  { name: "433 MHz telemetry", cat: "Flight", note: "No-RC control link" },
  { name: "Raspberry Pi 5", cat: "Compute", note: "Ground station and navigation stack" },
  { name: "Jetson-class boards", cat: "Compute", note: "Vision on the robot itself" },
  { name: "YOLO", cat: "Vision", note: "Object detection at the edge" },
  { name: "Global-shutter camera", cat: "Vision", note: "Next stage of the nav stack" },
  { name: "2D LiDAR", cat: "Mapping", note: "SLAM and room mapping" },
  { name: "MATLAB", cat: "Tools", note: "Mini Drone Competition" },
  { name: "Web dashboard", cat: "Tools", note: "Flies AirMouse from a browser" },
];

export const ROADMAP = [
  { st: "now", label: "Now", title: "A 7-inch carbon-fibre drone", line: "Taking our NIDAR entry from simulation to a physical airframe." },
  { st: "now", label: "Now", title: "LiDAR navigation stack", line: "2D LiDAR SLAM and mapping on a Raspberry Pi 5." },
  { st: "next", label: "Next", title: "Camera in the loop", line: "Adding a global-shutter camera to the navigation stack." },
  { st: "next", label: "Ongoing", title: "Industry partners", line: "Fabrication, sensors, compute and test space, built together." },
];
'@

W 'app/layout.tsx' @'
import "./globals.css";
import "./extra.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Team KaalKrit",
  description: "Team KaalKrit: student engineers building drones, robots, robotic arms and edge AI, and taking them to national competitions.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#08070b" }, { media: "(prefers-color-scheme: light)", color: "#f2efe9" }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apply a saved theme before first paint, so there is no flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("kk-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" />
      </head>
      <body>
        {/* rough print edges for the big poster type */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
'@

W 'app/page.tsx' @'
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import DroneFigure from "@/components/DroneFigure";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import Tilt from "@/components/Tilt";
import CopyEmail from "@/components/CopyEmail";
import Mini3D from "@/components/Mini3D";
import Buddy from "@/components/Buddy";
import Link from "next/link";
import FX from "@/components/FX";
import Footer from "@/components/Footer";
import Process from "@/components/Process";
import Stack from "@/components/Stack";
import { DOMAINS, COMPETITIONS, ROADMAP } from "@/data/site";
import { MEMBERS } from "@/data/members";

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function Page() {
  return (
    <>
      <FX />
      <Nav />
      <Buddy />
      <main>
        <Hero />
        <Marquee items={["Drones", "Robotics", "Edge AI", "Robotic arms", "MATLAB", "e-Yantra", "NIDAR", "ISRO"]} />

        <Reveal as="section" className="sec" id="domains">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>01 · <b>What we do</b></span>
              <div data-reveal><h2 data-wipe>Four fields, <em>one bench</em></h2>
                <p>Most of our machines cross all four: a drone that runs vision on board, a robot arm that a model guides, a rover that maps a room. We build the hardware and the software ourselves.</p></div>
            </div>
            <div className="domains">
              {DOMAINS.map((d) => (
                <Tilt className="domain glow" key={d.k}>
                  <div data-reveal className="dinner">
                    <span className="label">{d.k}</span>
                    <Mini3D kind={d.icon} label={`A small 3D ${d.name.toLowerCase()} model, turning slowly`} />
                    <h3>{d.name}</h3>
                    <p>{d.line}</p>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="work">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>02 · <b>Featured work</b></span>
              <div data-reveal><h2 data-wipe>AirMouse: hover <em>without GPS</em></h2>
                <p>Our NIDAR 2026–27 entry for Problem Statement 2. An indoor search-and-rescue quadcopter that holds its place with optical flow and a lidar, and flies from a web dashboard over a 433 MHz link with no RC transmitter at all. Move over the drawing to set its hover height.</p></div>
            </div>
            <div className="fig-wrap" data-reveal><DroneFigure /></div>
            <div className="work-facts">
              <div data-reveal><b>Kakute H7</b><span>ArduPilot 4.7, EKF3 fusing flow, lidar and compass</span></div>
              <div data-reveal><b>0 RC</b><span>Raspberry Pi 5 ground station and a browser dashboard</span></div>
              <div data-reveal><b>3 failsafes</b><span>Confirmed commands, hold-then-land on WiFi loss, land on radio loss</span></div>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="process">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>03 · <b>How we build</b></span>
              <div data-reveal><h2 data-wipe>Bench to <em>arena</em></h2>
                <p>Every machine goes through the same four stages. Scroll and follow one from the first sketch to the competition floor.</p></div>
            </div>
            <Process />
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="stack">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>04 · <b>Toolkit</b></span>
              <div data-reveal><h2 data-wipe>What we <em>fly with</em></h2>
                <p>The flight stack, compute, vision and mapping parts our machines run on today. Filter by category.</p></div>
            </div>
            <Stack />
          </div>
        </Reveal>

        <Marquee tone="ind" reverse items={["Top 80 of 358", "38th overall", "Business pitch 11th", "Design review 54th", "NIDAR 2026"]} />

        <Reveal as="section" className="sec" id="competitions">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>05 · <b>Competitions</b></span>
              <div data-reveal><h2 data-wipe>Where we’ve <em>competed</em></h2>
                <p>National drone and robotics challenges, entered as one team. Our best placing so far is NIDAR 2026.</p></div>
            </div>
            <div className="board" data-reveal>
              <div><span className="label">Teams at NIDAR 2026</span><b><Counter to={358} /></b></div>
              <div><span className="label">Finalists, us among them</span><b>Top <Counter to={80} /></b></div>
              <div className="hl"><span className="label">Overall rank</span><b>#<Counter to={38} /></b></div>
              <div><span className="label">Business pitch</span><b>#<Counter to={11} /></b></div>
              <div><span className="label">Design review</span><b>#<Counter to={54} /></b></div>
            </div>
            <ol className="comps">
              {COMPETITIONS.map((c, i) => (
                <li key={c.name} data-reveal className={i === 0 ? "top" : ""}>
                  <span className="ci">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cn">{c.name}</span>
                  <span className="co">{c.org}</span>
                  <span className="cr">{c.result}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="roadmap">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>06 · <b>What’s next</b></span>
              <div data-reveal><h2 data-wipe>On the <em>bench now</em></h2></div>
            </div>
            <ol className="steps">
              {ROADMAP.map((r) => (
                <li key={r.title} className={r.st} data-reveal><span className="st">{r.label}</span><div><h3>{r.title}</h3><p>{r.line}</p></div></li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="team">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>07 · <b>The team</b></span>
              <div data-reveal><h2 data-wipe>Ten <em>engineers</em></h2>
                <p>Flight software, embedded systems, mechanical design, vision and AI. Everyone solders, everyone codes. Open anyone’s profile to see what they build.</p></div>
            </div>
            <div className="people">
              {MEMBERS.map((m, i) => (
                <Tilt className={"person" + (m.placeholder ? " ph" : "")} key={m.slug} max={5}>
                  <Link href={`/team/${m.slug}`} className="pinner glow" data-reveal style={{ "--acc": m.accent } as React.CSSProperties} aria-label={`${m.name}, ${m.role}. Open profile`}>
                    <div className="portrait">
                      {m.photo ? <img src={m.photo} alt="" /> : <span className="ini">{m.placeholder ? String(i + 1).padStart(2, "0") : initials(m.name)}</span>}
                      <span className="dots" aria-hidden="true" />
                      <span className="cs">{m.callsign}</span>
                    </div>
                    <b>{m.name}</b>
                    <span className="role">{m.role}</span>
                    <span className="tags">{m.focus.map((f) => <i key={f}>{f}</i>)}</span>
                    <span className="more">View profile <em>→</em></span>
                  </Link>
                </Tilt>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="sec partner" id="partner">
          <div className="wrap">
            <span className="label" data-reveal>08 · <b>Partner with us</b></span>
            <h2 className="big-cta" data-reveal data-wipe>Build the next one <em>with us</em></h2>
            <p className="pp" data-reveal>We’re looking for industry partners: carbon-fibre fabrication, sensors and compute, test space and mentorship. Tell us what you’d like to build together.</p>
            <div data-reveal><CopyEmail email="teamkaalkrit@gmail.com" /></div>
            <p className="label" data-reveal style={{ marginTop: 18 }}>Instagram · @teamkaalkrit</p>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
'@

W 'app/extra.css' @'
/* Additions: scroll progress, spotlight cards, process track, toolkit, team-card links, member profiles. */

/* ---------- global fx ---------- */
.progress { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70; background: linear-gradient(90deg, var(--red), var(--acc, var(--indigo))); transform: scaleX(0); transform-origin: left; pointer-events: none; }
.glow { position: relative; isolation: isolate; }
.glow::after { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: 0; transition: opacity .35s;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--acc, var(--indigo)) 22%, transparent), transparent 70%); }
.glow:hover::after { opacity: 1; }

/* ---------- process ---------- */
.process { position: relative; --p: 0; }
.process ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; position: relative; }
.ptrack { position: absolute; left: 22px; right: 22px; top: 22px; height: 2px; background: var(--line); }
.ptrack i { position: absolute; inset: 0; background: linear-gradient(90deg, var(--red), var(--indigo)); transform: scaleX(var(--p)); transform-origin: left; }
.pstep { min-width: 0; }
.pdot { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--ghost); background: var(--ink); font: 500 12px/1 var(--mono); color: var(--mut); position: relative; z-index: 1; transition: background .4s, color .4s, border-color .4s, transform .5s cubic-bezier(.2,.7,0,1), box-shadow .4s; }
.pstep h3 { font: 400 clamp(28px, 3vw, 38px)/1 var(--display); text-transform: uppercase; margin: 22px 0 10px; color: var(--mut); transition: color .4s; }
.pstep p { margin: 0 0 12px; color: var(--mut); font-size: 15.5px; }
.pstep.lit .pdot { background: var(--red); border-color: var(--red); color: var(--ink); transform: scale(1.12); box-shadow: 0 0 0 6px rgb(243 46 53 / .16); }
.pstep.lit h3 { color: var(--bone); }
@media (max-width: 860px) {
  .process ol { grid-template-columns: 1fr; gap: 34px; padding-left: 70px; }
  .ptrack { left: 22px; right: auto; top: 0; bottom: 0; width: 2px; height: auto; }
  .ptrack i { transform: scaleY(var(--p)); transform-origin: top; }
  .pdot { position: absolute; left: 0; }
  .pstep { position: relative; }
  .pstep h3 { margin-top: 8px; }
}
.process .pstep { position: relative; }
@media (max-width: 860px) { .process .pstep .pdot { left: -70px; top: 0; } }

/* ---------- toolkit ---------- */
.tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
.tabs button { font: 500 12px/1 var(--mono); letter-spacing: .1em; text-transform: uppercase; padding: 10px 14px; border-radius: 999px; border: 1px solid var(--ghost); background: transparent; color: var(--mut); cursor: pointer; transition: all .25s; }
.tabs button sup { margin-left: 6px; font-size: 9px; opacity: .7; }
.tabs button:hover { color: var(--bone); border-color: var(--indigo-ink); }
.tabs button[aria-pressed="true"] { background: var(--bone); color: var(--ink); border-color: var(--bone); }
.chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 900px) { .chips { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .chips { grid-template-columns: 1fr; } }
.chip { border: 1px solid var(--line); background: var(--card); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 6px; min-width: 0; overflow: hidden; transition: border-color .3s, transform .3s; }
.chip:hover { border-color: var(--indigo); transform: translateY(-3px); }
.chip b { font: 400 26px/1.05 var(--display); text-transform: uppercase; }
.chip > span:last-child { color: var(--mut); font-size: 14.5px; }

/* ---------- team cards as links ---------- */
.person a.pinner { text-decoration: none; color: inherit; height: 100%; }
.pinner:hover .portrait, .person:hover .portrait { background: var(--acc, var(--red)); }
.portrait .cs { position: absolute; left: 8px; bottom: 8px; z-index: 2; font: 500 10px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; background: var(--ink); color: var(--bone); padding: 5px 7px; border-radius: 999px; transform: translateY(140%); transition: transform .45s cubic-bezier(.2,.7,0,1); }
.person:hover .portrait .cs, .pinner:focus-visible .portrait .cs { transform: none; }
.person .more { margin-top: auto; padding-top: 10px; font: 500 11px/1 var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--mut); transition: color .25s; }
.person .more em { font-style: normal; display: inline-block; transition: transform .35s cubic-bezier(.2,.7,0,1); }
.person:hover .more { color: var(--acc, var(--red)); }
.person:hover .more em { transform: translateX(6px); }

/* ================= member profile ================= */
.member { --acc-ink: color-mix(in srgb, var(--acc) 78%, var(--bone)); }
.member .label b, .member .sec-head h2 em, .member .big-cta em { color: var(--acc-ink); }
.member .wipe { background: var(--acc); }
.member ::selection { background: var(--acc); }

.m-hero { position: relative; min-height: max(720px, 100svh); padding-block: 110px 64px; overflow: hidden; isolation: isolate; display: flex; align-items: center; }
.m-art { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; }
.m-hero::after { content: ""; position: absolute; inset: auto 0 0; height: 160px; background: linear-gradient(transparent, var(--ink)); z-index: -1; pointer-events: none; }
.m-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 48px; align-items: center; width: 100%; }
@media (max-width: 900px) { .m-grid { grid-template-columns: 1fr; gap: 36px; } .m-portrait { order: -1; } }
.m-copy { min-width: 0; }
.m-back { display: inline-block; text-decoration: none; margin-bottom: 18px; transition: color .2s; }
.m-back:hover { color: var(--bone); }
.m-sample { margin-left: 10px; padding: 3px 8px; border: 1px dashed var(--ghost); border-radius: 999px; font-size: 10px; }
.m-name { font: 400 clamp(64px, 11vw, 168px)/.86 var(--display); text-transform: uppercase; margin: 16px 0 14px; color: var(--bone); }
.m-name .w { display: inline-block; white-space: nowrap; margin-right: .18em; }
.m-name .w:last-child { color: var(--acc); }
.m-name .ch { display: inline-block; will-change: transform; }
.m-role { font-size: 20px; margin: 0 0 16px; color: var(--bone); }
.m-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.m-tags i { font: 500 11px/1 var(--mono); letter-spacing: .08em; text-transform: uppercase; font-style: normal; border: 1px solid color-mix(in srgb, var(--acc) 55%, var(--line)); color: var(--acc-ink); padding: 6px 9px; border-radius: 999px; background: color-mix(in srgb, var(--ink) 70%, transparent); }
.m-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); margin-top: 32px; max-width: 560px; border-radius: 14px; overflow: hidden; }
.m-stats div { background: color-mix(in srgb, var(--ink) 82%, transparent); backdrop-filter: blur(6px); padding: 14px 16px; min-width: 0; }
.m-stats b { display: block; font: 400 clamp(28px, 3.4vw, 42px)/1 var(--display); font-variant-numeric: tabular-nums; }
.m-stats div > span { font: 500 11px/1.4 var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--mut); }
@media (max-width: 480px) { .m-stats { grid-template-columns: 1fr 1fr; } }

.m-portrait { position: relative; width: min(400px, 74vw); aspect-ratio: 1; justify-self: center; perspective: 900px; }
.m-frame { position: absolute; inset: 0; transform: translate3d(var(--tx, 0), var(--ty, 0), 0) rotateX(var(--rx, 0)) rotateY(var(--ry, 0)); transition: transform .6s cubic-bezier(.2,.7,0,1); transform-style: preserve-3d; }
.m-ring, .m-ticks { position: absolute; inset: -16%; width: 132%; height: 132%; pointer-events: none; overflow: visible; }
.m-ring { animation: spin 38s linear infinite; }
.m-ring text { font: 500 8.4px var(--mono); letter-spacing: .1em; fill: var(--bone); opacity: .8; }
.m-ticks { inset: -4%; width: 108%; height: 108%; animation: spin 60s linear infinite reverse; }
.m-ticks circle { fill: none; stroke: var(--acc); stroke-width: 1.2; stroke-dasharray: 1.2 6; opacity: .9; }
@keyframes spin { to { transform: rotate(360deg); } }
.m-shape { position: absolute; inset: 0; overflow: hidden; background: var(--acc); box-shadow: 0 30px 80px -20px color-mix(in srgb, var(--acc) 55%, transparent); transform: translateZ(30px); }
.m-shape img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(1) contrast(1.15); mix-blend-mode: luminosity; transition: transform 1.2s cubic-bezier(.2,.7,0,1); }
.m-portrait:hover .m-shape img { transform: scale(1.06); }
.m-shape .ini { position: absolute; inset: 0; display: grid; place-items: center; font: 400 clamp(96px, 18vw, 180px)/1 var(--display); color: var(--ink); z-index: 1; }
.m-shape .dots { position: absolute; inset: 0; background-image: radial-gradient(circle, var(--ink) 34%, transparent 36%); background-size: 8px 8px; opacity: .5; mix-blend-mode: multiply; transition: background-size .6s cubic-bezier(.2,.7,0,1), opacity .6s; }
.m-portrait:hover .m-shape .dots { background-size: 4px 4px; opacity: .22; }
.m-badge { position: absolute; right: 2%; bottom: 6%; transform: translateZ(60px); font: 500 11px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; background: var(--ink); color: var(--acc-ink); border: 1px solid var(--acc); padding: 8px 11px; border-radius: 999px; }

.shape-hex { clip-path: polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%); }
.shape-circle { border-radius: 50%; }
.shape-notch { clip-path: polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%); }
.shape-diamond { clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); }
.shape-slant { clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%); }
.shape-oct { clip-path: polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%); }
.shape-blob { border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; animation: morph 12s ease-in-out infinite alternate; }
@keyframes morph {
  33% { border-radius: 63% 37% 41% 59% / 55% 38% 62% 45%; }
  66% { border-radius: 38% 62% 54% 46% / 36% 61% 39% 64%; }
  100% { border-radius: 55% 45% 35% 65% / 60% 52% 48% 40%; }
}

.m-bio { font-size: 20px !important; color: var(--bone) !important; line-height: 1.55; }
.m-facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); margin: 0; }
@media (max-width: 860px) { .m-facts { grid-template-columns: 1fr 1fr; } }
.m-facts div { background: var(--ink); padding: 18px 20px; min-width: 0; }
.m-facts dt { font: 500 11px/1.4 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--mut); margin-bottom: 8px; }
.m-facts dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }

.meters { display: grid; grid-template-columns: 1fr 1fr; gap: 26px 56px; }
@media (max-width: 760px) { .meters { grid-template-columns: 1fr; } }
.meter { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: baseline; }
.meter span { font-weight: 600; }
.meter b { font: 400 34px/1 var(--display); color: var(--acc-ink); font-variant-numeric: tabular-nums; }
.meter i { grid-column: 1 / -1; height: 6px; border-radius: 999px; background: var(--line); overflow: hidden; }
.meter em { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, color-mix(in srgb, var(--acc) 50%, var(--ink)), var(--acc)); transform: scaleX(0); transform-origin: left; transition: transform 1.3s cubic-bezier(.2,.7,0,1) var(--d, 0ms); }
.in .meter em { transform: scaleX(var(--v)); }

.m-projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; perspective: 900px; }
.m-proj { border: 1px solid var(--line); background: var(--card); border-radius: 18px; overflow: hidden; transition: border-color .3s; min-width: 0; }
.m-proj:hover { border-color: var(--acc); }
.m-proj > div { padding: 26px; display: flex; flex-direction: column; gap: 10px; height: 100%; }
.m-proj h3 { font: 400 clamp(30px, 3.4vw, 42px)/1 var(--display); text-transform: uppercase; }
.m-proj p { margin: 0; color: var(--mut); }

.m-time { list-style: none; margin: 0; padding: 0 0 0 34px; position: relative; }
.m-time::before { content: ""; position: absolute; left: 7px; top: 6px; bottom: 6px; width: 2px; background: linear-gradient(var(--acc), var(--indigo)); transform: scaleY(0); transform-origin: top; transition: transform 1.4s cubic-bezier(.2,.7,0,1); }
.in .m-time::before { transform: scaleY(1); }
.m-time li { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr) auto; gap: 18px; align-items: baseline; padding: 18px 0; border-top: 1px solid var(--line); }
.m-time li::before { content: ""; position: absolute; left: -33px; top: 26px; width: 14px; height: 14px; border-radius: 50%; background: var(--ink); border: 2px solid var(--acc); }
.m-time b { font: 400 clamp(26px, 3vw, 36px)/1 var(--display); text-transform: uppercase; }
.m-time span { color: var(--mut); font-size: 15px; }
.m-time em { font: 500 12px/1.5 var(--mono); font-style: normal; letter-spacing: .08em; text-transform: uppercase; color: var(--acc-ink); }
@media (max-width: 760px) { .m-time li { grid-template-columns: 1fr; gap: 4px; } }

.m-tools { display: flex; flex-wrap: wrap; gap: 10px; }
.m-tools span { font: 400 clamp(22px, 2.6vw, 30px)/1 var(--display); text-transform: uppercase; padding: 14px 20px; border: 1px solid var(--line); border-radius: 999px; background: var(--card); transition: background .3s, color .3s, border-color .3s, transform .3s; }
.m-tools span:hover { background: var(--acc); color: var(--ink); border-color: var(--acc); transform: translateY(-3px) rotate(-1.5deg); }

.m-quote-sec { padding-block: 80px 40px !important; }
.m-quote { margin: 0; font: 400 clamp(40px, 7vw, 104px)/.95 var(--display); text-transform: uppercase; color: var(--bone); max-width: 18ch; }
.m-quote::first-letter { color: var(--acc); }

.m-links { display: flex; gap: 12px; flex-wrap: wrap; margin: 20px 0 56px; }
.member .btn.solid { background: var(--acc); border-color: var(--acc); }
.m-pn { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); border: 1px solid var(--line); }
.m-pn a { position: relative; isolation: isolate; overflow: hidden; background: var(--ink); padding: 28px 24px; text-decoration: none; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.m-pn a:last-child { text-align: right; }
.m-pn a::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--acc); transform: scaleY(0); transform-origin: bottom; transition: transform .55s cubic-bezier(.2,.7,0,1); }
.m-pn a:hover::before { transform: scaleY(1); }
.m-pn a:hover, .m-pn a:hover .label { color: var(--ink); }
.m-pn b { font: 400 clamp(30px, 4.4vw, 60px)/1 var(--display); text-transform: uppercase; overflow-wrap: anywhere; }

@media (prefers-reduced-motion: reduce) {
  .m-ring, .m-ticks, .shape-blob { animation: none; }
  .meter em, .m-time::before, .m-frame { transition: none; }
}
'@

W 'app/team/[slug]/page.tsx' @'
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FX from "@/components/FX";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Tilt from "@/components/Tilt";
import Counter from "@/components/Counter";
import Marquee from "@/components/Marquee";
import MemberHero from "@/components/member/MemberHero";
import { MEMBERS, memberBySlug } from "@/data/members";
import { COMPETITIONS } from "@/data/site";

export const dynamicParams = false;
export function generateStaticParams() { return MEMBERS.map((m) => ({ slug: m.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = memberBySlug(params.slug);
  return m ? { title: `${m.name} · Team KaalKrit`, description: `${m.name}, ${m.role}. ${m.bio}`.slice(0, 160) } : {};
}

export default function MemberPage({ params }: { params: { slug: string } }) {
  const m = memberBySlug(params.slug);
  if (!m) notFound();
  const i = MEMBERS.indexOf(m), prev = MEMBERS[(i - 1 + MEMBERS.length) % MEMBERS.length], next = MEMBERS[(i + 1) % MEMBERS.length];
  const first = m.name.split(" ")[0];
  const comps = m.competitions.map((n) => COMPETITIONS.find((c) => c.name === n) || { name: n, org: "", result: "" });
  const vars = { "--acc": m.accent } as React.CSSProperties;

  return (
    <div className="member" style={vars}>
      <FX />
      <Nav />
      <main>
        <MemberHero m={m} index={i} total={MEMBERS.length} />
        <Marquee tone="ind" items={[m.callsign, ...m.focus, ...m.tools.slice(0, 4)]} />

        <Reveal as="section" className="sec" id="about">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>01 · <b>About</b></span>
              <div data-reveal><h2 data-wipe>Hi, I’m <em>{first}</em></h2><p className="m-bio">{m.bio}</p></div>
            </div>
            <dl className="m-facts" data-reveal>
              <div><dt>Role</dt><dd>{m.role}</dd></div>
              <div><dt>Callsign</dt><dd>{m.callsign}</dd></div>
              <div><dt>Focus</dt><dd>{m.focus.join(" · ")}</dd></div>
              <div><dt>On the team since</dt><dd>{m.joined}</dd></div>
            </dl>
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="skills">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>02 · <b>Skills</b></span>
              <div data-reveal><h2 data-wipe>What I <em>bring</em></h2></div>
            </div>
            <div className="meters">
              {m.skills.map((s, k) => (
                <div className="meter" key={s.name} data-reveal style={{ "--v": s.level / 100, "--d": `${k * 110}ms` } as React.CSSProperties}>
                  <span>{s.name}</span><b><Counter to={s.level} /></b><i><em /></i>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="projects">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>03 · <b>Projects</b></span>
              <div data-reveal><h2 data-wipe>Things I’ve <em>built</em></h2></div>
            </div>
            <div className="m-projects">
              {m.projects.map((p, k) => (
                <Tilt className="m-proj" key={k} max={6}>
                  <div className="glow" data-reveal>
                    <span className="label">{String(k + 1).padStart(2, "0")}</span>
                    <h3>{p.title}</h3><p>{p.line}</p>
                    <span className="m-tags">{p.tags.map((t) => <i key={t}>{t}</i>)}</span>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="competitions">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>04 · <b>Competitions</b></span>
              <div data-reveal><h2 data-wipe>Where I’ve <em>competed</em></h2></div>
            </div>
            <ol className="m-time">
              {comps.map((c) => (
                <li key={c.name} data-reveal><b>{c.name}</b><span>{c.org}</span><em>{c.result}</em></li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal as="section" className="sec" id="toolkit">
          <div className="wrap">
            <div className="sec-head">
              <span className="label" data-reveal>05 · <b>Toolkit</b></span>
              <div data-reveal><h2 data-wipe>On my <em>bench</em></h2></div>
            </div>
            <div className="m-tools">{m.tools.map((t) => <span key={t} data-reveal>{t}</span>)}</div>
          </div>
        </Reveal>

        <Reveal as="section" className="sec m-quote-sec">
          <div className="wrap"><blockquote className="m-quote" data-reveal data-wipe>“{m.quote}”</blockquote></div>
        </Reveal>

        <Reveal as="section" className="sec" id="connect">
          <div className="wrap">
            <span className="label" data-reveal>06 · <b>Connect</b></span>
            <div className="m-links" data-reveal>
              {m.linkedin && <a className="btn solid" href={m.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
              {m.github && <a className="btn ghost" href={m.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
              {m.email && <a className="btn ghost" href={`mailto:${m.email}`}>Email</a>}
              {!m.linkedin && !m.github && !m.email && <span className="label">Links coming soon</span>}
            </div>
            <nav className="m-pn" aria-label="Other members" data-reveal>
              <Link href={`/team/${prev.slug}`} style={{ "--acc": prev.accent } as React.CSSProperties}><span className="label">← Previous</span><b>{prev.name}</b></Link>
              <Link href={`/team/${next.slug}`} style={{ "--acc": next.accent } as React.CSSProperties}><span className="label">Next →</span><b>{next.name}</b></Link>
            </nav>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
'@

W 'components/FX.tsx' @'
"use client";
import { useEffect, useRef } from "react";

/** Page-wide effects: a scroll progress bar, and a soft spotlight that follows the pointer on any .glow card. */
export default function FX() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const scroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const d = document.documentElement, p = d.scrollTop / Math.max(1, d.scrollHeight - window.innerHeight);
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      });
    };
    const glow = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.(".glow") as HTMLElement | null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`); t.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointermove", glow, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", scroll); window.removeEventListener("pointermove", glow); };
  }, []);
  return <div className="progress" ref={bar} aria-hidden="true" />;
}
'@

W 'components/Footer.tsx' @'
import Marquee from "./Marquee";

export default function Footer() {
  return (
    <footer className="foot">
      <Marquee items={["Robotics", "Edge AI", "Drones", "Robotic arms", "Team KaalKrit"]} />
      <div className="wrap">
        <p className="wordmark" aria-hidden="true">KaalKrit</p>
        <div className="row label"><span>© Team KaalKrit · teamkaalkrit@gmail.com · @teamkaalkrit</span><span>Figure: Anatomy kit · Motion: anime.js · both MIT</span></div>
      </div>
    </footer>
  );
}
'@

W 'components/Process.tsx' @'
"use client";
import { useEffect, useRef } from "react";
import { PROCESS } from "@/data/site";

/** Four build stages on a track that fills as you scroll through it; each stage lights when the fill reaches it. */
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!, steps = [...el.querySelectorAll<HTMLElement>(".pstep")];
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect(), vh = window.innerHeight;
        const p = Math.max(0, Math.min(1, (vh * 0.8 - r.top) / (r.height + vh * 0.25)));
        el.style.setProperty("--p", p.toFixed(3));
        steps.forEach((s, i) => s.classList.toggle("lit", p >= (i / (steps.length - 1)) * 0.92 + 0.02));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return (
    <div className="process" ref={ref}>
      <div className="ptrack" aria-hidden="true"><i /></div>
      <ol>
        {PROCESS.map((s) => (
          <li className="pstep" key={s.k}>
            <span className="pdot">{s.k}</span>
            <h3>{s.name}</h3>
            <p>{s.line}</p>
            <span className="label">{s.tags.join(" · ")}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
'@

W 'components/Stack.tsx' @'
"use client";
import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { STACK } from "@/data/site";

const CATS = ["All", ...Array.from(new Set(STACK.map((s) => s.cat)))];

/** The hardware and software we fly with, filterable by category; cards shuffle in on each filter. */
export default function Stack() {
  const [cat, setCat] = useState("All");
  const grid = useRef<HTMLDivElement>(null), first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    anime({ targets: grid.current!.querySelectorAll(".chip"), translateY: [14, 0], scale: [0.94, 1], opacity: [0, 1], delay: anime.stagger(40), duration: 650, easing: "easeOutExpo" });
  }, [cat]);
  const list = cat === "All" ? STACK : STACK.filter((s) => s.cat === cat);
  return (
    <>
      <div className="tabs" role="group" aria-label="Filter the toolkit" data-reveal>
        {CATS.map((c) => (
          <button type="button" key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>
            {c}<sup>{c === "All" ? STACK.length : STACK.filter((s) => s.cat === c).length}</sup>
          </button>
        ))}
      </div>
      <div className="chips" ref={grid}>
        {list.map((s) => (
          <div className="chip glow" key={s.name} data-reveal>
            <span className="label">{s.cat}</span><b>{s.name}</b><span>{s.note}</span>
          </div>
        ))}
      </div>
    </>
  );
}
'@

W 'components/Nav.tsx' @'
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
'@

W 'components/Reveal.tsx' @'
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
'@

W 'components/member/Signature.tsx' @'
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
'@

W 'components/member/MemberHero.tsx' @'
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
'@

Write-Host "`nDone. Now run: npm run dev  ->  open http://localhost:3000/team/member-01" -ForegroundColor Cyan
