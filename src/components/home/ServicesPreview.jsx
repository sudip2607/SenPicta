import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "../../components/ui/button";
import { Heart, Users, Building, User, ArrowRight } from "lucide-react";

export default function ServicesPreview() {
  const services = [
    {
      icon: Heart,
      title: "Wedding Photography",
      description: "Capturing your most precious day with romantic elegance and timeless beauty.",
      features: ["Full day coverage", "Engagement session", "Online gallery", "Print release"],
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: User,
      title: "Portrait Sessions",
      description: "Professional portraits that showcase your personality and individual style.",
      features: ["Studio or location", "Wardrobe consultation", "Professional retouching", "Multiple looks"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Building,
      title: "Commercial Photography",
      description: "High-quality imagery that elevates your brand and tells your business story.",
      features: ["Product photography", "Corporate headshots", "Brand storytelling", "Usage rights"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Users,
      title: "Family Photography",
      description: "Warm, natural family portraits that celebrate your unique connections.",
      features: ["Lifestyle sessions", "Extended family", "Pet-friendly", "Natural settings"],
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 to-gray-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-6 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span className="text-yellow-400 font-medium text-sm">Photography Services</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-6 leading-tight">
            What I Offer
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From intimate moments to grand celebrations, I provide comprehensive photography 
            services tailored to your unique vision and needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-3 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="pt-4 border-t border-gray-700 group-hover:border-yellow-400/30 transition-colors">
                <Button variant="ghost" className="text-yellow-400 hover:bg-yellow-400/10 p-0 group/btn">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to={createPageUrl("Services")}>
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-950 font-semibold px-8 py-4 text-lg rounded-lg transition-all duration-300 hover:scale-105">
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}