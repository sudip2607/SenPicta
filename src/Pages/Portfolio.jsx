import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { MapPin, Camera, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";

/** ---------- Cloudinary helpers ---------- */
const CLOUD_NAME = "djho83sm7";

function withTransform(url, tr) {
  if (!url) return url;
  if (!/res\.cloudinary\.com/.test(url)) return url;
  return url.replace(/\/image\/upload\/(v\d+\/)?/, (_m, v) => `/image/upload/${tr}/${v || ""}`);
}
function buildSrcSet(url, widths, baseTr) {
  return widths.map((w) => `${withTransform(url, `${baseTr},w_${w}`)} ${w}w`).join(", ");
}
function lqip(url) {
  return withTransform(url, "e_blur:2000,q_1,w_20");
}
function slugify(s = "") {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function prettyName(photo) {
  const raw =
    photo?.title ||
    photo?.public_id?.split("/").pop() ||
    photo?.image_url?.split("/").pop()?.split(".")[0] ||
    "Untitled";
  const cleaned = raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  const cap = 28;
  if (cleaned.length <= cap) return cleaned;
  const cut = cleaned.slice(0, cap + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).trim() + "…";
}

/** ---------- Fetch helpers ---------- */
async function fetchJsonWithTimeout(url, { timeout = 8000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    // try to parse json even on errors to read {ok:false,hint}
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { data });
    return data;
  } finally {
    clearTimeout(t);
  }
}
async function getApiJson(folder) {
  const q = `?folder=${encodeURIComponent(folder)}`;
  const devCandidates = [
    `http://127.0.0.1:5001/api/cloudinary-photos${q}`,
    `http://localhost:5001/api/cloudinary-photos${q}`,
  ];
  for (const url of devCandidates) {
    try {
      return await fetchJsonWithTimeout(url, { timeout: 8000 });
    } catch (e) {
      console.warn("Dev API try failed:", url, e?.message, e?.data?.hint || "");
    }
  }
  // Final fallback for production
  return await fetchJsonWithTimeout(`/api/cloudinary-photos${q}`, { timeout: 8000 });
}

/** ---------- Component ---------- */
export default function Portfolio() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedPhoto = selectedIndex !== null && photos[selectedIndex] ? photos[selectedIndex] : null;

  const [showContactForm, setShowContactForm] = useState(false);
  const [buyType, setBuyType] = useState(null);
  const [showDigitalModal, setShowDigitalModal] = useState(false);
  const [digitalPaid, setDigitalPaid] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const categories = [
    { value: "all", label: "All Genres" },
    { value: "landscape", label: "Landscape" },
    { value: "portrait", label: "Portrait" },
    { value: "macro", label: "Macro" },
    { value: "nightscape", label: "NightScape" },
    { value: "street", label: "Street" },
  ];

  // Cloudinary transforms
  const GRID_TR = "f_auto,q_auto:good,dpr_auto,c_fill,g_auto,ar_4:5";
  const GRID_WIDTHS = [320, 480, 640, 960, 1280];
  const DETAIL_TR = "f_auto,q_auto:best,dpr_auto,c_fit";
  const DETAIL_WIDTHS = [768, 1024, 1366, 1600, 1920];

  // Next/Prev
  const hasPhotos = photos && photos.length > 0;
  function nextPhoto() {
    if (!hasPhotos || selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % photos.length);
  }
  function prevPhoto() {
    if (!hasPhotos || selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
  }

  // Keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") { e.preventDefault(); nextPhoto(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prevPhoto(); }
      else if (e.key === "Escape") { e.preventDefault(); setSelectedIndex(null); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, photos]);

  // Fetch images (robust)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const folder = selectedCategory === "all" ? "" : selectedCategory;
        const data = await getApiJson(folder);
        if (!cancelled) {
          if (data?.ok && Array.isArray(data.images)) {
            setPhotos(data.images);
          } else {
            console.error("API error:", data);
            setPhotos([]);
            setApiError(data?.hint || "No images found for this category.");
          }
        }
      } catch (e) {
        console.error("Image fetch failed:", e?.message, e?.data?.hint || "");
        if (!cancelled) {
          setPhotos([]);
          setApiError(e?.data?.hint || "Failed to load images. Check API.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-48 h-12 bg-gray-200 rounded mx-auto mb-6 animate-pulse" />
            <div className="w-64 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const Empty = (
    <div className="text-center py-20">
      <Camera className="w-16 h-16 text-gray-600 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-400 mb-3">No Photos Found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {apiError || (selectedCategory !== "all"
          ? "Try another filter or verify the folder name in Cloudinary."
          : "Upload images to your Cloudinary account to populate this gallery.")}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-yellow-100 rounded-full border border-yellow-300">
            <Camera className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700 font-medium text-sm">Portfolio Gallery</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: "#d4af37" }}>
            My Photography
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A curated collection of my work across Landscape, Portrait, Macro, NightScape, and Street genres.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.value;
            return (
              <Button
                key={category.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={
                  isSelected
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-950 hover:from-yellow-500 hover:to-amber-600"
                    : "border-yellow-200 text-gray-700 hover:bg-yellow-50 hover:border-yellow-400/50"
                }
              >
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Photo Grid */}
        {photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo, i) => {
                const url = photo.image_url;
                const GRID_TR = "f_auto,q_auto:good,dpr_auto,c_fill,g_auto,ar_4:5";
                const GRID_WIDTHS = [320, 480, 640, 960, 1280];
                const gridSrc = withTransform(url, `${GRID_TR},w_640`);
                const gridSrcSet = buildSrcSet(url, GRID_WIDTHS, GRID_TR);
                const gridLqip = lqip(url);

                return (
                  <div
                    key={photo.id || i}
                    className="group relative overflow-hidden rounded-xl bg-yellow-50 aspect-[4/5] cursor-pointer hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl border border-yellow-100"
                    onClick={() => setSelectedIndex(i)}
                  >
                    <div className="w-full h-full relative select-none">
                      <img
                        src={gridSrc}
                        srcSet={gridSrcSet}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        alt={photo.title}
                        className="w-full h-full object-cover pointer-events-none select-none"
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          MozUserSelect: "none",
                          backgroundImage: `url(${gridLqip})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{ cursor: "not-allowed" }}
                        onContextMenu={(e) => e.preventDefault()}
                        onMouseDown={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/40 via-yellow-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-yellow-100/80 backdrop-blur-sm rounded-full p-3 border border-yellow-300">
                        <Eye className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3
                        className="text-lg font-bold mb-1 truncate"
                        style={{
                          color: "#fff",
                          textShadow: "0 0 8px rgba(0,0,0,0.7), 0 0 2px #fff",
                          background: "rgba(0,0,0,0.2)",
                          borderRadius: "0.5em",
                          padding: "0.1em 0.5em",
                          display: "inline-block",
                          maxWidth: "100%",
                        }}
                      >
                        {photo.title}
                      </h3>
                      {photo.location && (
                        <div className="flex items-center text-gray-700 mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="text-xs truncate">{photo.location}</span>
                        </div>
                      )}
                      <div className="inline-flex items-center px-2 py-1 bg-yellow-100 border border-yellow-300 rounded-full">
                        <span className="text-yellow-700 text-xs font-medium uppercase tracking-wider">
                          {photo.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal */}
            {selectedPhoto && (
              <div
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90 group"
                onClick={() => setSelectedIndex(null)}
                style={{ cursor: "zoom-out" }}
              >
                <button
                  className="absolute top-6 right-8 text-white hover:text-yellow-400 text-4xl font-bold z-50 bg-transparent border-none p-0 m-0 shadow-none focus:outline-none"
                  onClick={() => setSelectedIndex(null)}
                  aria-label="Close"
                  style={{ cursor: "pointer", background: "transparent", border: "none", boxShadow: "none", padding: 0, margin: 0 }}
                >
                  ×
                </button>
                {/* Prev / Next (fade in on hover) */}
<button
  className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 rounded-full p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 opacity-0 group-hover:opacity-100 transition focus:opacity-100"
  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
  aria-label="Previous photo"
>
  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
</button>
<button
  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 rounded-full p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 opacity-0 group-hover:opacity-100 transition focus:opacity-100"
  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
  aria-label="Next photo"
>
  <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
</button>

                <div
                  className="flex flex-col items-center justify-center w-full h-full max-h-[90vh] max-w-[90vw] gap-6 p-4 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Large image with full rounded corners */}
                  {(() => {
                    const url = selectedPhoto.image_url;
                    const detailSrc = withTransform(url, `${DETAIL_TR},w_1600`);
                    const detailSrcSet = buildSrcSet(url, DETAIL_WIDTHS, DETAIL_TR);
                    const detailLqip = lqip(url);
                    return (
                      <div className="rounded-xl overflow-hidden bg-black shadow-2xl relative select-none">
                        <img
                          src={detailSrc}
                          srcSet={detailSrcSet}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 60vw"
                          alt={selectedPhoto.title}
                          className="object-contain max-h-[58vh] w-auto bg-black"
                          draggable="false"
                          loading="eager"
                          decoding="async"
                          onContextMenu={(e) => e.preventDefault()}
                          style={{
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            backgroundImage: `url(${detailLqip})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      </div>
                    );
                  })()}

                  {/* Info / Buy panel */}
                  <div className="w-full max-w-3xl text-white space-y-5 bg-black/60 p-6 rounded-lg shadow-xl text-center">
                    <h2 className="text-sm italic font-medium text-yellow-200">
                      {prettyName(selectedPhoto)}
                    </h2>

                    {selectedPhoto.description && (
                      <p className="text-gray-200 leading-relaxed">{selectedPhoto.description}</p>
                    )}

                    {/* Compact, sticky buy buttons */}
                    <div className="flex flex-wrap gap-3 mt-1 sticky top-2 z-10 justify-center">
                      <button
                        className="px-4 py-1.5 text-sm bg-yellow-400 text-gray-950 rounded font-semibold hover:bg-yellow-500 transition-colors"
                        onClick={() => {
                          setBuyType("print");
                          setShowContactForm(true);
                        }}
                      >
                        Buy Print
                      </button>
                      <button
                        className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded font-semibold hover:bg-yellow-100 transition-colors"
                        onClick={() => {
                          setBuyType("digital");
                          setShowDigitalModal(true);
                          setDigitalPaid(false);
                          setShowComingSoon(true);
                        }}
                      >
                        Buy Digital
                      </button>
                    </div>

                    {(selectedPhoto.location || selectedPhoto.camera_settings) && (
                      <div className="space-y-3 pt-3 border-t border-yellow-700/40">
                        {selectedPhoto.location && (
                          <div className="flex items-center text-yellow-200">
                            <MapPin className="w-4 h-4 mr-3 text-yellow-400" />
                            <span>{selectedPhoto.location}</span>
                          </div>
                        )}
                        {selectedPhoto.camera_settings && (
                          <div className="flex items-center text-yellow-200">
                            <Camera className="w-4 h-4 mr-3 text-yellow-400" />
                            <span className="text-sm">{selectedPhoto.camera_settings}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Digital Purchase Modal */}
                {showDigitalModal && selectedPhoto && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => { setShowDigitalModal(false); setShowComingSoon(false); }}>
                    <div className="bg-white rounded-lg max-w-md w-full p-8 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-yellow-400 text-2xl font-bold bg-transparent border-none p-0 m-0 shadow-none focus:outline-none"
                        onClick={() => { setShowDigitalModal(false); setShowComingSoon(false); }}
                        aria-label="Close"
                        style={{ cursor: "pointer", background: "transparent", border: "none", boxShadow: "none", padding: 0, margin: 0 }}
                      >
                        ×
                      </button>
                      {showComingSoon && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50 rounded-lg">
                          <div className="bg-white rounded-lg p-6 shadow-xl text-center max-w-xs mx-auto">
                            <h2 className="text-xl font-bold mb-2 text-yellow-700">Coming Soon</h2>
                            <p className="text-gray-700 mb-2">Download not available yet.</p>
                            <button
                              className="mt-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded"
                              onClick={() => {
                                setShowComingSoon(false);
                                setShowDigitalModal(false);
                              }}
                            >
                              OK
                            </button>
                          </div>
                        </div>
                      )}
                      {/* PayPal modal is still present but visually blocked by the coming soon modal */}
                      {!digitalPaid ? (
                        <div style={{ filter: showComingSoon ? 'blur(2px)' : 'none', pointerEvents: showComingSoon ? 'none' : 'auto' }}>
                          <PayPalScriptProvider options={{ "client-id": "AaEctospHQg3QstuFsifp2s9uJQT1PLlHRCipWigQw5Zk27XOz3vYLBBd-rGYNmfECqMWh0QGz7btyi6", currency: "USD" }}>
                            <h2 className="text-2xl font-bold mb-4 text-yellow-700">Buy Digital Download</h2>
                            <div className="mb-4">
                              <span className="font-semibold text-lg text-gray-800">Price: </span>
                              <span className="text-green-700 font-bold">$10</span>
                            </div>
                            <div className="mb-6 text-gray-600 text-sm">
                              After payment, you'll get instant access to download the highest resolution image.<br />
                              <span className="text-xs text-gray-400">(No watermark/logo on download)</span>
                            </div>
                            <PayPalButtons
                              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [{ amount: { value: "10.00" }, description: `Digital download: ${selectedPhoto.title}` }],
                                });
                              }}
                              onApprove={async (data, actions) => {
                                await actions.order.capture();
                                setDigitalPaid(true);
                              }}
                              onError={() => alert("Payment failed. Please try again or contact me.")}
                            />
                            <div className="text-xs text-gray-400 mt-4 text-center">Payments are processed securely by PayPal.</div>
                          </PayPalScriptProvider>
                        </div>
                      ) : (
                        (() => {
                          const baseUrl = selectedPhoto.image_url;
                          const filename = `SenPicta-${slugify(selectedPhoto.title || selectedPhoto.id || "photo")}`;
                          const downloadUrl = withTransform(baseUrl, `fl_attachment:${filename},f_jpg,q_auto:best,w_3840`);
                          return (
                            <>
                              <h2 className="text-2xl font-bold mb-4 text-yellow-700">Thank you!</h2>
                              <p className="mb-4 text-gray-700">Your high-resolution image is ready.</p>
                              <a
                                href={downloadUrl}
                                className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded transition-colors mb-2"
                              >
                                Download High-Res Image
                              </a>
                              <div className="text-xs text-gray-400 text-center">Having trouble? Contact me via the About page.</div>
                            </>
                          );
                        })()
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Form Modal */}
                {showContactForm && selectedPhoto && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setShowContactForm(false)}>
                    <div className="bg-white rounded-lg max-w-md w-full p-8 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-yellow-400 text-2xl font-bold bg-transparent border-none p-0 m-0 shadow-none focus:outline-none"
                        onClick={() => setShowContactForm(false)}
                        aria-label="Close"
                        style={{ cursor: "pointer", background: "transparent", border: "none", boxShadow: "none", padding: 0, margin: 0 }}
                      >
                        ×
                      </button>
                      <h2 className="text-2xl font-bold mb-4 text-yellow-700">
                        Request {buyType === "print" ? "Print" : "Digital"} Purchase
                      </h2>
                      <form action="https://formspree.io/f/mnqewqzv" method="POST" className="space-y-4">
                        <input type="hidden" name="photo_title" value={selectedPhoto.title} />
                        <input type="hidden" name="photo_id" value={selectedPhoto.id} />
                        <input type="hidden" name="buy_type" value={buyType} />
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Name</label>
                          <input name="name" required className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-yellow-400" />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Email</label>
                          <input name="email" type="email" required className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-yellow-400" />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Message</label>
                          <textarea name="message" rows="3" className="w-full border border-yellow-300 rounded px-3 py-2 focus:outline-yellow-400" placeholder="Let us know your requirements (size, quantity, etc.)" />
                        </div>
                        <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded mt-2">
                          Send Request
                        </button>
                      </form>
                      <div className="text-xs text-gray-400 mt-4 text-center">
                        <span>Payments & instant downloads coming soon!</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          Empty
        )}
      </div>
    </div>
  );
}
