import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { ShoppingBag, Clock, CheckCircle2, XCircle, Star, Sparkles, ArrowRight } from "lucide-react";

export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, reviewsRes] = await Promise.all([
          API.get("/admin/orders"),
          API.get("/admin/reviews")
        ]);

        if (ordersRes.data.success) setOrders(ordersRes.data.orders || []);
        if (reviewsRes.data.success) setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const newOrders = orders.filter((o) => o.status === "NEW");
  const confirmedOrders = orders.filter((o) => o.status === "CONFIRMED");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const pendingReviews = reviews.filter((r) => r.status === "PENDING");
  const featuredReviews = reviews.filter((r) => r.isFeatured);

  return (
    <AdminLayout title="Operational Dashboard">
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading operational overview...</div>
      ) : (
        <div className="space-y-8">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-amber-100 text-xs font-semibold">
                <span>NEW ORDERS</span>
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-3xl font-extrabold">{newOrders.length}</p>
              <p className="text-[10px] text-amber-100 font-medium">Requires Stall Action</p>
            </div>

            <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-blue-100 text-xs font-semibold">
                <span>CONFIRMED</span>
                <ShoppingBag className="w-4 h-4" />
              </div>
              <p className="text-3xl font-extrabold">{confirmedOrders.length}</p>
              <p className="text-[10px] text-blue-100 font-medium">In Preparation</p>
            </div>

            <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-emerald-100 text-xs font-semibold">
                <span>COMPLETED</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-3xl font-extrabold">{completedOrders.length}</p>
              <p className="text-[10px] text-emerald-100 font-medium">Fulfilled Orders</p>
            </div>

            <div className="bg-purple-600 text-white rounded-2xl p-4 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-purple-100 text-xs font-semibold">
                <span>PENDING REVIEWS</span>
                <Star className="w-4 h-4" />
              </div>
              <p className="text-3xl font-extrabold">{pendingReviews.length}</p>
              <p className="text-[10px] text-purple-100 font-medium">Needs Moderation</p>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                <span>FEATURED REVIEWS</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400">{featuredReviews.length}</p>
              <p className="text-[10px] text-slate-400 font-medium">Highlighted on Site</p>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-base">Recent Incoming Orders</h2>
              <Link to="/admin/orders" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No orders created yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Items</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50/80">
                        <td className="py-3 font-extrabold text-slate-900">{o.orderNumber}</td>
                        <td className="py-3">
                          <p className="font-bold text-slate-800">{o.customerName}</p>
                          <p className="text-[11px] text-slate-400">{o.phone}</p>
                        </td>
                        <td className="py-3 max-w-xs truncate text-slate-600">
                          {o.items.map((i) => i.name + " × " + i.quantity).join(", ")}
                        </td>
                        <td className="py-3 font-extrabold text-orange-600">₹{o.totalAmount}</td>
                        <td className="py-3">
                          <span
                            className={"px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase " +
                              (o.status === "NEW" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                              o.status === "CONFIRMED" ? "bg-blue-100 text-blue-800 border border-blue-300" :
                              o.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                              "bg-red-100 text-red-800 border border-red-300")
                            }
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={"/admin/orders/" + o._id}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[11px]"
                          >
                            Inspect
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
