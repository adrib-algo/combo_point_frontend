import React, { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { Search, ShieldCheck, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";

export const TokenVerification = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultOrder, setResultOrder] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    try {
      setLoading(true);
      setError("");
      setResultOrder(null);

      const res = await API.get("/orders/verify-token/" + encodeURIComponent(tokenInput.trim()));
      if (res.data.success && res.data.order) {
        setResultOrder(res.data.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid token number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Token Verification Tool">
      <div className="space-y-6 max-w-2xl">
        <p className="text-xs text-slate-500 font-medium">Verify customer token numbers upon delivery or stall collection to inspect order details.</p>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <form onSubmit={handleVerify} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Token Number (e.g. 101 or #101)..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs font-bold rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> VERIFY
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl text-center space-y-2 shadow-sm">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="font-extrabold text-sm">{error}</h3>
          </div>
        )}

        {resultOrder && (
          <div className="bg-white rounded-3xl border border-emerald-300 p-6 shadow-md space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs">
                <CheckCircle2 className="w-5 h-5" /> VALID TOKEN NUMBER
              </div>
              <span className="font-mono font-black text-2xl text-orange-600">{resultOrder.tokenString}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block">Customer Name</span>
                <span className="font-extrabold text-slate-900">{resultOrder.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Contact Phone</span>
                <span className="font-bold text-slate-800">{resultOrder.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 font-bold block">Delivery Address</span>
                <span className="font-semibold text-slate-800">{resultOrder.address}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Order Type</span>
                <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">{resultOrder.orderType}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Status</span>
                <span className="font-extrabold text-orange-800 bg-orange-100 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">{resultOrder.status}</span>
              </div>
              <div className="col-span-2 border-t border-slate-100 pt-3">
                <span className="text-slate-400 font-bold block mb-1">Ordered Items</span>
                <span className="font-bold text-slate-900">{resultOrder.items}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
