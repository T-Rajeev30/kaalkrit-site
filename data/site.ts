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