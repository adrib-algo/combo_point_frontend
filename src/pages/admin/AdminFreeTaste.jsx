import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { Search, Gift, CheckCircle2 } from "lucide-react";

export const AdminFreeTaste = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/free-taste");
      if (res.data.success) {
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error("Fetch Free Taste error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (reqId, newStatus) => {
    try {
      setUpdatingId(reqId);
      const res = await API.patch("/admin/orders/" + reqId + "/status", { status: newStatus });
      if (res.data.success) {
        setRequests((prev) => prev.map((r) => (r._id === reqId ? { ...r, status: newStatus } : r)));
      }
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const tokenStr = r.orderNumber || ("#" + r.tokenNumber);
    const matchesSearch =
      tokenStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["PENDING", "CONTACTED", "APPROVED", "OUT FOR DELIVERY", "DELIVERED", "CANCELLED"];

  return (
    <AdminLayout title="Free Taste Requests">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Token (#101), Customer, Contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Free Taste Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-xs text-slate-400 text-center py-8">Loading Free Taste Requests...</p>
          ) : filteredRequests.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8 font-medium">No Free Taste requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="pb-3">Token</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">Selected Item</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Requested At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredRequests.map((r) => (
                    <tr key={r._id}>
                      <td className="py-3.5 font-mono font-black text-amber-600 text-sm">
                        {r.orderNumber || ("#" + r.tokenNumber)}
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900">{r.customerName}</p>
                        <p className="text-[11px] text-slate-500">{r.phone}</p>
                      </td>
                      <td className="py-3.5 max-w-xs text-slate-600">
                        {r.deliveryAddress}
                      </td>
                      <td className="py-3.5 font-bold text-amber-900">
                        {r.items?.[0]?.name || "Free Sample"}
                      </td>
                      <td className="py-3.5 font-bold text-slate-600">
                        1
                      </td>
                      <td className="py-3.5">
                        <select
                          disabled={updatingId === r._id}
                          value={r.status}
                          onChange={(e) => handleStatusChange(r._id, e.target.value)}
                          className="px-2.5 py-1 text-[11px] font-extrabold rounded-xl border border-amber-300 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 text-[11px] text-slate-400">
                        {new Date(r.createdAt).toLocaleString()}
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
