import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { Search, Filter, Eye } from "lucide-react";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout title="Order Management">
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {["ALL", "NEW", "CONFIRMED", "COMPLETED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={"px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all " +
                  (statusFilter === status
                    ? "bg-slate-900 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Order ID, Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          {loading ? (
            <p className="text-xs text-slate-500 py-10 text-center">Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No orders match your filter criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer Details</th>
                    <th className="pb-3">Items Summary</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Order Status</th>
                    <th className="pb-3">Placed Date</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50">
                      <td className="py-3.5 font-extrabold text-slate-900">{o.orderNumber}</td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900">{o.customerName}</p>
                        <p className="text-[11px] text-slate-500">{o.phone} • {o.pinCode}</p>
                      </td>
                      <td className="py-3.5 max-w-xs truncate text-slate-600">
                        {o.items.map((i) => i.name + " • " + i.quantity).join(", ")}
                      </td>
                      <td className="py-3.5 font-extrabold text-orange-600">₹{o.totalAmount}</td>
                      <td className="py-3.5">
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
                      <td className="py-3.5 text-slate-400 text-[11px]">
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to={"/admin/orders/" + o._id}
                          className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
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
    </AdminLayout>
  );
};
