import React from "react";
import { Star, Quote } from "lucide-react";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah & Michael Johnson",
      role: "Wedding Clients",
      image: "https://images.unsplash.com/photo-1494790108755-2616c6e3e3c2?w=150&h=150&fit=crop&crop=face",
      content: "Elena captured our wedding day perfectly. Her attention to detail and ability to make us feel comfortable was incredible. The photos are absolutely stunning!",
      rating: 5
    },
    {
      name: "Jessica Chen",
      role: "Family Portrait Session",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Working with Elena was such a joy. She made our family feel so natural and relaxed during the shoot. We treasure these photos forever.",
      rating: 5
    },
    {
      name: "David Martinez",
      role: "Corporate Headshots",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "Professional, creative, and efficient. Elena delivered exactly what we needed for our company rebrand. Highly recommend for any business photography needs.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-800 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-amber-500/5" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-sm">Client Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-6 leading-tight">
            What Clients Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't just take my word for it - hear from the amazing people I've had the privilege to work with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl p-8 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 backdrop-blur-sm relative group"
            >
              <Quote className="w-8 h-8 text-yellow-400/30 mb-6 group-hover:text-yellow-400/50 transition-colors" />
              
              <p className="text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-1 mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                />
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}