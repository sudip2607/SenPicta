import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Camera, Menu, X, Instagram, Mail, Phone, Facebook } from "lucide-react";
import { Button } from "./components/ui/button";

// Configurable logo path
const logoSrc = "/logo.png"; // Place your logo file in public/logo.png

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    { name: "Home", path: createPageUrl("Home") },
    { name: "Portfolio", path: createPageUrl("Portfolio") },
    { name: "About SenPicta", path: createPageUrl("About") },
    { name: "Services", path: createPageUrl("Services") },
    { name: "Contact", path: createPageUrl("Contact") }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3 group">
              <img src={logoSrc} alt="SenPicta Logo" className="w-20 h-20 rounded-lg object-contain" />
              <img src="/SenPicta-Logo-Layered.png" alt="SenPicta Logo" className="h-10 w-auto object-contain" />
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link text-sm font-medium transition-all duration-300 hover:text-yellow-500 ${isActive(item.path) ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-700"}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Social Links */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="https://www.instagram.com/senpicta.visuals/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/ctrl.o" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:sudip2607@icloud.com" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+17322733347" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-6 py-6 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-lg font-medium transition-colors ${isActive(item.path) ? "text-yellow-500" : "text-gray-700 hover:text-yellow-500"}`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 flex space-x-6">
                <a href="https://www.instagram.com/senpicta.visuals/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/ctrl.o" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="mailto:sudip2607@icloud.com" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="tel:+17322733347" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  <Phone className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
      <main className="pt-20 bg-white min-h-[80vh]">
        {children}
      </main>
      <footer className="bg-yellow-50 border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img src={logoSrc} alt="SenPicta Logo" className="w-8 h-8 rounded-lg object-contain" />
            <span className="text-lg font-bold" style={{color:'#d4af37'}}>SenPicta Visuals</span>
          </div>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Landscape, Portrait, Macro, NightScape, and Street Photography. Prints and digital downloads are not available for purchase.
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://www.instagram.com/senpicta.visuals/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/ctrl.o" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="mailto:sudip2607@icloud.com" className="text-gray-400 hover:text-yellow-500 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="tel:+17322733347" className="text-gray-400 hover:text-yellow-500 transition-colors">
              <Phone className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 SenPicta. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}