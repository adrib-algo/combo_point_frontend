import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Clock, CheckCircle2, XCircle, Users, MessageCircle, AlertCircle, Sparkles, ChevronRight } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function TourDetailsModal({ tour, onClose, onOpenBookingModal }) {
  if (!tour) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("overview"); // overview, itinerary, inclusions
  const { settings } = useSettings();

  const isExpired = tour.lastBookingDate ? new Date() > new Date(tour.lastBookingDate) : false;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleWhatsAppBooking = () => {
    const rawNumber = settings.whatsapp || "+919876543210";
    const cleanNumber = rawNumber.replace(/[^0-9]/g, "");
    const msg = `Hello, I want to book the tour: "${tour.title}" (${tour.duration}). Price: ₹${tour.price}. Please share booking procedures.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const images = tour.images && tour.images.length > 0
    ? tour.images
    : ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col max-h-[90vh] my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Hero / Gallery Header */}
          <div className="relative h-64 sm:h-80 w-full bg-slate-900 flex-shrink-0">
            <img
              src={images[activeImageIdx]}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

            {/* Thumbnail Selector Overlay */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 z-20 flex gap-2 overflow-x-auto max-w-[70%] p-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIdx === idx ? "border-teal-400 scale-105" : "border-white/40 opacity-70"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Price Header */}
            <div className="absolute bottom-4 right-4 sm:right-6 text-right z-20">
              <span className="text-xs uppercase font-bold text-teal-400">Total Package Price</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
                ₹{tour.price?.toLocaleString("en-IN")}
                <span className="text-xs font-normal text-slate-300"> / person</span>
              </div>
            </div>

            <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
              <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {tour.duration}
              </span>
              {tour.featured && (
                <span className="bg-sunset-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Announcement
                </span>
              )}
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="bg-navy-900 text-white px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Destination</p>
                <p className="font-semibold">{tour.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Trip Starts</p>
                <p className="font-semibold">{formatDate(tour.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Last Booking Date</p>
                <p className="font-semibold">{formatDate(tour.lastBookingDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Max Group Size</p>
                <p className="font-semibold">{tour.maxTravelers || 20} Persons</p>
              </div>
            </div>
          </div>

          {/* Modal Content Tabs & Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 gap-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-2 text-sm font-bold transition-all ${
                  activeTab === "overview" ? "border-b-2 border-teal-500 text-teal-600" : "text-slate-500"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("itinerary")}
                className={`pb-2 text-sm font-bold transition-all ${
                  activeTab === "itinerary" ? "border-b-2 border-teal-500 text-teal-600" : "text-slate-500"
                }`}
              >
                Day Wise Itinerary ({tour.itinerary?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("inclusions")}
                className={`pb-2 text-sm font-bold transition-all ${
                  activeTab === "inclusions" ? "border-b-2 border-teal-500 text-teal-600" : "text-slate-500"
                }`}
              >
                Inclusions & Exclusions
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <h2 className="text-xl font-bold text-slate-900 font-outfit">{tour.title}</h2>
                <p className="text-sm text-slate-600">{tour.description}</p>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Important Travel Notice</h4>
                  <p className="text-xs text-slate-600">
                    Advance booking is required to secure luxury resort accommodation and transport permits. Please confirm before the last booking date ({formatDate(tour.lastBookingDate)}).
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Itinerary */}
            {activeTab === "itinerary" && (
              <div className="space-y-4">
                {tour.itinerary && tour.itinerary.length > 0 ? (
                  tour.itinerary.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                        Day {item.day || idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">Detailed itinerary available upon enquiry.</p>
                )}
              </div>
            )}

            {/* Tab: Inclusions & Exclusions */}
            {activeTab === "inclusions" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What's Included
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {tour.included && tour.included.length > 0 ? (
                      tour.included.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{inc}</span>
                        </li>
                      ))
                    ) : (
                      <li>Hotels, Breakfast, Sightseeing transfers included.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-800 text-sm mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-600" /> What's Excluded
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {tour.excluded && tour.excluded.length > 0 ? (
                      tour.excluded.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{exc}</span>
                        </li>
                      ))
                    ) : (
                      <li>Personal expenses, camera charges, airfares.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-end flex-shrink-0">
            <button
              onClick={handleWhatsAppBooking}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              BOOK VIA WHATSAPP
            </button>

            {isExpired ? (
              <button
                disabled
                className="flex-1 sm:flex-none bg-slate-300 text-slate-600 px-6 py-3 rounded-xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" /> BOOKING CLOSED
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenBookingModal(tour);
                }}
                className="flex-1 sm:flex-none bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-sunset-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                BOOK NOW <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
