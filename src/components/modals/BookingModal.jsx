import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Send, Calendar, Clock, MapPin, Tag } from "lucide-react";
import API from "../../services/api";

export default function BookingModal({ tour, onClose }) {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    travelers: 1,
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      setErrorMsg("Please fill in your name and phone number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        travelers: Number(formData.travelers),
        message: formData.message,
        tourId: tour?._id || null,
        tourName: tour?.title || "General Custom Trip Enquiry",
        travelDate: tour?.startDate || new Date()
      };

      const res = await API.post("/bookings", payload);
      setSuccessMsg(res.data.message || "Your booking request has been received. Our team will contact you shortly.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit booking request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="bg-navy-900 text-white p-6">
            <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
              Booking Request
            </span>
            <h3 className="text-xl font-bold font-outfit mt-1">
              {tour ? tour.title : "Custom Tour Enquiry"}
            </h3>

            {tour && (
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-300 pt-3 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" /> {tour.destination}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" /> {tour.duration}
                </span>
                <span className="flex items-center gap-1 font-bold text-white">
                  <Tag className="w-3.5 h-3.5 text-sunset-400" /> ₹{tour.price?.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-6">
            {successMsg ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 font-outfit">Request Received!</h4>
                <p className="text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {successMsg}
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-navy-900 text-white font-bold text-sm rounded-xl hover:bg-navy-800 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Sharma"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rajesh@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Number of Travelers <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Special Requirements / Message
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Preferred dates, food preferences, pickup points..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sunset-500 to-sunset-600 text-white font-bold text-sm shadow-lg shadow-sunset-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? "Submitting..." : (
                    <>
                      <Send className="w-4 h-4" /> Submit Booking Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
