// Server component: the isometric AirMouse rig is built once, at build time, with the anatomy kit.
import * as k from "@/lib/iso/iso-kit.mjs";
import * as F from "@/lib/figure.mjs";
import DroneLive from "./DroneLive";

export default function DroneFigure() {
  const P = F.fit();
  const parts = F.build(P);
  const Z0 = F.LEG;
  const lid0 = [F.LIDAR[0], F.LIDAR[1], Z0 - F.LIDAR_DROP], floor0 = [F.LIDAR[0], F.LIDAR[1], 0.5];
  const svg = k.figureSvg({
    width: F.WIDTH, height: F.HEIGHT,
    label: "The AirMouse quadcopter on a tethered test stand: a base plate with a textured mat for the optical-flow sensor, a tether anchor and a height-gauge mast whose slider follows the measured height. The lidar under the front-right arm shines a beam straight down to the mat.",
    body: [
      parts.plate, parts.mast,
      `<g data-part="slider" transform="${k.translateAlong(P, [0, 0, Z0 - F.LIDAR_DROP])}">${parts.slider}</g>`,
      `<path data-part="footprint" class="iso-line" data-tone="lo" d=""/>`,
      `<g data-part="tether" class="iso-wire" data-tone="lo"><path class="iso-line" data-tone="lo" d=""/><circle class="iso-wire-end" r="1"/><circle class="iso-wire-end" r="1"/></g>`,
      `<path data-part="beam" class="iso-line" data-tone="lit" d="${k.segment(lid0, floor0, P)}" style="stroke-width:1.1"/>`,
      `<g data-part="spot">${k.dotsSvg([k.iso(floor0, P)], { size: 1.4, tone: "hi", pulse: true })}</g>`,
      `<g data-part="drone" transform="${k.translateAlong(P, [0, 0, Z0])}">${parts.drone}${parts.props}</g>`,
    ],
  });
  const plate = k.plateHtml({
    fig: "Fig 1", title: "AirMouse on its test stand", hint: "Move up and down to set the hover height",
    readout: "landed · 0.09 m from backup rangefinder · flow q 40",
    keys: [
      { mark: "lit", label: "TFmini lidar and its beam: the height the drone holds" },
      { mark: "raised", label: "Quad frame, motors and the flight-controller stack" },
      { mark: "flat", label: "Textured mat: what the optical-flow sensor tracks" },
    ],
    caption: "The lidar reads 9 cm when landed, under its 10 cm minimum, so the flow sensor’s own rangefinder covers take-off and landing; above that the lidar takes over. Flow quality rises with height over a textured floor. The slider on the mast follows the measured height, and the 1.2 m tether keeps every test flight on the stand. The drawing shows 0.3–0.8 m of the 0–2 m phase-1 band.",
    body: `<div class="iso-stage am-stage" tabindex="0" role="slider" aria-label="AirMouse hover height: arrow keys raise and lower, L lands" aria-valuemin="0" aria-valuemax="0.8" aria-valuenow="0.09">${svg}</div>`,
  });
  const cfg = { P, LEG: F.LEG, DROP: F.LIDAR_DROP, LIDAR: F.LIDAR, MOTORS: F.MOTORS.map(([n, d, s]: [string, number, string]) => [n, ...F.motorAt(d), s]) };
  return (
    <div className="iso am-iso" data-theme="dark">
      <DroneLive cfg={cfg}><div dangerouslySetInnerHTML={{ __html: plate }} /></DroneLive>
    </div>
  );
}
