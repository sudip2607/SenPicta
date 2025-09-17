// SenPicta - Final Version V2.0
// Released: September 16, 2025

import React from "react";
import { Camera, Heart, Star, Users } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Photography isn't just my job—it's my passion. I pour my heart into every shot."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "I strive for perfection in every detail, ensuring each photo tells a beautiful story."
    },
    {
      icon: Users,
      title: "Connection",
      description: "Building genuine connections with my clients creates authentic, meaningful photographs."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* About SenPicta Hero Section */}
      <section className="relative py-20 min-h-[500px] flex items-center justify-center bg-cover bg-center">
        <picture>
          <source srcSet="/my-family-photo.avif" type="image/avif" />
          <source srcSet="/my-family-photo.webp" type="image/webp" />
          <img
            src="/my-family-photo.jpg"
            alt="Sudip Sen - Photographer"
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
            style={{ minHeight: '500px' }}
            aria-hidden="true"
            loading="eager"
          />
        </picture>
        <div className="absolute inset-0 bg-black/15" aria-hidden="true"></div>
        <div className="relative z-10 flex justify-end w-full px-6">
          <div className="bg-white/60 rounded-2xl shadow-2xl p-8 md:p-12 text-left backdrop-blur-md max-w-2xl w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-right">Welcome to SenPicta</h1>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-justify">
                Hi, I’m <span className="font-semibold">Sudip Sen</span> — a husband, proud father, and the storyteller behind <span className="font-semibold">SenPicta</span>. While family grounds me, photography fuels my soul.<br/>
              </p>
              <p className="text-justify">
                For me, the camera isn’t just a tool — it’s a way to freeze fleeting moments, uncover hidden beauty, and share emotions that words often can’t. Whether I’m capturing the quiet poetry of a landscape, the intimacy of a portrait, the wonder of tiny details in macro, or the energy of the streets at night, each frame is a chapter of my journey.
              </p>
              <p className="text-justify">
                <span className="font-semibold">SenPicta</span> is more than a portfolio — it’s a collection of stories told through light and shadow. My dream is to inspire others, connect with fellow creators, and build a community where art and passion meet.
              </p>
              <p className="text-justify">
                Thank you for stopping by and supporting my work. Whether you choose to buy a print, download a digital copy, or simply share a kind word, you become a part of my journey & stories. Together, we can celebrate the beauty of life, one frame at a time.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-700 mb-4">
              My Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide my work and define my approach to photography
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-amber-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-yellow-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}