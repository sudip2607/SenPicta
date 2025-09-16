import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Mail, Phone, MapPin, Instagram, Clock, Send, CheckCircle } from "lucide-react";
import emailjs from "emailjs-com";

// EmailJS integration will be added for sending emails

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const adminParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };
    const userParams = {
      from_name: formData.name,
      from_email: formData.email,
    };

    setErrorMsg("");
    emailjs.send('service_qr3zwqb', 'template_0ou2fp6', adminParams, 'BuUgtbhAo2xfocmrZ')
      .then((adminResult) => {
        console.log("Admin notification sent:", adminResult);
        // After admin notification, send auto-reply
        return emailjs.send('service_qr3zwqb', 'template_i3ro9im', userParams, 'BuUgtbhAo2xfocmrZ');
      })
      .then((userResult) => {
        console.log("Auto-reply sent:", userResult);
        setIsSubmitted(true);
      })
      .catch((error) => {
        setErrorMsg("There was an error sending your message. Please try again or contact directly.");
        console.error("Error sending email:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h1>
          <p className="text-gray-700 mb-8 leading-relaxed">
            Thank you for reaching out! I'll get back to you within 
            three (3) business days to discuss your photography needs.
          </p>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6 text-left">
            <div className="mb-2"><span className="font-semibold text-gray-700">Your message:</span></div>
            <div className="text-gray-800 whitespace-pre-line">{formData.message}</div>
          </div>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                message: ""
              });
            }}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white py-16 px-2 md:px-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-2 md:mb-6" style={{ color: "#d4af37" }}>Contact</h1>
      <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8 md:mb-12">
        Ready to capture your special moments? I'd love to hear about your vision and discuss how we can bring it to life together.
      </p>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-12 items-stretch justify-center">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="flex-1 bg-yellow-50 rounded-lg p-6 md:p-8 shadow-lg flex flex-col gap-6 border border-yellow-100 max-w-lg mx-auto md:mx-0">
          <div className="text-left">
            <Label htmlFor="name" className="mb-1 block text-gray-700 font-medium">Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your Name"
              className="w-full bg-white border-yellow-200 text-gray-800 focus:border-yellow-400"
            />
          </div>
          <div className="text-left">
            <Label htmlFor="email" className="mb-1 block text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Your Email"
              className="w-full bg-white border-yellow-200 text-gray-800 focus:border-yellow-400"
            />
          </div>
          <div className="text-left">
            <Label htmlFor="phone" className="mb-1 block text-gray-700 font-medium">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full bg-white border-yellow-200 text-gray-800 focus:border-yellow-400"
            />
          </div>
          <div>
            <Textarea
              id="message"
              required
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell me about your vision"
              className="w-full bg-white border-yellow-200 text-gray-800 placeholder:text-gray-400 focus:border-yellow-400 h-32 resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-gray-950 font-semibold py-4 text-lg rounded-lg transition-all duration-300 hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-950 mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </Button>
          {errorMsg && (
            <div className="text-red-600 mt-3 text-sm">{errorMsg}</div>
          )}
          <div className="flex justify-center space-x-8 mt-8">
            <a href="mailto:sudip2607@icloud.com" className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" /> Email
            </a>
            <a href="tel:+17322733347" className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2">
              <Phone className="w-5 h-5" /> Call
            </a>
            <a href="https://www.instagram.com/senpicta.visuals/" className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2">
              <Instagram className="w-5 h-5" /> Instagram
            </a>
          </div>
        </form>
        {/* Support My Work Section */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg p-6 md:p-8 shadow-lg border border-yellow-100 max-w-lg mx-auto md:mx-0">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Support My Work</h2>
          <p className="text-gray-600 mb-4">If you enjoyed my work, you can buy me a coffee or lunch!<br/>Scan the QR code below or click the button.</p>
          <img src="/paypal-qr.png" alt="PayPal QR Code" className="w-56 h-56 rounded-lg shadow mb-4 border border-yellow-200 bg-white object-contain" />
          <a
            href="https://paypal.me/dip2607"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 mt-2"
          >
            Buy me a coffee or lunch
          </a>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mt-8 text-gray-500">
        <MapPin className="w-5 h-5" /> New Jersey, NJ
        <Clock className="w-5 h-5" /> Mon-Fri 4pm-8pm
      </div>
    </section>
  );
}