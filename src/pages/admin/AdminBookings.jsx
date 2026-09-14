import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  PhoneCall,
  Trash2,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  Sparkles,
  X,
  RefreshCw,
  FileText
} from "lucide-react";
import API from "../../services/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);
      if (search) params.append("search", search);

      const res = await API.get(`/bookings?${params.toString()}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching bookings", err);
    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, search]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await API.put(`/bookings/${id}/status`, { status: newStatus });
      fetchBookings();
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    setActionLoading(true);
    try {
      await API.delete(`/bookings/${id}`);
      setDeleteConfirmId(null);
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking(null);
      }
      fetchBookings();
    } catch (err) {
      alert("Failed to delete booking.");
    } finally {
      setActionLoading(false);
    }
  };

  // Stats Counters
  const totalRequests = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "New" || b.status === "Pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  // Sorting
  const sortedBookings = [...bookings].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "travelDate") return new Date(a.travelDate || 0) - new Date(b.travelDate || 0);
    return 0;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Contacted":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
            Booking Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage and respond to customer tour booking enquiries.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-teal-600" : ""}`} /> Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Requests</span>
            <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900">{totalRequests}</div>
          <span className="text-[11px] text-slate-400 font-medium">All time customer inquiries</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider">Pending / New</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900">{pendingCount}</div>
          <span className="text-[11px] text-amber-700 font-medium">Requires initial response</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900">{confirmedCount}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Trip bookings locked in</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold uppercase tracking-wider">Cancelled</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900">{cancelledCount}</div>
          <span className="text-[11px] text-rose-700 font-medium">Closed or invalid requests</span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer, phone, tour..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="New">New / Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="travelDate">Travel Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Booking ID</th>
                <th className="py-4 px-4">Customer Name</th>
                <th className="py-4 px-4">Tour / Package</th>
                <th className="py-4 px-4">Travel Date</th>
                <th className="py-4 px-4">Travelers</th>
                <th className="py-4 px-4">Contact Details</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Submitted Date</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    Loading booking requests...
                  </td>
                </tr>
              ) : sortedBookings.length > 0 ? (
                sortedBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Booking ID */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      #{b._id.slice(-6).toUpperCase()}
                    </td>

                    {/* Customer Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {b.customerName}
                    </td>

                    {/* Tour Name */}
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-700 font-medium">
                      {b.tourName}
                    </td>

                    {/* Travel Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {formatDate(b.travelDate)}
                    </td>

                    {/* Travelers */}
                    <td className="py-3.5 px-4 text-slate-700 font-bold text-center">
                      {b.travelers || 1}
                    </td>

                    {/* Contact Details */}
                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                      <div className="font-semibold text-slate-800">{b.phone}</div>
                      {b.email && <div className="text-[11px] text-slate-400">{b.email}</div>}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status || "New"}
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {formatDate(b.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(b._id, "Contacted")}
                          className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold transition-colors"
                          title="Mark as Contacted"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(b._id, "Confirmed")}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-colors"
                          title="Confirm Booking"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(b._id, "Cancelled")}
                          className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold transition-colors"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(b._id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500 space-y-2">
                    <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-700">No booking requests found.</p>
                    <p className="text-xs text-slate-400">
                      Try clearing filters or search term.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] uppercase font-extrabold text-teal-600 tracking-wider">
                  BOOKING DETAILS #{selectedBooking._id.slice(-6).toUpperCase()}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-outfit">
                  {selectedBooking.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              {/* Customer Info Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-600" /> Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone Hotline</span>
                    <strong className="text-slate-900 font-semibold">{selectedBooking.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    <strong className="text-slate-900 font-semibold">{selectedBooking.email || "Not Provided"}</strong>
                  </div>
                </div>
              </div>

              {/* Tour Package Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" /> Requested Tour Package
                </h4>
                <p className="text-sm font-extrabold text-slate-900 font-outfit">{selectedBooking.tourName}</p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Travel Date</span>
                    <strong className="text-slate-900 font-semibold">{formatDate(selectedBooking.travelDate)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Number of Travelers</span>
                    <strong className="text-slate-900 font-semibold">{selectedBooking.travelers || 1} Person(s)</strong>
                  </div>
                </div>
              </div>

              {/* Special Message / Requirements */}
              {selectedBooking.message && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-1">
                  <h4 className="font-bold text-amber-900 uppercase text-[11px] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-amber-600" /> Special Requirements / Notes
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-medium pt-1">
                    "{selectedBooking.message}"
                  </p>
                </div>
              )}

              {/* Status Selector */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block font-bold text-slate-800 uppercase">
                  Update Booking Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["New", "Contacted", "Confirmed", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(selectedBooking._id, st)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedBooking.status === st
                          ? "bg-teal-600 text-white border-teal-600 shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
              <span className="text-slate-400">Submitted: {formatDate(selectedBooking.createdAt)}</span>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto" />
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-outfit">Delete Booking Request?</h4>
              <p className="text-xs text-slate-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBooking(deleteConfirmId)}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md"
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
