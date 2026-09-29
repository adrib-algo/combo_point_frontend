import React, { useState, useEffect } from "react";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { FoodCard } from "../components/customer/FoodCard";
import { StickyCart } from "../components/customer/StickyCart";
import { PlaceOrderModal } from "../components/customer/PlaceOrderModal";
import { useSettings } from "../context/SettingsContext";
import API from "../services/api";
import { Sparkles, Utensils, AlertCircle, ShoppingBag, Gift, Check, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
  const navigate = useNavigate();
  const { settings, business } = useSettings();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Section Tab: "MAIN" or "FREE_TASTE"
  const [activeTab, setActiveTab] = useState("MAIN");

  // Popup Modals
  const [showFreeTastePopup, setShowFreeTastePopup] = useState(false);
  const [showModeNoticePopup, setShowModeNoticePopup] = useState(false);

  // Free Taste Form State
  const [selectedFreeTasteItem, setSelectedFreeTasteItem] = useState(null);
  const [freeTasteForm, setFreeTasteForm] = useState({ customerName: "", phone: "", deliveryAddress: "" });
  const [freeTasteLoading, setFreeTasteLoading] = useState(false);
  const [freeTasteError, setFreeTasteError] = useState("");

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

  const handleTabClick = (tab) => {
    if (tab === "FREE_TASTE") {
      setShowFreeTastePopup(true);
    } else {
      setShowModeNoticePopup(true);
    }
  };

  const handleConfirmFreeTastePopup = () => {
    setShowFreeTastePopup(false);
    setActiveTab("FREE_TASTE");
  };

  const handleConfirmModeNoticePopup = () => {
    setShowModeNoticePopup(false);
    setActiveTab("MAIN");
  };

  const handleFreeTasteSubmit = async (e) => {
    e.preventDefault();
    setFreeTasteError("");

    if (!selectedFreeTasteItem) {
      setFreeTasteError("Please select a food item for your Free Taste request.");
      return;
    }
    if (!freeTasteForm.customerName || !freeTasteForm.phone || !freeTasteForm.deliveryAddress) {
      setFreeTasteError("Please fill in all required customer details.");
      return;
    }

    try {
      setFreeTasteLoading(true);
      const res = await API.post("/orders/free-taste", {
        customerName: freeTasteForm.customerName,
        phone: freeTasteForm.phone,
        deliveryAddress: freeTasteForm.deliveryAddress,
        menuItemId: selectedFreeTasteItem._id
      });

      if (res.data.success) {
        navigate("/order-success", { state: { order: res.data.order } });
      }
    } catch (err) {
      setFreeTasteError(err.response?.data?.message || "Failed to submit Free Taste request.");
    } finally {
      setFreeTasteLoading(false);
    }
  };

  const categories = ["All", ...new Set(items.map((i) => i.category || "Combos"))];
  const filteredItems = selectedCategory === "All" ? items : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar onOpenCart={() => setIsCartModalOpen(true)} />

        {/* Hero Banner */}
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

        {/* Ordering Section Selector (Free Taste vs Main Order) */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {settings.freeTasteMode && (
            <div className="flex justify-center mb-8">
              <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 inline-flex gap-2">
                <button
                  onClick={() => handleTabClick("MAIN")}
                  className={"px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 " +
                    (activeTab === "MAIN"
                      ? "bg-orange-600 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100")
                  }
                >
                  <ShoppingBag className="w-4 h-4" /> MAIN ORDER
                </button>
                <button
                  onClick={() => handleTabClick("FREE_TASTE")}
                  className={"px-6 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 " +
                    (activeTab === "FREE_TASTE"
                      ? "bg-amber-500 text-white shadow"
                      : "text-slate-600 hover:bg-amber-50 text-amber-700")
                  }
                >
                  <Gift className="w-4 h-4" /> FREE TASTE
                </button>
              </div>
            </div>
          )}

          {activeTab === "FREE_TASTE" && settings.freeTasteMode ? (
            /* FREE TASTE SECTION */
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-amber-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-amber-100 pb-4 text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Exclusive Free Taste Campaign
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">Select 1 Item for Free Taste</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Choose any item below to receive a free taste sample. Maximum quantity is 1 item.
                </p>
              </div>

              {freeTasteError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-2xl text-xs font-bold text-center border border-red-200">
                  {freeTasteError}
                </div>
              )}

              {/* Free Taste Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.filter(i => i.isAvailable).map((item) => {
                  const isSelected = selectedFreeTasteItem?._id === item._id;
                  return (
                    <div
                      key={item._id}
                      onClick={() => setSelectedFreeTasteItem(item)}
                      className={"cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between relative overflow-hidden " +
                        (isSelected
                          ? "border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-500"
                          : "border-slate-200 hover:border-amber-300 bg-white")
                      }
                    >
                      <div className="space-y-2">
                        <div className="h-32 w-full rounded-xl bg-slate-100 overflow-hidden relative">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1 shadow">
                              <Check className="w-4 h-4 font-bold" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="pt-3 flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                          Qty: 1 (Free)
                        </span>
                        <span className={"text-xs font-bold " + (isSelected ? "text-amber-700 font-extrabold" : "text-slate-400")}>
                          {isSelected ? "Selected" : "Click to select"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Information Form */}
              <form onSubmit={handleFreeTasteSubmit} className="pt-6 border-t border-slate-100 space-y-4 max-w-xl mx-auto">
                <h3 className="font-extrabold text-slate-900 text-sm text-center">Enter Customer Information for Delivery</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyo Das"
                    value={freeTasteForm.customerName}
                    onChange={(e) => setFreeTasteForm({ ...freeTasteForm, customerName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={freeTasteForm.phone}
                    onChange={(e) => setFreeTasteForm({ ...freeTasteForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Delivery Address *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="House/Flat No., Street / Area"
                    value={freeTasteForm.deliveryAddress}
                    onChange={(e) => setFreeTasteForm({ ...freeTasteForm, deliveryAddress: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={freeTasteLoading || !selectedFreeTasteItem}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
                >
                  {freeTasteLoading ? "Submitting Request..." : "Place Free Taste Request"}
                </button>
              </form>
            </div>
          ) : (
            /* MAIN ORDER SECTION */
            <div>
              {/* Category Pills */}
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
            </div>
          )}
        </main>
      </div>

      <Footer />
      {activeTab === "MAIN" && <StickyCart onOpenCart={() => setIsCartModalOpen(true)} />}
      <PlaceOrderModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />

      {/* Free Taste Pre-Entry Popup Modal */}
      {showFreeTastePopup && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-amber-100">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Gift className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">Free Taste</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                We will contact you shortly after placing your free taste order. Maximum response time is 2 days.
              </p>
            </div>
            <button
              onClick={handleConfirmFreeTastePopup}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Main Order Pre-Order / Instant Notice Popup Modal */}
      {showModeNoticePopup && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
              <Info className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {settings.mainOrderMode === "PRE-ORDER" ? "Pre-Order" : "Instant Order"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {settings.mainOrderMode === "PRE-ORDER"
                  ? "You have to place your order before one day. Please place your order at least one day before your required delivery date/time."
                  : "You can place an order for immediate delivery, subject to current availability and preparation time."}
              </p>
            </div>
            <button
              onClick={handleConfirmModeNoticePopup}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
