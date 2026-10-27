export default function Marquee({ items, tone = "red", reverse = false }: { items: string[]; tone?: "red" | "ind"; reverse?: boolean }) {
  const run = [...items, ...items, ...items];
  return (
    <div className={`marquee${tone === "ind" ? " ind" : ""}${reverse ? " rev" : ""}`} aria-hidden="true">
      <div className="track">
        {[0, 1].map((half) => (
          <span key={half}>{run.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}</span>
        ))}
      </div>
    </div>
  );
}
