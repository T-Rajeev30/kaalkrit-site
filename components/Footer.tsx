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