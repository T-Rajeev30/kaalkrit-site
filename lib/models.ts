// Small low-poly models built from primitives in the site palette. Each returns a group plus an update(t)
// that animates it (rotors spin, the arm moves, the chip pulses). Used by the live buddy and the domain cards.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Model = { group: THREE.Group; update: (t: number, spin?: number) => void; eyes?: THREE.Object3D[]; face?: THREE.Object3D };

const RED = 0xf32e35, INDIGO = 0x4e50de, DARK = 0x2a2735, STEEL = 0xb9b6c7;
export const mat = {
  red: () => new THREE.MeshStandardMaterial({ color: RED, roughness: 0.42, metalness: 0.08 }),
  indigo: () => new THREE.MeshStandardMaterial({ color: INDIGO, roughness: 0.38, metalness: 0.12 }),
  dark: () => new THREE.MeshStandardMaterial({ color: DARK, roughness: 0.6, metalness: 0.2 }),
  steel: () => new THREE.MeshStandardMaterial({ color: STEEL, roughness: 0.3, metalness: 0.65 }),
  glow: (c = INDIGO) => new THREE.MeshBasicMaterial({ color: c }),
  disc: () => new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.13, depthWrite: false, side: THREE.DoubleSide }),
};
const box = (w: number, h: number, d: number, m: THREE.Material, r = 0.06) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), m);
const cyl = (r1: number, r2: number, h: number, m: THREE.Material, seg = 24) => new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m);

export function drone(withFace = false): Model {
  const g = new THREE.Group(), rotors: THREE.Object3D[] = [];
  const body = box(1.1, 0.42, 0.9, mat.red(), 0.16); g.add(body);
  const lid = box(0.7, 0.16, 0.6, mat.indigo(), 0.07); lid.position.y = 0.28; g.add(lid);
  const ant = cyl(0.025, 0.025, 0.42, mat.dark()); ant.position.set(-0.22, 0.55, -0.15); g.add(ant);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), mat.glow(RED)); tip.position.set(-0.22, 0.78, -0.15); g.add(tip);
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz], i) => {
    const arm = box(0.95, 0.08, 0.12, mat.dark(), 0.03);
    arm.position.set(sx * 0.62, 0.02, sz * 0.52); arm.rotation.y = -Math.atan2(sz * 0.52, sx * 0.62); g.add(arm);
    const mx = sx * 0.98, mz = sz * 0.82;
    const motor = cyl(0.11, 0.12, 0.18, mat.steel()); motor.position.set(mx, 0.1, mz); g.add(motor);
    const leg = cyl(0.03, 0.03, 0.34, mat.dark(), 10); leg.position.set(sx * 0.7, -0.26, sz * 0.58); g.add(leg);
    const rotor = new THREE.Group(); rotor.position.set(mx, 0.22, mz); rotor.userData.dir = i % 3 === 0 ? 1 : -1;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.46, 40), mat.disc()); disc.rotation.x = -Math.PI / 2; rotor.add(disc);
    const blade = box(0.86, 0.02, 0.09, mat.indigo(), 0.01); rotor.add(blade);
    const hub = cyl(0.05, 0.05, 0.06, mat.red(), 12); rotor.add(hub);
    g.add(rotor); rotors.push(rotor);
  });
  let eyes: THREE.Object3D[] | undefined, face: THREE.Object3D | undefined;
  if (withFace) {
    face = new THREE.Group(); face.position.set(0.56, 0.0, 0);
    const visor = box(0.07, 0.32, 0.74, new THREE.MeshStandardMaterial({ color: 0x0b0a10, roughness: 0.15, metalness: 0.5 }), 0.05);
    face.add(visor);
    eyes = [-0.17, 0.17].map((z) => {
      const e = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.09, 6, 12), mat.glow(0xb6b8ff));
      e.position.set(0.05, 0.01, z); face!.add(e); return e;
    });
    g.add(face);
  }
  return {
    group: g, eyes, face,
    update: (t, spin = 1) => { rotors.forEach((r) => (r.rotation.y += r.userData.dir * 0.55 * spin)); tip.scale.setScalar(0.85 + 0.25 * Math.sin(t * 4)); },
  };
}

export function robot(): Model {
  const g = new THREE.Group();
  const chassis = box(1.1, 0.42, 0.8, mat.indigo(), 0.1); chassis.position.y = 0.05; g.add(chassis);
  const head = box(0.62, 0.42, 0.56, mat.red(), 0.12); head.position.y = 0.55; g.add(head);
  const neck = cyl(0.08, 0.08, 0.18, mat.dark(), 12); neck.position.y = 0.3; g.add(neck);
  const eyes = [-0.13, 0.13].map((z) => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), mat.glow(0xffffff)); e.position.set(0.31, 0.58, z); g.add(e); return e; });
  const lidar = cyl(0.13, 0.13, 0.1, mat.dark()); lidar.position.y = 0.82; g.add(lidar);
  const wheels = [[0.36, 0.44], [-0.36, 0.44], [0.36, -0.44], [-0.36, -0.44]].map(([x, z]) => {
    const w = cyl(0.17, 0.17, 0.1, mat.dark(), 20); w.rotation.x = Math.PI / 2; w.position.set(x, -0.16, z); g.add(w); return w;
  });
  return { group: g, update: (t) => { lidar.rotation.y = t * 3; wheels.forEach((w) => (w.rotation.y = t * 2)); eyes.forEach((e) => e.scale.set(1, Math.abs(Math.sin(t * 0.9)) > 0.97 ? 0.15 : 1, 1)); } };
}

export function chip(): Model {
  const g = new THREE.Group();
  const pkg = box(1.2, 0.16, 1.2, mat.dark(), 0.04); g.add(pkg);
  const die = box(0.6, 0.06, 0.6, mat.indigo(), 0.02); die.position.y = 0.11; g.add(die);
  const core = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.26), mat.glow(RED)); core.position.y = 0.15; g.add(core);
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) {
    const o = -0.45 + i * 0.18;
    const a = box(0.06, 0.04, 0.16, mat.steel(), 0.01); a.position.set(o, -0.02, s * 0.66); g.add(a);
    const b = box(0.16, 0.04, 0.06, mat.steel(), 0.01); b.position.set(s * 0.66, -0.02, o); g.add(b);
  }
  return { group: g, update: (t) => { core.scale.setScalar(0.8 + 0.35 * (0.5 + 0.5 * Math.sin(t * 3))); } };
}

export function arm(): Model {
  const g = new THREE.Group();
  const base = cyl(0.42, 0.5, 0.16, mat.dark(), 32); base.position.y = -0.5; g.add(base);
  const turret = new THREE.Group(); turret.position.y = -0.38; g.add(turret);
  turret.add(cyl(0.24, 0.28, 0.2, mat.red(), 24));
  const shoulder = new THREE.Group(); shoulder.position.y = 0.12; turret.add(shoulder);
  shoulder.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), mat.steel()));
  const l1 = box(0.14, 0.7, 0.14, mat.indigo(), 0.05); l1.position.y = 0.36; shoulder.add(l1);
  const elbow = new THREE.Group(); elbow.position.y = 0.72; shoulder.add(elbow);
  elbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), mat.steel()));
  const l2 = box(0.12, 0.55, 0.12, mat.red(), 0.04); l2.position.y = 0.28; elbow.add(l2);
  const wrist = new THREE.Group(); wrist.position.y = 0.58; elbow.add(wrist);
  const fingers = [-1, 1].map((s) => { const f = box(0.04, 0.16, 0.08, mat.dark(), 0.01); f.position.set(s * 0.06, 0.06, 0); wrist.add(f); return f; });
  return {
    group: g,
    update: (t) => {
      turret.rotation.y = Math.sin(t * 0.6) * 0.9;
      shoulder.rotation.z = -0.35 + Math.sin(t * 0.9) * 0.25;
      elbow.rotation.z = 0.9 + Math.sin(t * 0.9 + 1) * 0.35;
      const open = 0.06 + 0.035 * (0.5 + 0.5 * Math.sin(t * 1.8));
      fingers[0].position.x = -open; fingers[1].position.x = open;
    },
  };
}

export const MAKERS: Record<string, () => Model> = { drone: () => drone(), robot, chip, arm };

export function stage(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3cff, 1.25));
  const key = new THREE.DirectionalLight(0xffffff, 2.1); key.position.set(2.5, 4, 3); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff5a60, 0.9); rim.position.set(-3, 1.5, -2.5); scene.add(rim);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  fit();
  return { renderer, scene, camera, fit };
}
