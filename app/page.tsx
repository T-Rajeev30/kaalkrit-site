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