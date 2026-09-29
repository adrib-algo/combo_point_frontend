import React, { useState } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Clock, Copy, Check } from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const order = location.state?.order;
  const tokenNumber = order?.tokenNumber || searchParams.get("token") || searchParams.get("orderId") || "101";
  const tokenString = order?.orderNumber || `#${tokenNumber}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar onOpenCart={() => {}} />

        <main className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {order?.orderType === "FREE_TASTE" ? "FREE TASTE REQUEST PLACED SUCCESSFULLY" : "ORDER PLACED SUCCESSFULLY"}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900">🎉 REQUEST RECEIVED!</h1>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you for ordering from Combo Point! We have received your order request and will process it shortly.
              </p>
            </div>

            {/* Token Highlight Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-3 relative overflow-hidden border border-orange-500/30">
              <p className="text-xs text-orange-400 uppercase tracking-widest font-extrabold">YOUR TOKEN NUMBER</p>
              <div className="text-5xl font-black tracking-wider text-orange-400 font-mono py-2 drop-shadow-md">
                {tokenString}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleCopy}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Token Copied!" : "Copy Token"}
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs text-left space-y-1.5 shadow-sm">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-900 text-sm">
                ⚠️ IMPORTANT NOTICE:
              </div>
              <p className="leading-relaxed font-semibold text-amber-950">
                Please save or take a screenshot of this token number. You must show this token to the delivery person to receive your order.
              </p>
            </div>

            {order && (
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-700">Customer:</span>
                  <span className="text-slate-900 font-semibold">{order.customerName} ({order.phone})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-700">Delivery Address:</span>
                  <span className="text-slate-900 font-semibold text-right max-w-xs">{order.deliveryAddress}</span>
                </div>
                {order.orderType !== "FREE_TASTE" && (
                  <div className="flex justify-between items-center font-bold text-slate-900 text-sm pt-1">
                    <span>Total Amount:</span>
                    <span className="text-orange-600">₹{order.totalAmount}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Menu
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
