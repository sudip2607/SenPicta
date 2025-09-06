import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Search, MapPin, Camera, Eye } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";


export default function Portfolio() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  // Removed search state

  const categories = [
    { value: "all", label: "All Genres" },
    { value: "landscape", label: "Landscape" },
    { value: "portrait", label: "Portrait" },
    { value: "macro", label: "Macro" },
    { value: "nightscape", label: "NightScape" },
    { value: "street", label: "Street" }
  ];



  useEffect(() => {
    async function fetchCloudinaryImages() {
      setIsLoading(true);
      try {
        const folder = selectedCategory === "all" ? "" : selectedCategory;
        const res = await fetch(`http://localhost:5001/api/cloudinary-photos?folder=${folder}`);
        const data = await res.json();
        setPhotos(data.images || []);
      } catch {
        setPhotos([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCloudinaryImages();
  }, [selectedCategory]);

  // For modal open state
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [buyType, setBuyType] = useState(null); // 'print' or 'digital'
  const [showDigitalModal, setShowDigitalModal] = useState(false);
  const [digitalPaid, setDigitalPaid] = useState(false);

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

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-yellow-100 rounded-full border border-yellow-300">
            <Camera className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700 font-medium text-sm">Portfolio Gallery</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{color:'#d4af37'}}>
            My Photography
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A curated collection of my work across Landscape, Portrait, Macro, NightScape, and Street genres.
          </p>
        </div>

        {/* Filters (genre only) */}
        <div className="mb-12 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.value;
            return (
              <Button
                key={category.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={isSelected
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
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-xl bg-yellow-50 aspect-[4/5] cursor-pointer hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl border border-yellow-100"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="w-full h-full relative select-none">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-full object-cover photo-hover pointer-events-none select-none"
                      draggable="false"
                      onContextMenu={e => e.preventDefault()}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
                    />
                    {/* Overlay to block drag and right-click */}
                    <div
                      className="absolute inset-0 z-10"
                      style={{ cursor: 'not-allowed' }}
                      onContextMenu={e => e.preventDefault()}
                      onMouseDown={e => e.preventDefault()}
                      onDragStart={e => e.preventDefault()}
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
                        color: '#fff',
                        textShadow: '0 0 8px rgba(0,0,0,0.7), 0 0 2px #fff',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '0.5em',
                        padding: '0.1em 0.5em',
                        display: 'inline-block',
                        maxWidth: '100%'
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
              ))}
            </div>
            {/* Custom Modal for selected photo */}
            {selectedPhoto && (
              <div
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90"
                onClick={() => setSelectedPhoto(null)}
                style={{ cursor: 'zoom-out' }}
              >
                <button
                  className="absolute top-6 right-8 text-white hover:text-yellow-400 text-4xl font-bold z-50 bg-transparent border-none p-0 m-0 shadow-none focus:outline-none"
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Close"
                  style={{ cursor: 'pointer', background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, margin: 0 }}
                >
                  ×
                </button>
                <div
                  className="flex flex-col md:flex-row items-center justify-center w-full h-full max-h-[90vh] max-w-[90vw] gap-10"
                  onClick={e => e.stopPropagation()}
                >
                  <img
                    src={selectedPhoto.image_url}
                    alt={selectedPhoto.title}
                    className="object-contain rounded-lg max-h-[80vh] max-w-full bg-black shadow-2xl"
                    draggable="false"
                    onContextMenu={e => e.preventDefault()}
                    style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
                  />
                  <div className="w-full md:w-[400px] text-white space-y-6 bg-black/60 p-6 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 text-yellow-300">{selectedPhoto.title}</h2>
                      <div className="inline-flex items-center px-3 py-1 bg-yellow-100/80 border border-yellow-300 rounded-full mb-4">
                        <span className="text-yellow-700 text-sm font-medium uppercase tracking-wider">
                          {selectedPhoto.category}
                        </span>
                      </div>
                      {selectedPhoto.description && (
                        <p className="text-gray-200 leading-relaxed mt-2">{selectedPhoto.description}</p>
                      )}
                      <div className="flex gap-4 mt-8">
                        <button
                          className="px-6 py-2 bg-yellow-400 text-gray-950 rounded font-semibold hover:bg-yellow-500 transition-colors"
                          onClick={() => { setBuyType('print'); setShowContactForm(true); }}
                        >
                          Buy Print
                        </button>
                        <button
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-yellow-100 transition-colors"
                          onClick={() => { setBuyType('digital'); setShowDigitalModal(true); setDigitalPaid(false); }}
                        >
                          Buy Digital
                        </button>
            {/* Digital Purchase Modal with PayPal Checkout */}
            {showDigitalModal && selectedPhoto && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setShowDigitalModal(false)}>
                <div className="bg-white rounded-lg max-w-md w-full p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-yellow-400 text-2xl font-bold bg-transparent border-none p-0 m-0 shadow-none focus:outline-none"
                    onClick={() => setShowDigitalModal(false)}
                    aria-label="Close"
                    style={{ cursor: 'pointer', background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, margin: 0 }}
                  >
                    ×
                  </button>
                  {!digitalPaid ? (
                    <PayPalScriptProvider options={{ "client-id": "AaEctospHQg3QstuFsifp2s9uJQT1PLlHRCipWigQw5Zk27XOz3vYLBBd-rGYNmfECqMWh0QGz7btyi6", currency: "USD" }}>
                      <h2 className="text-2xl font-bold mb-4 text-yellow-700">Buy Digital Download</h2>
                      <div className="mb-4">
                        <span className="font-semibold text-lg text-gray-800">Price: </span>
                        <span className="text-green-700 font-bold">$10</span>
                      </div>
                      <div className="mb-6 text-gray-600 text-sm">
                        After payment, you'll get instant access to download the highest resolution image.<br/>
                        <span className="text-xs text-gray-400">(No watermark/logo on download)</span>
                      </div>
                      <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: "10.00",
                                },
                                description: `Digital download: ${selectedPhoto.title}`,
                              },
                            ],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          await actions.order.capture();
                          setDigitalPaid(true);
                        }}
                        onError={() => alert("Payment failed. Please try again or contact me.")}
                      />
                      <div className="text-xs text-gray-400 mt-4 text-center">
                        Payments are processed securely by PayPal.
                      </div>
                    </PayPalScriptProvider>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-4 text-yellow-700">Thank you!</h2>
                      <p className="mb-4 text-gray-700">Thanks for buying me a coffee, I owe you one.</p>
                      <a
                        href={selectedPhoto.image_url}
                        download
                        className="block w-full text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded transition-colors mb-2"
                      >
                        Download High-Res Image
                      </a>
                      <div className="text-xs text-gray-400 text-center">If you have any issues, contact me via the About page.</div>
                    </>
                  )}
                </div>
              </div>
            )}
                      </div>
                    </div>
                    {(selectedPhoto.location || selectedPhoto.camera_settings) && (
                      <div className="space-y-3 pt-4 border-t border-yellow-700/40">
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
              </div>
            )}

            {/* Contact Form Modal */}
            {showContactForm && selectedPhoto && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setShowContactForm(false)}>
                <div className="bg-white rounded-lg max-w-md w-full p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-yellow-400 text-2xl font-bold bg-transparent border-none p-0 m-0 shadow-none focus:outline-none"
                    onClick={() => setShowContactForm(false)}
                    aria-label="Close"
                    style={{ cursor: 'pointer', background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, margin: 0 }}
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-bold mb-4 text-yellow-700">Request {buyType === 'print' ? 'Print' : 'Digital'} Purchase</h2>
                  <form
                    action="https://formspree.io/f/mnqewqzv" // Replace with your Formspree form ID
                    method="POST"
                    className="space-y-4"
                  >
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
                    <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded mt-2">Send Request</button>
                  </form>
                  <div className="text-xs text-gray-400 mt-4 text-center">
                    <span>Payments & instant downloads coming soon!</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400 mb-4">No Photos Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedCategory !== "all"
                ? "Try adjusting your filter criteria."
                : "The portfolio is being updated. Check back soon for amazing photography!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
