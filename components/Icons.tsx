// Line drawings for the four domains; every stroke is drawn in when the card scrolls into view.
const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export function DomainIcon({ kind }: { kind: string }) {
  const paths: Record<string, string[]> = {
    drone: ["M30 40h40", "M50 40v10", "M40 50h20v8H40z", "M18 33a12 4 0 1 0 24 0a12 4 0 1 0-24 0", "M58 33a12 4 0 1 0 24 0a12 4 0 1 0-24 0", "M30 33v7", "M70 33v7", "M44 58l-6 10", "M56 58l6 10", "M50 58v14"],
    robot: ["M34 30h32v26H34z", "M42 40a3 3 0 1 0 0.1 0", "M58 40a3 3 0 1 0 0.1 0", "M44 50h12", "M50 22v8", "M50 18a3 3 0 1 0 0.1 0", "M30 60h40v12H30z", "M36 72a5 5 0 1 0 0.1 0", "M64 72a5 5 0 1 0 0.1 0", "M26 40h8", "M66 40h8"],
    chip: ["M32 30h36v36H32z", "M40 38h20v20H40z", "M38 22v8", "M50 22v8", "M62 22v8", "M38 66v8", "M50 66v8", "M62 66v8", "M24 38h8", "M24 50h8", "M24 58h8", "M68 38h8", "M68 50h8", "M68 58h8"],
    arm: ["M26 74h30", "M32 74v-6h18v6", "M41 68l8-22", "M49 46a4 4 0 1 0 0.1 0", "M53 44l18-10", "M71 34a4 4 0 1 0 0.1 0", "M74 31l6-4", "M74 37l7 1", "M41 68a4 4 0 1 0 0.1 0"],
  };
  return (
    <svg viewBox="0 0 100 90" className="dicon" aria-hidden="true">
      {(paths[kind] || []).map((d, i) => <path key={i} d={d} {...common} data-draw />)}
    </svg>
  );
}
