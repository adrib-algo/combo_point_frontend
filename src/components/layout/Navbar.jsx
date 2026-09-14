import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Menu, X, ShieldCheck } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onOpenBookingModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const { admin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours" },
    { name: "Gallery", path: "/gallery" },
    { name: "Reviews", path: "/reviews" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-sunset-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-outfit block leading-none">
              {settings.companyName?.split(" ")[0] || "Azure"}{" "}
              <span className="text-teal-600">{settings.companyName?.split(" ")[1] || "Horizons"}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
              Travel & Tours
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                isActive(link.path)
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-slate-700 hover:text-teal-600 hover:bg-slate-200/60"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button & Admin Portal Indicator */}
        <div className="hidden lg:flex items-center gap-3">
          {admin && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 text-xs font-bold text-teal-700 border border-teal-200 hover:bg-teal-50 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Admin Dashboard
            </Link>
          )}

          <button
            onClick={() => onOpenBookingModal && onOpenBookingModal()}
            className="rounded-full bg-gradient-to-r from-sunset-500 to-amber-500 hover:from-sunset-600 hover:to-amber-600 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-sunset-500/20 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-6 py-4 flex flex-col gap-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive(link.path)
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {admin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-100 text-teal-700 text-center font-bold text-xs flex items-center justify-center gap-2 border border-teal-200"
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Admin Dashboard
              </Link>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBookingModal) onOpenBookingModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sunset-500 to-amber-500 text-white text-center font-extrabold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
