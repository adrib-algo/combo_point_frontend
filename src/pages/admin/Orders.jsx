import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { Search, Eye, Filter, CheckCircle2, AlertCircle } from "lucide-react";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await API.patch("/admin/orders/" + orderId + "/status", { status: newStatus });
      if (res.data.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      }
    } catch (err) {
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const tokenStr = o.orderNumber || ("#" + o.tokenNumber);
    const matchesSearch =
      tokenStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesType = typeFilter === "ALL" || (o.mainOrderSubMode || "PRE-ORDER") === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const statuses = [
    "PENDING", "NEW", "ACCEPTED", "CONFIRMED", "PREPARING", "READY",
    "OUT FOR DELIVERY", "DELIVERED", "COMPLETED", "CANCELLED", "REJECTED"
  ];

  return (
    <AdminLayout title="Main Orders Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Token (#101), Customer, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="ALL">All Order Modes</option>
              <option value="PRE-ORDER">PRE-ORDER</option>
              <option value="INSTANT">INSTANT</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-xs text-slate-400 text-center py-8">Loading Main Orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8 font-medium">No main orders found matching filter criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="pb-3">Token</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Mode & Time</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredOrders.map((o) => (
                    <tr key={o._id}>
                      <td className="py-3.5 font-mono font-black text-orange-600 text-sm">
                        {o.orderNumber || ("#" + o.tokenNumber)}
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900">{o.customerName}</p>
                        <p className="text-[11px] text-slate-500">{o.phone}</p>
                      </td>
                      <td className="py-3.5 max-w-xs text-slate-600">
                        {o.deliveryAddress}
                      </td>
                      <td className="py-3.5 font-semibold text-slate-700">
                        {o.items.map(i => i.name + " × " + i.quantity).join(", ")}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                          {o.mainOrderSubMode || "PRE-ORDER"}
                        </span>
                        {o.deliveryDate && (
                          <p className="text-[10px] text-slate-500 mt-0.5">{o.deliveryDate} {o.deliveryTime}</p>
                        )}
                      </td>
                      <td className="py-3.5 font-black text-slate-900 text-sm">
                        ₹{o.totalAmount}
                      </td>
                      <td className="py-3.5">
                        <select
                          disabled={updatingId === o._id}
                          value={o.status}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="px-2.5 py-1 text-[11px] font-extrabold rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleString()}
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
