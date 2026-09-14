import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Star,
  RefreshCw,
  Clock,
  ThumbsUp,
  X
} from "lucide-react";
import API from "../../services/api";
import RatingStars from "../../components/common/RatingStars";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.append("status", statusFilter);

      const res = await API.get(`/reviews/admin?${params.toString()}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews", err);
    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await API.put(`/reviews/${id}/status`, { status: newStatus });
      fetchReviews();
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview({ ...selectedReview, status: newStatus });
      }
    } catch (err) {
      alert("Failed to update review status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    setActionLoading(true);
    try {
      await API.delete(`/reviews/${id}`);
      setDeleteConfirmId(null);
      if (selectedReview && selectedReview._id === id) {
        setSelectedReview(null);
      }
      fetchReviews();
    } catch (err) {
      alert("Failed to delete review.");
    } finally {
      setActionLoading(false);
    }
  };

  // Stats Counters
  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  let averageRating = 5.0;
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    averageRating = (sum / reviews.length).toFixed(1);
  }

  // Filtering & Sorting
  const filteredReviews = reviews
    .filter((r) => {
      const matchSearch =
        search === "" ||
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.review?.toLowerCase().includes(search.toLowerCase());
      const matchRating = ratingFilter === "All" || r.rating === Number(ratingFilter);
      return matchSearch && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "ratingHigh") return b.rating - a.rating;
      if (sortBy === "ratingLow") return a.rating - b.rating;
      return 0;
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
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
            Customer Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, approve, and manage customer feedback.
          </p>
        </div>

        <button
          onClick={fetchReviews}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-teal-600" : ""}`} /> Refresh Reviews
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reviews</span>
            <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900">{totalReviews}</div>
          <span className="text-[11px] text-slate-400 font-medium">Customer reviews received</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900">{approvedCount}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Live on public website</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approval</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900">{pendingCount}</div>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting moderation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900">{averageRating} ★</div>
          <span className="text-[11px] text-slate-400 font-medium">Overall traveler score</span>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name or review text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 font-medium bg-slate-50 focus:outline-none"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
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
              <option value="ratingHigh">Highest Rating</option>
              <option value="ratingLow">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Customer Name</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-4">Review Experience</th>
                <th className="py-4 px-4">Submitted Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading customer reviews...
                  </td>
                </tr>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Customer Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {r.name}
                    </td>

                    {/* Rating Stars */}
                    <td className="py-3.5 px-4">
                      <RatingStars rating={r.rating || 5} size="w-3.5 h-3.5" />
                    </td>

                    {/* Review Text */}
                    <td className="py-3.5 px-4 max-w-[320px] text-slate-600 font-normal">
                      <p className="line-clamp-2">"{r.review}"</p>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {formatDate(r.createdAt)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold border capitalize ${getStatusBadge(
                          r.status
                        )}`}
                      >
                        {r.status || "pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReview(r)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                          title="View Full Review"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {r.status !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(r._id, "approved")}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-colors"
                            title="Approve Review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {r.status !== "rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(r._id, "rejected")}
                            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold transition-colors"
                            title="Reject Review"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteConfirmId(r._id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-700">No customer reviews found.</p>
                    <p className="text-xs text-slate-400">
                      Try clearing filters or search criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW REVIEW MODAL */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] uppercase font-extrabold text-teal-600 tracking-wider">
                  CUSTOMER REVIEW DETAILS
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-outfit">
                  {selectedReview.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="font-bold text-slate-700">Star Rating Given:</span>
                <RatingStars rating={selectedReview.rating || 5} size="w-4 h-4" />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[10px] text-slate-400 block">
                  Review Text Message
                </span>
                <p className="text-slate-700 text-sm leading-relaxed font-medium italic">
                  "{selectedReview.review}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="block font-bold text-slate-800 uppercase">
                  Moderation Actions
                </span>
                <div className="flex items-center gap-3">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedReview._id, "approved")}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                      selectedReview.status === "approved"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" /> Approve Review
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedReview._id, "rejected")}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                      selectedReview.status === "rejected"
                        ? "bg-rose-600 text-white border-rose-600 shadow-md"
                        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    }`}
                  >
                    <XCircle className="w-4 h-4" /> Reject Review
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
              <span className="text-slate-400">Submitted: {formatDate(selectedReview.createdAt)}</span>
              <button
                onClick={() => setSelectedReview(null)}
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
              <h4 className="text-lg font-bold text-slate-900 font-outfit">Delete Customer Review?</h4>
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
                onClick={() => handleDeleteReview(deleteConfirmId)}
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
