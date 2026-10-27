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