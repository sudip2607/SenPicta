// cloudinary-photos.cjs
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");

const app = express();
const PORT = process.env.PORT || 5001;

/* ---------- Cloudinary config ---------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // djho83sm7
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/, /\.vercel\.app$/],
    credentials: false,
  })
);

// tiny logger
app.use((req, _res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// prevent forever-hangs at the response layer
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    if (!res.headersSent) {
      console.warn("Response timeout:", req.method, req.url);
      res.status(504).json({ ok: false, error: "Gateway Timeout" });
    }
  });
  next();
});

/* ---------- Helpers ---------- */
const withTimeout = (promise, ms = 10000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)),
  ]);

function mapResource(r) {
  return {
    id: r.public_id,
    public_id: r.public_id,
    image_url: r.secure_url,
    width: r.width,
    height: r.height,
    // derive folder if not provided
    folder: r.folder || (r.public_id.includes("/") ? r.public_id.split("/").slice(0, -1).join("/") : ""),
    created_at: r.created_at,
    context: r.context || null,
    title: r.context?.custom?.title || null,
    location: r.context?.custom?.location || null,
    category: r.context?.custom?.category || null,
    camera_settings: r.context?.custom?.camera_settings || null,
  };
}

/** Try Cloudinary Search with safe options (no 'folder' in with_field). */
async function trySearch(folder, max) {
  const base = ['resource_type:image', 'type:upload'];
  const variants = [];

  // expressions we’ll try (folder is CASE-SENSITIVE)
  variants.push(base.concat(folder ? [`folder:${folder}`] : []).join(" AND "));
  if (folder) variants.push(base.concat([`folder="${folder}"`]).join(" AND "));
  if (folder) variants.push(base.concat([`public_id:${folder}/*`]).join(" AND "));

  for (const expr of variants) {
    try {
      console.log("[search] trying:", expr);
      const result = await withTimeout(
        cloudinary.search
          .expression(expr)
          .sort_by("created_at", "desc")
          // REMOVE 'folder' here; it's not a supported with_field
          .with_field("context")
          .max_results(max)
          .execute(),
        10000
      );
      const arr = (result.resources || []).map(mapResource);
      if (arr.length) return { images: arr, expression: expr, method: "search" };
    } catch (e) {
      console.warn("[search] variant failed:", e?.message || e);
    }
  }
  return null;
}

/** Fallback to Admin API by prefix/folder */
async function tryAdmin(folder, max) {
  try {
    let result;
    if (folder) {
      console.log("[admin] resources by prefix:", `${folder}/`);
      result = await withTimeout(
        cloudinary.api.resources({
          resource_type: "image",
          type: "upload",
          prefix: `${folder}/`, // list everything under folder/
          max_results: max,
          context: true,
        }),
        10000
      );
    } else {
      console.log("[admin] recent uploads (no folder)");
      result = await withTimeout(
        cloudinary.api.resources({
          resource_type: "image",
          type: "upload",
          max_results: max,
          context: true,
        }),
        10000
      );
    }
    const arr = (result.resources || []).map(mapResource);
    return { images: arr, method: "admin", note: folder ? "prefix" : "recent" };
  } catch (e) {
    console.warn("[admin] resources failed:", e?.message || e);
    return null;
  }
}

/* ---------- Routes ---------- */

// root page to click around quickly
app.get("/", (_req, res) => {
  res.type("html").send(`
    <h3>OK</h3>
    <ul>
      <li><a href="/api/health">/api/health</a></li>
      <li><a href="/api/health/ping">/api/health/ping</a></li>
      <li><a href="/api/folders">/api/folders</a></li>
      <li><a href="/api/cloudinary-photos">/api/cloudinary-photos</a></li>
      <li><a href="/api/cloudinary-photos?folder=landscape">/api/cloudinary-photos?folder=landscape</a></li>
    </ul>
  `);
});

// immediate health
app.get("/api/health", (_req, res) => res.json({ ok: true, server: "up" }));

// Cloudinary ping
app.get("/api/health/ping", async (_req, res) => {
  try {
    const ping = await withTimeout(cloudinary.api.ping(), 6000);
    res.json({ ok: true, ping });
  } catch (err) {
    res.status(502).json({ ok: false, error: err?.message || "Ping failed" });
  }
});

// List top-level folders (helps confirm exact names/case)
app.get("/api/folders", async (req, res) => {
  try {
    const root = await withTimeout(cloudinary.api.root_folders(), 8000);
    res.json({ ok: true, folders: root.folders || [] });
  } catch (err) {
    res.status(502).json({ ok: false, error: err?.message || "Failed to list folders" });
  }
});

// Main images endpoint
// GET /api/cloudinary-photos?folder=<CaseSensitive>&max=60
app.get("/api/cloudinary-photos", async (req, res) => {
  const folder = (req.query.folder || "").trim(); // CASE-SENSITIVE
  const max = Math.min(parseInt(req.query.max || "60", 10), 200);
  console.log("[photos] requested folder:", folder || "(none)");

  try {
    // 1) Search API
    const viaSearch = await trySearch(folder, max);
    if (viaSearch && viaSearch.images.length) {
      console.log("[photos] served via Search:", viaSearch.expression);
      return res.json({
        ok: true,
        count: viaSearch.images.length,
        folder: folder || null,
        via: viaSearch.method,
        images: viaSearch.images,
      });
    }

    // 2) Admin API fallback
    const viaAdmin = await tryAdmin(folder, max);
    if (viaAdmin && viaAdmin.images.length) {
      console.log("[photos] served via Admin:", viaAdmin.note);
      return res.json({
        ok: true,
        count: viaAdmin.images.length,
        folder: folder || null,
        via: viaAdmin.method,
        images: viaAdmin.images,
      });
    }

    // Nothing found anywhere
    return res.status(404).json({
      ok: false,
      error: "No images found.",
      hint: folder
        ? "Check the exact folder name (case-sensitive) or ensure that folder has images."
        : "Your account may have no uploaded images. Upload some and try again.",
    });
  } catch (err) {
    console.error("[photos] fatal error:", err?.message || err);
    return res.status(502).json({
      ok: false,
      error: err?.message || "Cloudinary fetch failed",
      hint:
        "If Search is disabled on your plan, the Admin API fallback should still work. Verify the folder exists and contains images.",
    });
  }
});

/* ---------- Start ---------- */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Cloudinary API running → http://127.0.0.1:${PORT}/  (try /api/health)`);
});
