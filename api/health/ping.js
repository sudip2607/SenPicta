export const config = { runtime: "nodejs" };

import { v2 as cloudinary } from "cloudinary";

export default async function handler(_req, res) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const ping = await cloudinary.api.ping();
    res.status(200).json({ ok: true, ping });
  } catch (e) {
    res.status(502).json({ ok: false, error: e?.message || "Ping failed" });
  }
}
