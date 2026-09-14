import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import API from "../services/api";

export function AboutPage() {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 mb-12 text-center overflow-hidden shadow-xl rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1920&q=80"
          alt="About Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/40 to-slate-950/60"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold text-teal-300 tracking-widest bg-slate-900/60 px-4 py-1.5 rounded-full border border-teal-400/30 inline-block backdrop-blur-md shadow-md">Our Journey & Mission</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-outfit text-white drop-shadow-lg tracking-tight">About Azure Horizons</h1>
          <p className="text-slate-100 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed drop-shadow">
            Crafting bespoke travel experiences and unforgettable adventures with local experts since 2014.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-slate-700">
            <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">Who We Are</h2>
            <p className="text-sm leading-relaxed">
              Founded over a decade ago, Azure Horizons is a premier travel agency headquartered in India. We connect passionate travelers with pristine landscapes, heritage forts, tropical beaches, and serene mountain retreats.
            </p>
            <p className="text-sm leading-relaxed">
              Our team of dedicated travel experts ensures every detail — from luxury resort stays and private AC vehicles to local culinary tours and permits — is effortlessly organized.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80"
              alt="About Travel Agency"
              className="rounded-3xl shadow-xl border border-slate-200"
            />
          </div>
        </div>

        <div className="bg-navy-900 text-white rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-xl">
          <div>
            <span className="text-4xl font-black text-teal-400 font-outfit block">500+</span>
            <span className="text-xs text-slate-300 font-semibold uppercase mt-1 block">Happy Travelers</span>
          </div>
          <div>
            <span className="text-4xl font-black text-sunset-400 font-outfit block">50+</span>
            <span className="text-xs text-slate-300 font-semibold uppercase mt-1 block">Active Tour Packages</span>
          </div>
          <div>
            <span className="text-4xl font-black text-emerald-400 font-outfit block">20+</span>
            <span className="text-xs text-slate-300 font-semibold uppercase mt-1 block">Destinations Covered</span>
          </div>
          <div>
            <span className="text-4xl font-black text-amber-400 font-outfit block">100%</span>
            <span className="text-xs text-slate-300 font-semibold uppercase mt-1 block">Tailor-Made Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/bookings", {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        tourName: "General Contact Enquiry",
        message: formData.message,
        travelers: 1
      });
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 mb-12 text-center overflow-hidden shadow-xl rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1920&q=80"
          alt="Contact Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/40 to-slate-950/60"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold text-teal-300 tracking-widest bg-slate-900/60 px-4 py-1.5 rounded-full border border-teal-400/30 inline-block backdrop-blur-md shadow-md">Get In Touch</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-outfit text-white drop-shadow-lg tracking-tight">Contact Our Travel Team</h1>
          <p className="text-slate-100 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed drop-shadow">
            Have questions about a tour package or need a customized travel itinerary? We are here to help 24/7.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-outfit">Office Address</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{settings.address}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sunset-500/10 text-sunset-600 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-outfit">Phone & Hotline</h4>
              <p className="text-xs text-slate-600 mt-1 font-semibold">{settings.phone}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-outfit">Email Support</h4>
              <p className="text-xs text-slate-600 mt-1 font-semibold">{settings.email}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base font-outfit">Business Hours</h4>
              <p className="text-xs text-slate-600 mt-1">{settings.businessHours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Send Us a Message</h3>
          <p className="text-xs text-slate-500 mb-6">Fill out the form below and our trip expert will get back to you within 2 hours.</p>

          {submitted ? (
            <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-xl font-bold font-outfit">Message Sent!</h4>
              <p className="text-xs text-slate-600">Thank you for reaching out. We will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl">{error}</p>}
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="How can we assist your travel plans?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : (
                  <>
                    <Send className="w-4 h-4" /> Send Enquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
