import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Mail, Phone, MapPin, Instagram, Clock, Send, CheckCircle } from "lucide-react";
import { SendEmail } from "../integrations/Core";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    event_date: "",
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

    try {
      await SendEmail({
        to: "elena@example.com",
        subject: `New Photography Inquiry from ${formData.name}`,
        body: `
New photography inquiry:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service Interest: ${formData.service}
Event Date: ${formData.event_date || 'Not specified'}

Message:
${formData.message}
        `
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("There was an error sending your message. Please try again or contact directly.");
    }
    
    setIsSubmitting(false);
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
                service: "",
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
    <section className="bg-gray-950 min-h-[80vh] px-4 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">Contact</h1>
      <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
        Ready to capture your special moments? I'd love to hear about your vision and discuss how we can bring it to life together.
      </p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-900 rounded-lg p-8 shadow-lg flex flex-col gap-6">
        <div>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Your Name"
            className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400"
          />
        </div>
        <div>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Your Email"
            className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400"
          />
        </div>
        <div>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400"
          />
        </div>
        <div>
          <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
            <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="wedding">Wedding Photography</SelectItem>
              <SelectItem value="portrait">Portrait Session</SelectItem>
              <SelectItem value="family">Family Photography</SelectItem>
              <SelectItem value="commercial">Commercial Photography</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date}
            onChange={(e) => handleInputChange('event_date', e.target.value)}
            className="w-full bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400"
          />
        </div>
        <div>
          <Textarea
            id="message"
            required
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Tell me about your vision"
            className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 h-32 resize-none"
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
        <a href="mailto:elena@example.com" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
          <Mail className="w-5 h-5" /> Email
        </a>
        <a href="tel:+1234567890" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
          <Phone className="w-5 h-5" /> Call
        </a>
        <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2">
          <Instagram className="w-5 h-5" /> Instagram
        </a>
      </div>
      <div className="flex justify-center items-center gap-4 mt-8 text-gray-400">
        <MapPin className="w-5 h-5" /> New York, NY
        <Clock className="w-5 h-5" /> Mon-Fri 9am-6pm
      </div>
    </section>
  );
}