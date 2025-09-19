export const config = { runtime: "nodejs" };

import { v2 as cloudinary } from "cloudinary";

function withTimeout(promise, ms = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)),
  ]);
}

function mapResource(r) {
  return {
    id: r.public_id,
    public_id: r.public_id,
    image_url: r.secure_url,
    width: r.width,
    height: r.height,
    folder: r.folder || (r.public_id?.includes("/") ? r.public_id.split("/").slice(0, -1).join("/") : ""),
    created_at: r.created_at,
    context: r.context || null,
    title: r.context?.custom?.title || null,
    location: r.context?.custom?.location || null,
    category: r.context?.custom?.category || null,
    camera_settings: r.context?.custom?.camera_settings || null,
  };
}

async function trySearch(folder, max) {
  const base = ["resource_type:image", "type:upload"];
  const variants = [];
  variants.push(base.concat(folder ? [`folder:${folder}`] : []).join(" AND "));
  if (folder) variants.push(base.concat([`folder="${folder}"`]).join(" AND "));
  if (folder) variants.push(base.concat([`public_id:${folder}/*`]).join(" AND "));
  for (const expr of variants) {
    try {
      const result = await withTimeout(
        cloudinary.search.expression(expr).sort_by("created_at", "desc").with_field("context").max_results(max).execute(),
        10000
      );
      const arr = (result.resources || []).map(mapResource);
      if (arr.length) return { images: arr, via: "search", expression: expr };
    } catch {}
  }
  return null;
}

async function tryAdmin(folder, max) {
  try {
    const params = { resource_type: "image", type: "upload", max_results: max, context: true };
    if (folder) params.prefix = `${folder}/`;
    const result = await withTimeout(cloudinary.api.resources(params), 10000);
    const arr = (result.resources || []).map(mapResource);
    return { images: arr, via: "admin", note: folder ? "prefix" : "recent" };
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });

  // Configure here (Edge-safe)
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const folder = (req.query.folder || "").trim();
  const max = Math.min(parseInt(req.query.max || "60", 10), 200);

  try {
    const viaSearch = await trySearch(folder, max);
    if (viaSearch?.images?.length) {
      return res.status(200).json({ ok: true, count: viaSearch.images.length, folder: folder || null, via: viaSearch.via, images: viaSearch.images });
    }
    const viaAdmin = await tryAdmin(folder, max);
    if (viaAdmin?.images?.length) {
      return res.status(200).json({ ok: true, count: viaAdmin.images.length, folder: folder || null, via: viaAdmin.via, images: viaAdmin.images });
    }
    return res.status(404).json({
      ok: false,
      error: "No images found.",
      hint: folder ? "Check exact folder name (case-sensitive) or ensure that folder has images." : "Upload images to your Cloudinary account.",
    });
  } catch (err) {
    return res.status(502).json({ ok: false, error: err?.message || "Cloudinary fetch failed" });
  }
}
