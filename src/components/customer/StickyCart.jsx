import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

export const StickyCart = ({ onOpenCart }) => {
  const { cartCount, cartTotal } = useCart();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 animate-slide-up">
      <button
        onClick={onOpenCart}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between active:scale-[0.99] transition-all border border-slate-700"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400 font-medium">Your Order Cart</p>
            <p className="text-sm font-extrabold text-white">
              {cartCount} {cartCount === 1 ? "Item" : "Items"} • ₹{cartTotal}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white px-3.5 py-2 rounded-xl">
          View Cart
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
