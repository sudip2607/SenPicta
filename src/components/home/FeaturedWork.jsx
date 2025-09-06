import React, { useState, useEffect } from "react";
import { Photo } from "../../entities/Photo";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "../../components/ui/button";
import { ArrowRight, MapPin, Camera } from "lucide-react";

export default function FeaturedWork() {
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedPhotos();
  }, []);

  const loadFeaturedPhotos = async () => {
    try {
      const photos = await Photo.filter({ featured: true }, '-created_date', 6);
      setFeaturedPhotos(photos);
    } catch (error) {
      console.error("Error loading featured photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-32 h-8 bg-gray-800 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-12 bg-gray-800 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20">
            <Camera className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-sm">Featured Work</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-6 leading-tight">
            Recent Highlights
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A curated selection of my latest work showcasing diverse styles and moments
          </p>
        </div>

        {featuredPhotos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-xl bg-gray-800 aspect-[4/5] hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover photo-hover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-bold text-white mb-2">{photo.title}</h3>
                    {photo.location && (
                      <div className="flex items-center text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{photo.location}</span>
                      </div>
                    )}
                    <div className="inline-flex items-center px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                      <span className="text-yellow-400 text-xs font-medium uppercase tracking-wider">
                        {photo.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to={createPageUrl("Portfolio")}>
                <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-950 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:scale-105">
                  View Full Portfolio
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400 mb-4">Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Featured work will be showcased here. Check back soon for the latest photography highlights.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}