export default function handler(_req, res) {
  res.status(200).json({ ok: true, server: "up" });
}
