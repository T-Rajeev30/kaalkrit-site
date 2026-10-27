import "./globals.css";
import "./extra.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Team KaalKrit",
  description: "Team KaalKrit: student engineers building drones, robots, robotic arms and edge AI, and taking them to national competitions.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#08070b" }, { media: "(prefers-color-scheme: light)", color: "#f2efe9" }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apply a saved theme before first paint, so there is no flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("kk-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" />
      </head>
      <body>
        {/* rough print edges for the big poster type */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}