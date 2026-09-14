import React, { useState } from "react";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { PlaceOrderModal } from "../components/customer/PlaceOrderModal";
import { MapPin, Phone, Mail, Clock, Store, Heart } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export const About = () => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { business } = useSettings();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar onOpenCart={() => setIsCartModalOpen(true)} />

        {/* Banner Section */}
        <section className="relative h-64 bg-slate-900 text-white overflow-hidden">
          <img
            src={business.bannerUrl}
            alt="Combo Point Banner"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 bg-orange-950/80 px-3 py-1 rounded-full border border-orange-700/50 mb-2">
              Physical Stall & Cloud Counter
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">About Combo Point</h1>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
          {/* Story Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-orange-600">
              <Store className="w-6 h-6" />
              <h2 className="text-xl font-extrabold text-slate-900">Our Story & Mission</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {business.aboutText}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-100">
                <span className="font-extrabold text-orange-600 text-lg">100% Fresh</span>
                <p className="text-[11px] text-slate-500">Prepared Daily</p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-100">
                <span className="font-extrabold text-orange-600 text-lg">Best Value</span>
                <p className="text-[11px] text-slate-500">Affordable Food Combos</p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-100">
                <span className="font-extrabold text-orange-600 text-lg">Fast Service</span>
                <p className="text-[11px] text-slate-500">Instant QR Ordering</p>
              </div>
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-orange-600">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Stall Location</h3>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {business.physicalLocation}
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Open for Walk-ins & QR Orders 12:00 PM • 10:00 PM</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-orange-600">
                <Phone className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Get In Touch</h3>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{business.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{business.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
      <PlaceOrderModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </div>
  );
};
