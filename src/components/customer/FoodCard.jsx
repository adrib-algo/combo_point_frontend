import React from "react";
import { Plus, Minus, AlertCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";

export const FoodCard = ({ item }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const cartItem = cart.find((i) => i._id === item._id);

  return (
    <div
      className={"bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md " +
        (!item.isAvailable ? "opacity-70 border-slate-200 bg-slate-50" : "border-slate-100")
      }
    >
      <div>
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
            }}
          />
          <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full tracking-wider">
            {item.category}
          </span>
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Currently Unavailable
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-900 text-base leading-snug">{item.name}</h3>
            <span className="font-extrabold text-orange-600 text-base shrink-0">₹{item.price}</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
        </div>
      </div>

      <div className="p-4 pt-0">
        {!item.isAvailable ? (
          <button
            disabled
            className="w-full bg-slate-200 text-slate-500 font-semibold py-2 rounded-xl text-xs cursor-not-allowed text-center"
          >
            Not Orderable
          </button>
        ) : cartItem ? (
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-1">
            <button
              onClick={() => updateQuantity(item._id, -1)}
              className="w-8 h-8 rounded-lg bg-white text-orange-600 font-bold flex items-center justify-center hover:bg-orange-100 active:scale-95 shadow-sm"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-extrabold text-orange-700 text-sm">{cartItem.quantity} in cart</span>
            <button
              onClick={() => updateQuantity(item._id, 1)}
              className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center hover:bg-orange-700 active:scale-95 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(item)}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
