import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { ArrowRight, Camera, Mountain, User, Search, Moon, Map } from "lucide-react";

const genres = [
  {
    name: "Landscape",
    desc: "Vast vistas, mountains, and nature's beauty.",
    folder: "landscape"
  },
  {
    name: "Portrait",
    desc: "Expressive faces and personalities.",
    folder: "portrait"
  },
  {
    name: "Macro",
    desc: "Tiny wonders and close-up details.",
    folder: "macro"
  },
  {
    name: "NightScape",
    desc: "Stars, city lights, and the magic of night.",
    folder: "nightscape"
  },
  {
    name: "Street",
    desc: "Candid moments and urban stories.",
    folder: "street"
  }
];


// Helper: get image paths for a genre (assuming 5 images per genre, can be adjusted)
function getGenreImages(folder, count = 5) {
  return Array.from({ length: count }, (_, i) => `/titles/${folder}/${folder}${(i+1).toString().padStart(4, "0")}.jpg`);
}

function getGenreIcon(genreName) {
  switch (genreName.toLowerCase()) {
    case "landscape":
      return Mountain;
    case "portrait":
      return User;
    case "macro":
      return Search;
    case "nightscape":
      return Moon;
    case "street":
      return Map;
    default:
      return Camera;
  }
}

function GenreTile({ genre }) {
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const images = getGenreImages(genre.folder, 5); // adjust count if needed
  const Icon = getGenreIcon(genre.name);

  useEffect(() => {
    if (!hovered) {
      setImgIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % images.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [hovered, images.length]);

  return (
    <Link
      to={createPageUrl("Portfolio") + `?genre=${encodeURIComponent(genre.name)}`}
      className="group bg-yellow-50 rounded-lg shadow-lg w-64 h-64 flex flex-col items-center border border-yellow-100 transition-transform duration-300 hover:scale-105 hover:border-yellow-400 cursor-pointer relative overflow-hidden p-0"
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <Icon className={`w-10 h-10 text-yellow-400 mb-2 z-10 transition-all duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`} />
        <span className={`font-semibold mb-1 text-lg z-10 transition-all duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`} style={{color:'#222'}}>{genre.name}</span>
        <span
          className={`text-gray-600 text-sm mb-4 text-center z-10 transition-all duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
          style={{ display: 'block', minHeight: '2.5em', lineHeight: '1.25em', overflow: 'hidden' }}
        >
          {genre.desc}
        </span>
        {/* Slideshow image overlay covers full tile */}
        <img
          src={images[imgIdx]}
          alt={genre.name + " sample"}
          className={`absolute left-0 top-0 w-full h-full object-cover rounded-lg transition-opacity duration-500 z-0 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ pointerEvents: 'none' }}
        />
        <span className={`absolute bottom-2 left-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full transition-opacity duration-300 z-10 ${hovered ? 'opacity-100' : 'opacity-0'}`}>Latest Highlight</span>
      </div>
    </Link>
  );
}
export default function Home() {
  return (
    <section className="bg-white min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mt-16 mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{color:'#d4af37'}}>SenPicta Visuals</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{color:'#d4af37'}}>Stories in Lights and Shadows</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          Welcome Beautiful! I am Sudip Sen and I am passionate about Landscape, Portrait, Macro, NightScape, and Street Photography. Explore my work, buy me a coffee if you enjoyed it, and <b>help me grow as an artist</b>.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <Link to={createPageUrl("Portfolio")}> <Button>View Portfolio <ArrowRight className="inline ml-2 w-4 h-4" /></Button> </Link>
          <Link to={createPageUrl("Contact")}> <Button className="bg-yellow-400 text-gray-950 hover:bg-yellow-500">Contact Me</Button> </Link>
        </div>
      </div>
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4" style={{color:'#d4af37'}}>Genres I Love</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {genres.map((genre, idx) => (
            <GenreTile key={idx} genre={genre} />
          ))}
        </div>
      </div>
    </section>
  );
}