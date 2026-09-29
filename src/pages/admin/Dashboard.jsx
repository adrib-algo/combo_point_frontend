import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { ShoppingBag, Clock, CheckCircle2, TrendingUp, Gift, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [freeTasteRequests, setFreeTasteRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, ftRes] = await Promise.all([
          API.get("/admin/orders"),
          API.get("/admin/free-taste")
        ]);

        if (ordersRes.data.success) setOrders(ordersRes.data.orders || []);
        if (ftRes.data.success) setFreeTasteRequests(ftRes.data.requests || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = orders.filter((o) => o.status === "PENDING" || o.status === "NEW").length;
  const preparingCount = orders.filter((o) => o.status === "PREPARING" || o.status === "CONFIRMED" || o.status === "ACCEPTED").length;
  const outForDeliveryCount = orders.filter((o) => o.status === "OUT FOR DELIVERY").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED" && o.status !== "REJECTED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <AdminLayout title="Operational Dashboard Overview">
      <div className="space-y-8">
        {/* Real KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Out for Delivery</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{outForDeliveryCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Taste Requests</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{freeTasteRequests.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Revenue</p>
              <h3 className="text-2xl font-black text-orange-600 mt-1">₹{totalRevenue}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Recent Main Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-orange-600 hover:text-orange-700">View All Orders →</Link>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Loading order data...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-slate-500">No orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Token</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o._id}>
                      <td className="py-3 font-mono font-extrabold text-orange-600">{o.orderNumber || `#${o.tokenNumber}`}</td>
                      <td className="py-3 font-bold text-slate-900">{o.customerName}</td>
                      <td className="py-3 text-slate-600">{o.items.map(i => i.name).join(", ")}</td>
                      <td className="py-3 font-extrabold text-slate-900">₹{o.totalAmount}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
