import React from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Clock } from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const orderId = searchParams.get("orderId") || location.state?.order?.orderNumber || "CP-001";
  const order = location.state?.order;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar onOpenCart={() => {}} />

        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Order Received Successfully
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900">🎉 ORDER RECEIVED!</h1>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you for ordering from Combo Point! We have received your order request and will prepare it shortly.
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Your Order ID</p>
              <p className="text-4xl font-extrabold tracking-wider text-orange-400">{orderId}</p>
              <p className="text-[11px] text-slate-300">Save or screenshot this Order ID for reference.</p>
            </div>

            {order && (
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200/80 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-700">Customer:</span>
                  <span className="text-slate-900 font-semibold">{order.customerName} ({order.phone})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-700">Delivery Address:</span>
                  <span className="text-slate-900 font-semibold text-right max-w-xs">{order.deliveryAddress}, {order.landmark}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-slate-900 text-sm pt-1">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">₹{order.totalAmount}</span>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs text-left space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" /> Next Steps:
              </div>
              <p className="leading-relaxed text-slate-700">
                1. A confirmation email has been dispatched to your email address.<br />
                2. Our stall team will review and confirm your order shortly.<br />
                3. Payment is collected upon delivery / pickup in Free Taste Mode.
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/menu"
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
