import React from "react";
import { Link } from "react-router-dom";
import { Compass, Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, Heart } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sunset-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sunset-500 flex items-center justify-center text-white shadow-lg">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white font-outfit block leading-none">
                  {settings.companyName?.split(" ")[0] || "Azure"}{" "}
                  <span className="text-teal-400">{settings.companyName?.split(" ")[1] || "Horizons"}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                  Travel & Tours
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.aboutText || "Crafting luxury bespoke journeys, adventurous mountain treks, and serene beach getaways across the globe."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-teal-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-sunset-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-teal-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-outfit uppercase tracking-wider text-xs text-teal-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-teal-400 transition-colors">Tour Packages</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-teal-400 transition-colors">Travel Gallery</Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-teal-400 transition-colors">Customer Reviews</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Tours */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-outfit uppercase tracking-wider text-xs text-teal-400">
              Top Destinations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/tours?location=Darjeeling" className="hover:text-teal-400 transition-colors">Darjeeling & Kalimpong</Link></li>
              <li><Link to="/tours?location=Sikkim" className="hover:text-teal-400 transition-colors">Sikkim Gangtok</Link></li>
              <li><Link to="/tours?location=Kashmir" className="hover:text-teal-400 transition-colors">Kashmir Dal Lake</Link></li>
              <li><Link to="/tours?location=Goa" className="hover:text-teal-400 transition-colors">Goa Beaches</Link></li>
              <li><Link to="/tours?location=Rajasthan" className="hover:text-teal-400 transition-colors">Royal Rajasthan Forts</Link></li>
              <li><Link to="/tours?location=Kerala" className="hover:text-teal-400 transition-colors">Kerala Backwaters</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base mb-4 font-outfit uppercase tracking-wider text-xs text-teal-400">
              Contact & Support
            </h4>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-teal-400">{settings.phone}</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-teal-400">{settings.email}</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300 pt-1">
              <Clock className="w-4 h-4 text-sunset-400 flex-shrink-0" />
              <span>{settings.businessHours}</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-teal-400 transition-colors flex items-center gap-1">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
