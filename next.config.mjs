/** Static export so the site can be hosted anywhere (Vercel, GitHub Pages, Netlify, a Pi). */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  // PREVIEW=1 builds with relative asset paths so the export opens from any folder
  assetPrefix: process.env.PREVIEW ? "./" : undefined,
};
export default nextConfig;
