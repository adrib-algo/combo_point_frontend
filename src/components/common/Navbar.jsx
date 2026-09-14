import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Utensils, Info, Star, ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";

export const Navbar = ({ onOpenCart }) => {
  const location = useLocation();
  const { cartCount, cartTotal } = useCart();
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-orange-100 shadow-sm">
      {settings.storeStatus === "CLOSED" && (
        <div className="bg-red-500 text-white text-xs font-semibold py-1 px-4 text-center">
          ⚠️ STORE IS CURRENTLY CLOSED • WE ARE NOT ACCEPTING ORDERS RIGHT NOW
        </div>
      )}
      {!settings.acceptOrders && settings.storeStatus !== "CLOSED" && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-1 px-4 text-center">
          ⚠️ ORDERS ARE CURRENTLY CLOSED BY STALL ADMIN
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/menu" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            🍱
          </div>
          <div>
            <div className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              COMBO POINT
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-bold">
                STALL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none">New Barrackpore</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
          <Link
            to="/menu"
            className={"px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 " +
              (isActive("/menu") ? "bg-orange-50 text-orange-600 font-semibold" : "hover:bg-slate-100 text-slate-700")
            }
          >
            <Utensils className="w-4 h-4" />
            Menu
          </Link>
          <Link
            to="/about"
            className={"px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 " +
              (isActive("/about") ? "bg-orange-50 text-orange-600 font-semibold" : "hover:bg-slate-100 text-slate-700")
            }
          >
            <Info className="w-4 h-4" />
            About
          </Link>
          <Link
            to="/reviews"
            className={"px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 " +
              (isActive("/reviews") ? "bg-orange-50 text-orange-600 font-semibold" : "hover:bg-slate-100 text-slate-700")
            }
          >
            <Star className="w-4 h-4" />
            Reviews
          </Link>

          {isAuthenticated ? (
            <Link
              to="/admin/dashboard"
              className="ml-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              Admin Portal
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="ml-2 text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Admin Login
            </Link>
          )}
        </nav>

        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="bg-white text-orange-600 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-inner">
              {cartCount} • ₹{cartTotal}
            </span>
          )}
        </button>
      </div>

      <div className="md:hidden flex items-center justify-around bg-slate-50 border-t border-slate-200 text-xs font-medium py-2 px-2">
        <Link
          to="/menu"
          className={"flex flex-col items-center gap-0.5 px-3 py-1 rounded-md " +
            (isActive("/menu") ? "text-orange-600 font-bold" : "text-slate-600")
          }
        >
          <Utensils className="w-4 h-4" />
          Menu
        </Link>
        <Link
          to="/about"
          className={"flex flex-col items-center gap-0.5 px-3 py-1 rounded-md " +
            (isActive("/about") ? "text-orange-600 font-bold" : "text-slate-600")
          }
        >
          <Info className="w-4 h-4" />
          About
        </Link>
        <Link
          to="/reviews"
          className={"flex flex-col items-center gap-0.5 px-3 py-1 rounded-md " +
            (isActive("/reviews") ? "text-orange-600 font-bold" : "text-slate-600")
          }
        >
          <Star className="w-4 h-4" />
          Reviews
        </Link>
      </div>
    </header>
  );
};
