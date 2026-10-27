// AirMouse on its tethered test stand: isometric figure built with the anatomy kit.
// World units are centimetres: x forward (drone nose), y left, z up. The drone body origin is the
// underside of its bottom plate, at the centre.
import * as k from "./iso/iso-kit.mjs";

export const WIDTH = 600, HEIGHT = 470;

// ---- the stand -------------------------------------------------------------------------------
const PLATE = { x: -64, y: -56, w: 128, d: 112, r: 8 };
const PLATE_H = 6, FOOT_H = 4;
const MAT = { x: -40, y: -40, w: 82, d: 78, r: 3 };             // textured flow mat
const MAST = { x: -56, y: 30, w: 7, d: 7, r: 1.3 };                // height gauge column
const MAST_TOP = 92;
const STRIP = { x: -40, y: PLATE.y + PLATE.d - 11, w: 92, d: 6, r: 1 };
const LABEL = { x: 44, y: -48, w: 13, d: 20, r: 1.5 };
const ANCHOR = [0, 0];

// ---- the drone -------------------------------------------------------------------------------
export const LEG = 12;                                              // landed: body underside at z = 12
export const LIDAR_DROP = 3;                                        // lidar lens 3 cm under the body
const PLATE_D = { x: -9, y: -9, w: 18, d: 18, r: 3 };
const ARM_Z = 0.6, ARM_H = 2.6, TOP_Z = ARM_Z + ARM_H;              // arms sandwiched between plates
const MOTOR_R = 22.6;                                               // centre to motor: 45 cm wheelbase
export const MOTORS = [                                             // name, angle (deg, ccw from +x), spin
  ["A", -45, "ccw"], ["B", -135, "cw"], ["C", 135, "ccw"], ["D", 45, "cw"],
];
export const PROP_R = 12.7;                                         // 10 inch props
const MOTOR_TOP = TOP_Z + 3.4;
export const PROP_Z = MOTOR_TOP + 0.9;
export const LIDAR = [10.5, -10.5];                                  // under the front-right arm

const rad = (d) => (d * Math.PI) / 180;
export const motorAt = (deg) => [Math.cos(rad(deg)) * MOTOR_R, Math.sin(rad(deg)) * MOTOR_R];

export function fit() {
  return k.fitProjection(
    [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [MAST.x, MAST.y, MAST_TOP + 3], [0, 0, 80 + LIDAR_DROP + 18],
      ...MOTORS.map(([, d]) => { const [x, y] = motorAt(d); return [x + Math.sign(x) * PROP_R * 0.7, y + Math.sign(y) * PROP_R * 0.7, 80 + LIDAR_DROP + PROP_Z]; })],
    WIDTH, HEIGHT, { pad: 22, azimuth: 45, elevation: 30 });
}

export function build(P) {
  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (pts, style) => k.dotsSvg(pts, style);
  const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
  const byDepth = (pts) => [...pts].sort((a, b) => depth(a[0], a[1]) - depth(b[0], b[1]));

  // a rotated box on the floor (for arms): centre line from r0 to r1 along angle deg, width w
  const armRing = (deg, r0, r1, w) => {
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)), nx = -s * w / 2, ny = c * w / 2;
    return [[c * r0 + nx, s * r0 + ny], [c * r1 + nx, s * r1 + ny], [c * r1 - nx, s * r1 - ny], [c * r0 - nx, s * r0 - ny]];
  };

  // ------------------------------------------------------------------ base plate and mat
  function plate() {
    const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
    for (const [x, y] of byDepth(k.corners(PLATE, 16))) {
      out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.4, P, 28), { tone: "lo" }));
      out.push(S(k.cylinder(x, y, 5.2, -PLATE_H - FOOT_H + 1.4, FOOT_H - 1.4, P, 28), { tone: "mid" }));
    }
    out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(PLATE, -PLATE_H / 2, P, 8), { tone: "faint" }) }));
    out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
    const screws = k.corners(PLATE, 9);
    out.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 16)).join(""), { tone: "lo" }));
    out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
    // the textured flow mat: a thin inlay with a random speckle the optical-flow sensor can track
    out.push(S(k.slabOf(MAT, 0, 0.5, P, 3), { tone: "lo", crease: "none" }));
    out.push(L(k.planOutline(k.insetPlan(MAT, 2.2), 0.5, P, 3), { tone: "faint" }));
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const speck = [];
    for (let i = 0; i < 360; i++) {
      const x = MAT.x + 4 + rnd() * (MAT.w - 8), y = MAT.y + 4 + rnd() * (MAT.d - 8);
      speck.push(at([x, y, 0.5]));
    }
    out.push(D(speck, { size: 0.42, tone: "lo" }));
    // corner registration marks: closed squares, so nothing ends in mid-air
    for (const [x, y] of k.corners(MAT, 6)) out.push(L(k.planOutline({ x: x - 1.6, y: y - 1.6, w: 3.2, d: 3.2, r: 0.4 }, 0.5, P, 2), { tone: "mid" }));
    // ruler strip along the near-left edge, with a tick every 2 cm and a major every 10
    out.push(S(k.slabOf(STRIP, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
    const t = k.topTicks(STRIP.x + 4, STRIP.x + STRIP.w - 4, 2, 5, STRIP.y + 0.8, 0.6, [1.8, 3.4], P);
    out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
    out.push(D([at([STRIP.x + 2, STRIP.y + 3.5, 0.6]), at([STRIP.x + STRIP.w - 2, STRIP.y + 3.5, 0.6])], { size: 0.45 }));
    // label plate with three rule lines standing for printed text
    out.push(S(k.slabOf(LABEL, 0, 0.8, P, 4), { tone: "mid", crease: "none" }));
    out.push(L(k.planOutline(k.insetPlan(LABEL, 1.6), 0.8, P, 4), { tone: "faint" }));
    out.push(L([12, 8, 10].map((len, i) => k.lineOnTop([LABEL.x + 3.4 + i * 2.6, LABEL.y + 3.6], [LABEL.x + 3.4 + i * 2.6, LABEL.y + 3.6 + len], 0.8, P)).join(""), { tone: "lo", free: true }));
    out.push(D([at([LABEL.x + LABEL.w - 3, LABEL.y + 3, 0.8]), at([LABEL.x + LABEL.w - 3, LABEL.y + LABEL.d - 3, 0.8])], { size: 0.45 }));
    // tether anchor: washer, eye post, ring
    out.push(S(k.cylinder(ANCHOR[0], ANCHOR[1], 3.4, 0.5, 0.8, P, 24), { tone: "mid" }));
    out.push(S(k.cylinder(ANCHOR[0], ANCHOR[1], 1.1, 1.3, 2.4, P, 16), { tone: "mid" }));
    out.push(S(k.cylinder(ANCHOR[0], ANCHOR[1], 1.8, 3.7, 0.9, P, 20), { tone: "mid" }));
    out.push(D([at([ANCHOR[0] + 2.4, ANCHOR[1] - 1.2, 1.3]), at([ANCHOR[0] - 1.2, ANCHOR[1] + 2.4, 1.3])], { size: 0.4 }));
    return out.join("");
  }

  // ------------------------------------------------------------------ height gauge mast (left)
  function mast() {
    const out = [];
    const foot = k.insetPlan(MAST, -4);
    out.push(S(k.slabOf(foot, 0, 3, P, 4, 0.6), { tone: "mid" }));
    out.push(D(k.corners(foot, 1.8).map(([x, y]) => at([x, y, 3])), { size: 0.45 }));
    out.push(S(k.slabOf(MAST, 3, MAST_TOP - 3, P, 3, 0.5), { tone: "mid", crease: "faint" }));
    // ticks on the mast's +y face, hanging from its +x edge: every 2 cm, major every 10
    const face = MAST.y + MAST.d, edge = MAST.x + MAST.w;
    const minor = [], major = [];
    for (let z = 10; z <= MAST_TOP - 4; z += 2) {
      const big = z % 10 === 0;
      (big ? major : minor).push(k.segment([edge, face, z], [edge - (big ? 4.4 : 2.4), face, z], P));
    }
    out.push(L(minor.join(""), { tone: "lo" }), L(major.join(""), { tone: "mid" }));
    out.push(S(k.slabOf(k.insetPlan(MAST, -0.8), MAST_TOP, 2.4, P, 3, 0.4), { tone: "mid" }));
    out.push(D([at([MAST.x + 4, MAST.y + 4, MAST_TOP + 2.4])], { size: 0.5 }));
    return out.join("");
  }

  // the slider on the mast that follows the measured height (built at z = 0, moved live)
  function slider() {
    const out = [];
    const block = k.insetPlan(MAST, -1.6);
    out.push(S(k.slabOf(block, -3, 6, P, 3, 0.4), { tone: "mid" }));
    // pointer arm toward the stand's centre, ending in a fine tip at the tick edge
    out.push(S(k.extrude([[MAST.x + MAST.w + 1.6, MAST.y + 3], [MAST.x + MAST.w + 9, MAST.y + 4], [MAST.x + MAST.w + 1.6, MAST.y + 5]], -0.6, 1.2, P), { tone: "hi", crease: "lo" }));
    out.push(S(k.cylinder(MAST.x + MAST.w / 2, MAST.y + MAST.d + 2.6, 1.3, -1.2, 2.4, P, 16), { tone: "mid" }));
    out.push(L(k.knurl(MAST.x + MAST.w / 2, MAST.y + MAST.d + 2.6, 1.3, -1.2, 1.2, 12, P), { tone: "lo" }));
    return out.join("");
  }

  // ------------------------------------------------------------------ the drone (built at z = 0)
  const items = [];                                                  // [depthKey, level, svg]
  const put = (level, x, y, svg) => items.push([level, depth(x, y), svg]);

  // level 0: things hanging under the body (legs, flow sensor, lidar, belly eye)
  for (const [, deg] of MOTORS) {
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)), lx = c * 15, ly = s * 15;
    put(0, lx, ly, [
      S(k.cylinder(lx, ly, 2.2, -LEG, 0.9, P, 20), { tone: "lo" }),
      S(k.cylinder(lx, ly, 0.9, -LEG + 0.9, LEG - 0.9 + ARM_Z, P, 16), { tone: "mid", crease: "none" }),
      S(k.cylinder(lx, ly, 1.5, -2.2, 1.6, P, 16), { tone: "mid" }),
    ].join(""));
  }
  put(0, 0, 0, [
    S(k.slabOf({ x: -2.1, y: -2.1, w: 4.2, d: 4.2, r: 0.6 }, -1.4, 1.4, P, 2, 0.3), { tone: "hi", crease: "lo" }),
    D([at([1.6, -1.6, 0]), at([1.6, 1.6, 0])], { size: 0.35 }),
    S(k.cylinder(-4.2, 0, 0.9, -1.6, 1.6, P, 14), { tone: "mid" }),
  ].join(""));
  const [lx, ly] = LIDAR;
  put(0, lx, ly, [
    S(k.slabOf({ x: lx - 1.8, y: ly - 1.8, w: 3.6, d: 3.6, r: 0.5 }, -LIDAR_DROP + 0.2, LIDAR_DROP - 0.2 + ARM_Z, P, 2, 0.3), { tone: "hi", crease: "lo", lit: true }),
    L(k.sideSeam({ x: lx - 1.8, y: ly - 1.8, w: 3.6, d: 3.6, r: 0.5 }, -1.2, P, 2), { tone: "faint" }),
  ].join(""));

  // level 1: bottom plate
  put(1, 0, 0, S(k.slabOf(PLATE_D, 0, ARM_Z, P, 4, 0.4), { tone: "mid" }));

  // level 2: arms and standoffs
  for (const [, deg] of MOTORS) {
    const [mx, my] = motorAt(deg);
    put(2, mx * 0.55, my * 0.55, [
      S(k.extrude(armRing(deg, 7, MOTOR_R - 1.6, 3.4), ARM_Z, ARM_H, P, { bevel: 0.4 }), { tone: "mid" }),
      L(k.onTop([[Math.cos(rad(deg)) * 9, Math.sin(rad(deg)) * 9], [Math.cos(rad(deg)) * (MOTOR_R - 4), Math.sin(rad(deg)) * (MOTOR_R - 4)]], TOP_Z, P), { tone: "faint" }),
    ].join(""));
  }
  for (const [x, y] of [[0, 6.6], [0, -6.6], [6.6, 0], [-6.6, 0]]) put(2, x, y, S(k.cylinder(x, y, 0.7, ARM_Z, ARM_H, P, 12), { tone: "mid", crease: "none" }));

  // level 3: top plate
  put(3, 0, 0, [
    S(k.slabOf(PLATE_D, TOP_Z, 0.6, P, 4, 0.4), { tone: "mid" }),
    D(k.corners(PLATE_D, 2.2).map(([x, y]) => at([x, y, TOP_Z + 0.6])), { size: 0.45 }),
  ].join(""));
  const TP = TOP_Z + 0.6;

  // level 4: what stands on the top plate and on the arm tips
  for (const [name, deg] of MOTORS) {
    const [mx, my] = motorAt(deg);
    put(4, mx, my, [
      S(k.cylinder(mx, my, 2.8, TOP_Z, 0.5, P, 28), { tone: "mid" }),
      D([0, 1, 2, 3].map((i) => at([mx + Math.cos(i * Math.PI / 2 + 0.6) * 2.2, my + Math.sin(i * Math.PI / 2 + 0.6) * 2.2, TOP_Z + 0.5])), { size: 0.35 }),
      S(k.cylinder(mx, my, 2.0, TOP_Z + 0.5, 0.8, P, 28), { tone: "mid" }),
      S(k.cylinder(mx, my, 2.3, TOP_Z + 1.3, MOTOR_TOP - TOP_Z - 1.3, P, 36, 0.3), { tone: "hi", crease: "lo" }),
      L(k.knurl(mx, my, 2.3, TOP_Z + 1.9, MOTOR_TOP - 0.6, 22, P, 0.3), { tone: "faint" }),
      L(k.sideArc(mx, my, 2.3, TOP_Z + 1.9, P, 20), { tone: "faint" }),
      S(k.cylinder(mx, my, 0.9, MOTOR_TOP, 0.9, P, 16), { tone: "mid" }),
      S(k.cylinder(mx, my, 0.45, MOTOR_TOP + 0.9, 0.6, P, 12), { tone: "mid" }),
    ].join(""));
  }
  // 3S LiPo along the back of the top plate, with its strap
  const BAT = { x: -8.4, y: -5.4, w: 4.2, d: 10.8, r: 0.8 };
  put(4, -6.3, 0, [
    S(k.slabOf(BAT, TP, 2.6, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(BAT, TP + 1.3, P, 3), { tone: "faint" }) }),
    S(k.slabOf({ x: BAT.x - 0.4, y: -0.9, w: BAT.w + 0.8, d: 1.8, r: 0.4 }, TP, 2.9, P, 2), { tone: "lo", crease: "none" }),
    L(k.planOutline({ x: BAT.x + 0.9, y: BAT.y + 1.2, w: 2.4, d: 2.8, r: 0.3 }, TP + 2.6, P, 2), { tone: "faint" }),
  ].join(""));
  // ESC + flight controller stack on soft mounts
  const STACK = { x: -1.4, y: -1.9, w: 3.8, d: 3.8, r: 0.4 };
  const sc = [STACK.x + STACK.w / 2, STACK.y + STACK.d / 2];
  put(4, sc[0], sc[1], [
    ...k.corners(STACK, 0.5).map(([x, y]) => S(k.cylinder(x, y, 0.25, TP, 0.9, P, 8), { tone: "mid", crease: "none" })),
    S(k.slabOf(STACK, TP + 0.9, 0.3, P, 2), { tone: "mid" }),
    ...k.corners(STACK, 0.5).map(([x, y]) => S(k.cylinder(x, y, 0.42, TP + 1.2, 0.8, P, 10), { tone: "lo" })),
    S(k.slabOf(STACK, TP + 2.0, 0.3, P, 2, 0.2), { tone: "hi", crease: "lo" }),
    S(k.slabOf({ x: STACK.x + 1.2, y: STACK.y + 1.2, w: 1.4, d: 1.4, r: 0.15 }, TP + 2.3, 0.25, P, 2), { tone: "mid" }),
    D([at([STACK.x + 3.2, STACK.y + 0.6, TP + 2.3])], { size: 0.35, tone: "hi", pulse: true }),
    S(k.slabOf({ x: STACK.x + STACK.w - 0.1, y: STACK.y + 1.3, w: 0.6, d: 1.2, r: 0.1 }, TP + 2.0, 0.3, P, 2), { tone: "mid" }),
  ].join(""));
  // telemetry radio and its antenna at the rear-left of the top plate
  const RADIO = { x: -3.4, y: 5.6, w: 3.2, d: 2.4, r: 0.3 };
  put(4, -1.8, 6.8, [
    S(k.slabOf(RADIO, TP, 1.0, P, 2, 0.2), { tone: "mid" }),
    S(k.cylinder(-1.8, 6.8, 0.5, TP + 1.0, 0.6, P, 10), { tone: "mid" }),
    S(k.cylinder(-1.8, 6.8, 0.28, TP + 1.6, 7.2, P, 10), { tone: "mid", crease: "none" }),
    S(k.cylinder(-1.8, 6.8, 0.5, TP + 8.8, 0.9, P, 10), { tone: "mid" }),
  ].join(""));

  items.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const drone = items.map((i) => i[2]).join("");

  // props: drawn last, a faint swept disc plus two blades rebuilt as they turn
  const props = MOTORS.map(([name, deg]) => {
    const [mx, my] = motorAt(deg);
    return `<g data-prop="${name}">${L(k.ring(mx, my, PROP_R, PROP_Z, P, 72), { tone: "faint" })}<path class="nd-blade" data-blades d="${blades(mx, my, 0, P)}"/>${k.dotsSvg([k.iso([mx, my, PROP_Z + 0.2], P)], { size: 0.5, tone: "mid" })}</g>`;
  }).join("");

  return { plate: plate(), mast: mast(), slider: slider(), drone, props };
}

// two tapered blades as one closed outline each, on the prop plane
export function blades(mx, my, angle, P, z = PROP_Z) {
  const out = [];
  for (const off of [0, Math.PI]) {
    const a = angle + off, c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c;
    const pts = [[1.0, 0.9], [5.5, 1.5], [10.5, 1.0], [12.4, 0.35], [12.4, -0.35], [10.5, -0.6], [5.5, -0.8], [1.0, -0.7]]
      .map(([r, w]) => [mx + c * r + nx * w, my + s * r + ny * w]);
    out.push(k.onTop(pts, z, P, true));
  }
  return out.join("");
}
