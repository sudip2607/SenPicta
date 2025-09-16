import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Mail, Phone, MapPin, Instagram, Clock, Send, CheckCircle } from "lucide-react";
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };

    emailjs.send('service_qr3zwqb', 'template_0ou2fp6', templateParams, 'BuUgtbhAo2xfocmrZ')
      .then((result) => {
        setIsSubmitted(true);
      }, (error) => {
        console.error("Error sending email:", error);
        alert("There was an error sending your message. Please try again or contact directly.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Message Sent!</h1>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Thank you for reaching out! I'll get back to you within 24 hours to discuss your photography needs.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                phone: "",
                event_date: "",
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
    <section className="min-h-screen bg-white py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: "#d4af37" }}>Contact</h1>
      <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
        Ready to capture your special moments? I'd love to hear about your vision and discuss how we can bring it to life together.
      </p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-yellow-50 rounded-lg p-8 shadow-lg flex flex-col gap-6 border border-yellow-100">
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
      </form>
      <div className="flex justify-center space-x-8 mt-10">
        <a href="mailto:elena@example.com" className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2">
          <Mail className="w-5 h-5" /> Email
        </a>
        <a href="tel:+1234567890" className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2">
          <Phone className="w-5 h-5" /> Call
        </a>
        <a href="#" className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2">
          <Instagram className="w-5 h-5" /> Instagram
        </a>
      </div>
      <div className="flex justify-center items-center gap-4 mt-8 text-gray-500">
        <MapPin className="w-5 h-5" /> New York, NY
        <Clock className="w-5 h-5" /> Mon-Fri 9am-6pm
      </div>
    </section>
  );
}