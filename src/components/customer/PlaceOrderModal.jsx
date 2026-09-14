import React, { useState } from "react";
import { X, Trash2, ShoppingBag, AlertCircle, Clock, Sparkles } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useSettings } from "../../context/SettingsContext";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export const PlaceOrderModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { settings } = useSettings();

  const [step, setStep] = useState("CART");
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    landmark: "",
    pinCode: "",
    preferredDeliveryTime: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!settings.acceptOrders || settings.storeStatus === "CLOSED") {
      setError("Orders are currently closed by stall management.");
      return;
    }

    if (cart.length === 0) {
      setError("Cart is empty.");
      return;
    }

    if (!formData.customerName || !formData.phone || !formData.email || !formData.deliveryAddress || !formData.landmark || !formData.pinCode) {
      setError("Please fill in all required customer and delivery fields.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        deliveryAddress: formData.deliveryAddress,
        landmark: formData.landmark,
        pinCode: formData.pinCode,
        preferredDeliveryTime: formData.preferredDeliveryTime,
        items: cart.map((i) => ({ menuItemId: i._id, quantity: i.quantity }))
      };

      const res = await API.post("/orders", payload);

      if (res.data.success) {
        clearCart();
        onClose();
        navigate("/order-success?orderId=" + res.data.orderNumber, {
          state: { order: res.data.order }
        });
      } else {
        setError(res.data.message || "Failed to create order.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Order creation failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
              ???
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">
                {step === "CART" ? "Your Cart Summary" : "Customer & Delivery Details"}
              </h2>
              <p className="text-[11px] text-slate-500">Combo Point • New Barrackpore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {settings.freeTasteMode && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Free Taste Mode Enabled • Cash / Pay on Delivery</span>
          </div>
        )}

        {error && (
          <div className="m-4 mb-0 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {step === "CART" ? (
            cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-700 text-sm">Your cart is empty</p>
                <p className="text-xs text-slate-400 mt-1">Add items from the menu to place an order.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">₹{item.price} each</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-extrabold text-slate-900 text-xs w-12 text-right">
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <form id="orderForm" onSubmit={handlePlaceOrder} className="space-y-3">
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Landmark *</label>
                  <input
                    type="text"
                    name="landmark"
                    required
                    placeholder="Opposite Monda Mithai Store"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pinCode"
                    required
                    placeholder="700131"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {settings.deliveryTimeEnabled && (
                <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-200">
                  <label className="block text-xs font-bold text-orange-900 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-600" /> Preferred Delivery Time
                  </label>
                  <select
                    name="preferredDeliveryTime"
                    value={formData.preferredDeliveryTime}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="">ASAP (Within 30-40 mins)</option>
                    <option value="Evening (6:00 PM - 7:00 PM)">Evening (6:00 PM - 7:00 PM)</option>
                    <option value="Night (8:00 PM - 9:00 PM)">Night (8:00 PM - 9:00 PM)</option>
                  </select>
                </div>
              )}
            </form>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Estimated Total Amount</span>
              <span className="font-extrabold text-orange-600 text-lg">₹{cartTotal}</span>
            </div>

            {step === "CART" ? (
              <button
                onClick={() => setStep("CHECKOUT")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
              >
                Proceed to Order Form
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
                  {loading ? "Submitting Order..." : "Place Order Now"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
