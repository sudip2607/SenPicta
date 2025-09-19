// cloudinary-photos.cjs
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");

const app = express();
const PORT = process.env.PORT || 5001;

/* ---------- Config ---------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // djho83sm7
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS: allow local Vite and vercel previews
app.use(cors({
  origin: [/^http:\/\/localhost:\d+$/, /\.vercel\.app$/],
  credentials: false
}));

// tiny logger
app.use((req, _res, next) => { 
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Express response timeout safety (optional)
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    console.warn("Response timeout:", req.method, req.url);
    if (!res.headersSent) res.status(504).json({ ok:false, error:"Gateway Timeout" });
  });
  next();
});

/* ---------- Helpers ---------- */
const withTimeout = (promise, ms = 10000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    )
  ]);

/* ---------- Routes ---------- */

// Quick root page so you "see something" immediately
app.get("/", (_req, res) => {
  res.type("html").send(`
    <h3>OK</h3>
    <ul>
      <li><a href="/api/health">/api/health</a></li>
      <li><a href="/api/health/ping">/api/health/ping</a></li>
      <li><a href="/api/cloudinary-photos">/api/cloudinary-photos</a></li>
      <li><a href="/api/cloudinary-photos?folder=landscape">/api/cloudinary-photos?folder=landscape</a></li>
    </ul>
  `);
});

// Immediate health (no external calls)
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, server: "up" });
});

// Cloudinary ping with timeout (diagnostics)
app.get("/api/health/ping", async (_req, res) => {
  try {
    const ping = await withTimeout(cloudinary.api.ping(), 6000);
    res.json({ ok: true, ping });
  } catch (err) {
    console.error("Ping error:", err?.message || err);
    res.status(502).json({ ok: false, error: err?.message || "Ping failed" });
  }
});

// Images (search) with timeout + clear errors
app.get("/api/cloudinary-photos", async (req, res) => {
  const folder = (req.query.folder || "").trim();        // CASE-SENSITIVE
  const max    = Math.min(parseInt(req.query.max || "60", 10), 200);

  const parts = ["resource_type:image", "type:upload"];
  if (folder) parts.push(`folder:${folder}`);
  const expression = parts.join(" AND ");

  console.log("[search] expression:", expression);

  try {
    const result = await withTimeout(
      cloudinary.search
        .expression(expression)
        .sort_by("created_at", "desc")
        .with_field("folder")
        .with_field("context")
        .max_results(max)
        .execute(),
      10000
    );

    const images = (result.resources || []).map(r => ({
      id: r.public_id,
      public_id: r.public_id,
      image_url: r.secure_url,
      width: r.width,
      height: r.height,
      folder: r.folder,
      created_at: r.created_at,
      context: r.context || null
    }));

    if (!images.length) console.warn("[search] no images for:", expression);

    res.json({ ok: true, count: images.length, folder: folder || null, images });
  } catch (err) {
    console.error("[search] error:", err?.message || err);
    res.status(502).json({
      ok: false,
      error: err?.message || "Cloudinary search failed",
      hint: folder
        ? "Check exact folder name (case-sensitive) & your Cloudinary credentials."
        : "Try adding ?folder=<your-folder> or upload some images."
    });
  }
});

/* ---------- Start ---------- */
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Cloudinary API running → http://localhost:${PORT}/  (try /api/health)`);
});
