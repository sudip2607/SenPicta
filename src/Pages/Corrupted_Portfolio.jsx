import React, { useState, useEffect, useRef } from "react";
import { MapPin, Camera } from "lucide-react";
import PhotoSwipe from 'photoswipe';
import 'photoswipe/dist/photoswipe.css';
import '../styles/portfolio.css';

// Utility to get the Google Drive preview URL for iframe embedding
const getDrivePreviewUrl = (photo) => {
  if (photo.id) return `https://drive.google.com/file/d/${photo.id}/preview`;
  return '';
};

// Utility to get the Google Drive direct view URL (better for embedding)
const getDriveImageUrl = (photo) => {
  if (photo.id) return `https://drive.google.com/uc?export=view&id=${photo.id}`;
  return '';
};

const categories = [
  { value: "all", label: "All Genres" },
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
  { value: "macro", label: "Macro" },
  { value: "nightscape", label: "NightScape" },
  { value: "street", label: "Street" }
];

export default function Portfolio() {
  const pswpRef = useRef(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch all images once on mount
  useEffect(() => {
    async function fetchAllImages() {
      setIsLoading(true);
      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbyOMkW59uGCgVuGJ5zF7e0z1jRr-8FH_BRY4QjCmQrTW_7M9P-B4S4CNM5WtkXALil7dg/exec?genre=all");
        const data = await res.json();
        setAllPhotos(Array.isArray(data) ? data : (data.images || []));
      } catch (error) {
        console.error('Error fetching images:', error);
        setAllPhotos([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllImages();
  }, []);

  // Filter images in React when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setPhotos(allPhotos);
    } else {
      setPhotos(allPhotos.filter(photo => 
        (photo.category || photo.genre || "").toLowerCase() === selectedCategory
      ));
    }
  }, [selectedCategory, allPhotos]);

  const openPhotoSwipe = (index) => {
    const items = photos.map(photo => ({
      src: getDriveImageUrl(photo),
      w: 1920,
      h: 1080,
      title: photo.title,
      description: photo.description,
      location: photo.location,
      camera_settings: photo.camera_settings
    }));

    const options = {
      index,
      bgOpacity: 0.9,
      showHideOpacity: true,
      history: false,
      preload: [1, 2],
      showAnimationDuration: 333,
      hideAnimationDuration: 333,
      closeOnScroll: false,
      clickToCloseNonZoomable: false,
      indexIndicatorSep: ' / ',
      captionEl: true,
      fullscreenEl: true,
      zoomEl: true,
      shareEl: false,
      getDoubleTapZoom: function() {
        return 1.5;
      },
      addCaptionHTMLFn: function(item, captionEl) {
        if(!item.title && !item.description) {
          captionEl.children[0].innerHTML = '';
          return false;
        }
        let caption = '';
        if (item.title) {
          caption += `<h3 class="photo-title">${item.title}</h3>`;
        }
        if (item.description) {
          caption += `<p class="photo-description">${item.description}</p>`;
        }
        if (item.location || item.camera_settings) {
          caption += '<div class="photo-info">';
          if (item.location) {
            caption += `
              <div class="photo-meta">
                <strong>Location</strong>
                ${item.location}
              </div>`;
          }
          if (item.camera_settings) {
            caption += `
              <div class="photo-meta">
                <strong>Camera Settings</strong>
                ${item.camera_settings}
              </div>`;
          }
          caption += '</div>';
        }
        captionEl.children[0].innerHTML = caption;
        return true;
      }
    };

    pswpRef.current = new PhotoSwipe(document.querySelector('.pswp'), null, items, options);
    pswpRef.current.init();
  };

  if (isLoading) {
    return (
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h1 className="text-4xl md:text-5xl font-light mb-4">Loading Gallery...</h1>
        </div>
        <div className="gallery-grid">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 p-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="gallery-item mb-4 animate-pulse bg-gray-800" style={{height: '300px'}} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h1 className="text-4xl md:text-5xl font-light mb-4">
          Photography Portfolio
        </h1>
        <p className="text-lg text-gray-400">
          Capturing moments across the world
        </p>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`category-button ${selectedCategory === category.value ? 'active' : ''}`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Masonry Gallery */}
      {photos.length > 0 ? (
        <div className="gallery-grid loaded">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 p-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="gallery-item mb-4"
                onClick={() => openPhotoSwipe(index)}
              >
                <img
                  src={getDriveImageUrl(photo)}
                  alt={photo.title}
                  className="w-full h-auto"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = getDrivePreviewUrl(photo);
                  }}
                />
                <div className="gallery-item-overlay">
                  <h3 className="photo-title">{photo.title}</h3>
                  {photo.location && (
                    <div className="photo-location">
                      <MapPin className="w-4 h-4" />
                      <span>{photo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-light text-gray-200 mb-4">No Photos Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {selectedCategory !== "all"
              ? "Try adjusting your filter criteria."
              : "The portfolio is being updated. Check back soon."}
          </p>
        </div>
      )}

      {/* PhotoSwipe Template */}
      <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="pswp__bg"></div>
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter"></div>
              <button className="pswp__button pswp__button--close" title="Close (Esc)"></button>
              <button className="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
              <button className="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut"></div>
                  </div>
                </div>
              </div>
            </div>
            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
            <div className="pswp__caption">
              <div className="pswp__caption__center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
