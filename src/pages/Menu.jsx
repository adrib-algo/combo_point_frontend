import React, { useState, useEffect } from "react";
import API from "../services/api";
import { FoodCard } from "../components/customer/FoodCard";
import { StickyCart } from "../components/customer/StickyCart";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { PlaceOrderModal } from "../components/customer/PlaceOrderModal";
import { Sparkles, Utensils } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { settings, business } = useSettings();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await API.get("/menu");
        if (res.data.success) {
          setItems(res.data.items || []);
        }
      } catch (err) {
        setError("Failed to load food menu. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const categories = ["All", ...new Set(items.map((i) => i.category || "Combos"))];

  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar onOpenCart={() => setIsCartModalOpen(true)} />

        {/* Hero Stall Banner */}
        <section className="bg-slate-900 text-white relative overflow-hidden py-10 px-4">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url(" + business.bannerUrl + ")" }}></div>
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/90 text-white text-xs font-bold mb-3 shadow">
              <Sparkles className="w-3.5 h-3.5" />
              {settings.freeTasteMode ? "Free Taste Campaign Active" : "Fresh Hot Food Stall"}
            </div>
            <h1 className="font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-2">
              Combo Point Food Stall
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Order delicious food combos, authentic momos, and quick bites directly from our stall at New Barrackpore!
            </p>
          </div>
        </section>

        {/* Menu Container */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Category Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={"px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all " +
                  (selectedCategory === cat
                    ? "bg-orange-600 text-white shadow-md scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200")
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading & Error States */}
          {loading ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 font-medium">Loading delicious items...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-md mx-auto">
              <p className="font-bold text-sm">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8">
              <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">No items available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredItems.map((item) => (
                <FoodCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
      <StickyCart onOpenCart={() => setIsCartModalOpen(true)} />
      <PlaceOrderModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </div>
  );
};
