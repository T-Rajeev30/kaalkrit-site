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