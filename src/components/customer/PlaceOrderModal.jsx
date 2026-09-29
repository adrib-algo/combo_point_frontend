import React, { useState } from "react";
import { X, ShoppingBag, ArrowRight, Trash2, Clock, Calendar, AlertCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export const PlaceOrderModal = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [step, setStep] = useState("CART");
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    landmark: "",
    pinCode: "",
    deliveryDate: "",
    deliveryTime: "12:00 PM"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deadlineErrorModal, setDeadlineErrorModal] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.customerName || !formData.phone || !formData.deliveryAddress) {
      setError("Please fill in all required customer details.");
      return;
    }

    if (settings.mainOrderMode === "PRE-ORDER" && (!formData.deliveryDate || !formData.deliveryTime)) {
      setError("Please select a required delivery date and delivery time for Pre-Order.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/orders", {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        deliveryAddress: formData.deliveryAddress,
        landmark: formData.landmark,
        pinCode: formData.pinCode,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        items: cart.map((i) => ({ menuItemId: i._id, quantity: i.quantity, price: i.price }))
      });

      if (res.data.success) {
        clearCart();
        onClose();
        navigate("/order-success", { state: { order: res.data.order } });
      }
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.code === "PREORDER_DEADLINE_EXCEEDED" || (resp?.message && resp.message.includes("after tomorrow"))) {
        setDeadlineErrorModal(true);
      } else {
        setError(resp?.message || "Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="font-extrabold text-slate-900 text-lg">
                {step === "CART" ? "Your Food Cart" : "Customer Information"}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs font-bold p-3 px-6 border-b border-red-100">
              {error}
            </div>
          )}

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {step === "CART" ? (
              cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-600 text-sm">Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-500">₹{item.price} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button onClick={() => updateQuantity(item._id, -1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold">-</button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, 1)} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold">+</button>
                        </div>
                        <span className="font-extrabold text-slate-900 text-xs w-12 text-right">₹{item.price * item.quantity}</span>
                        <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <form id="orderForm" onSubmit={handlePlaceOrder} className="space-y-3">
                {settings.mainOrderMode === "PRE-ORDER" && (
                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 space-y-2 mb-2">
                    <div className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-700" /> Select Pre-Order Delivery Date & Time:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-amber-800 mb-1">Required Date *</label>
                        <input
                          type="date"
                          name="deliveryDate"
                          required
                          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                          value={formData.deliveryDate}
                          onChange={handleChange}
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-amber-800 mb-1">Required Time *</label>
                        <select
                          name="deliveryTime"
                          value={formData.deliveryTime}
                          onChange={handleChange}
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        >
                          <option value="12:00 PM">12:00 PM (Lunch)</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="06:00 PM">06:00 PM (Evening Snacks)</option>
                          <option value="08:00 PM">08:00 PM (Dinner)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    placeholder="e.g. Rahul Roy"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. rahul@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address *</label>
                  <textarea
                    name="deliveryAddress"
                    required
                    rows="2"
                    placeholder="House/Flat No., Street / Area"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="Opposite Monda Mithai Store"
                      value={formData.landmark}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      name="pinCode"
                      placeholder="700131"
                      value={formData.pinCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer buttons */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium">Estimated Total Amount</span>
                <span className="font-extrabold text-orange-600 text-lg">₹{cartTotal}</span>
              </div>

              {step === "CART" ? (
                <button
                  onClick={() => setStep("CHECKOUT")}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  Proceed to Order Form <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("CART")}
                    className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    form="orderForm"
                    disabled={loading}
                    className="w-2/3 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? "Submitting..." : "Place Order Now"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Deadline Exceeded Error Popup Modal */}
      {deadlineErrorModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-red-100 animate-scale-in">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base">Order cannot be placed for this delivery time.</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You will receive the order after tomorrow.
              </p>
            </div>
            <button
              onClick={() => setDeadlineErrorModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};
