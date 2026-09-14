import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export const Footer = () => {
  const { business } = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 py-10 px-4 mt-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🍱</span>
            <span className="font-extrabold text-xl text-white">COMBO POINT</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {business.aboutText}
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-950/80 text-orange-400 border border-orange-800/50 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            Open Daily • Quick Food Stall
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider text-orange-400">
            Stall Location
          </h4>
          <div className="flex items-start gap-2.5 text-xs text-slate-300 mb-2">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <span>{business.physicalLocation}</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider text-orange-400">
            Contact & Social
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-orange-500" />
              <span>{business.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-orange-500" />
              <span>{business.contactEmail}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Combo Point. All rights reserved. Built for New Barrackpore Food Stall.
      </div>
    </footer>
  );
};
