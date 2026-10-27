# Team KaalKrit website (Next.js 14)

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # static site in out/ (deploy to Vercel, Netlify, GitHub Pages or any web host)

## Where to edit
- data/members.ts: team members (name, role, focus tags, photo, LinkedIn, GitHub). Put photos in public/team/.
- data/site.ts: domains and competitions.
- app/page.tsx: section text. app/globals.css: colours (--ink #08070B, --red #F32E35, --indigo #4E50DE) and layout.
- components/: Hero (flow-field canvas + letter animation), Reveal (scroll choreography), DroneFigure/DroneLive
  (isometric AirMouse rig from lib/figure.mjs, built with the MIT Anatomy kit in lib/iso), ControlChain (unused, optional).

3D: three.js 0.179.1. lib/models.ts builds the low-poly models (drone, robot, chip, arm); components/Buddy.tsx is Kaal, the
live 3D buddy (edit its lines in LINES), and components/Mini3D.tsx puts a model in each domain card.
Theme: dark/light switch in the nav; it follows the visitor's system setting until they choose.

Motion uses anime.js 3.2.2 and switches off for visitors with reduced motion turned on.
