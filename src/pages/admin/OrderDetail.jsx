import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { ArrowLeft, CheckCircle2, XCircle, Clock, MapPin, Phone, Mail, User, AlertCircle } from "lucide-react";

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders/" + id);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      setError("");
      setMessage("");
      const res = await API.patch("/admin/orders/" + id + "/status", { status: newStatus });
      if (res.data.success) {
        setOrder(res.data.order);
        setMessage("Order status successfully updated to " + newStatus);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="py-20 text-center text-xs text-slate-500">Loading order info...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details">
        <div className="bg-red-50 p-6 rounded-2xl text-center text-xs text-red-700 font-bold">
          Order not found.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={"Inspect Order " + order.orderNumber}>
      <div className="space-y-6 max-w-4xl">
        <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Orders List
        </Link>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" /> {error}
          </div>
        )}

        {/* Top Status & Controls */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Current Status</span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={"px-3 py-1 rounded-full text-xs font-extrabold uppercase " +
                  (order.status === "NEW" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                  order.status === "CONFIRMED" ? "bg-blue-100 text-blue-800 border border-blue-300" :
                  order.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                  "bg-red-100 text-red-800 border border-red-300")
                }
              >
                {order.status}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {order.status === "NEW" && (
              <>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange("CONFIRMED")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  Confirm Order & Email Customer
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange("REJECTED")}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  Reject Order
                </button>
              </>
            )}

            {order.status === "CONFIRMED" && (
              <button
                disabled={updating}
                onClick={() => handleStatusChange("COMPLETED")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
              >
                Mark Order Completed
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">Customer & Delivery</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-orange-500" />
                <span className="font-bold">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>{order.email}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700 pt-2 border-t border-slate-100">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{order.deliveryAddress}</p>
                  <p className="text-slate-400">Landmark: {order.landmark} • PIN: {order.pinCode}</p>
                </div>
              </div>
              {order.preferredDeliveryTime && (
                <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-200 text-orange-900 text-xs font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" /> Preferred Delivery: {order.preferredDeliveryTime}
                </div>
              )}
            </div>
          </div>

          {/* Items & Authoritative Total */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">Ordered Items Breakdown</h3>
            <div className="space-y-2.5 divide-y divide-slate-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-slate-400">₹{item.price} • {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold">
              <span className="text-slate-700">Total Calculated Amount:</span>
              <span className="text-orange-600 text-base">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
