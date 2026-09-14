import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Palmtree, CalendarCheck, MessageSquare, Image, ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react";
import API from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTours: 0,
    upcomingTours: 0,
    totalBookings: 0,
    pendingReviews: 0,
    galleryCount: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingReviewsList, setPendingReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [toursRes, upcomingRes, bookRes, revRes, galRes] = await Promise.all([
        API.get("/tours?activeOnly=false"),
        API.get("/tours/upcoming"),
        API.get("/bookings"),
        API.get("/reviews/admin"),
        API.get("/gallery")
      ]);

      const allBookings = bookRes.data || [];
      const allReviews = revRes.data || [];

      setStats({
        totalTours: toursRes.data.length,
        upcomingTours: upcomingRes.data.length,
        totalBookings: allBookings.length,
        pendingReviews: allReviews.filter(r => r.status === "pending").length,
        galleryCount: galRes.data.length
      });

      setRecentBookings(allBookings.slice(0, 5));
      setPendingReviewsList(allReviews.filter(r => r.status === "pending").slice(0, 5));
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleReviewAction = async (id, status) => {
    try {
      await API.put(`/reviews/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert("Failed to update review status");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">Dashboard Overview</h2>
        <p className="text-xs text-slate-500">Real-time statistics & quick management controls.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
            <Palmtree className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-outfit">{stats.totalTours}</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase block">Total Tours</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sunset-500/10 text-sunset-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-outfit">{stats.upcomingTours}</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase block">Upcoming Trips</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-outfit">{stats.totalBookings}</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase block">Bookings</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-outfit">{stats.pendingReviews}</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase block">Pending Reviews</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <Image className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 font-outfit">{stats.galleryCount}</span>
            <span className="text-[11px] text-slate-500 font-bold uppercase block">Gallery Photos</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings & Pending Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-outfit">Recent Booking Requests</h3>
            <Link to="/admin/bookings" className="text-xs text-teal-600 font-bold hover:underline">
              View All →
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{b.customerName} ({b.phone})</h4>
                    <p className="text-slate-500 mt-0.5">{b.tourName} • {b.travelers} Travelers</p>
                  </div>
                  <select
                    value={b.status}
                    onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg border text-xs font-bold bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No bookings recorded yet.</p>
          )}
        </div>

        {/* Pending Reviews Queue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-outfit">Pending Review Approval</h3>
            <Link to="/admin/reviews" className="text-xs text-teal-600 font-bold hover:underline">
              Manage Queue →
            </Link>
          </div>

          {pendingReviewsList.length > 0 ? (
            <div className="space-y-3">
              {pendingReviewsList.map((r) => (
                <div key={r._id} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between text-xs">
                  <div className="max-w-[70%]">
                    <span className="font-bold text-slate-900">{r.name} ({r.rating} ★)</span>
                    <p className="text-slate-600 line-clamp-1 italic mt-0.5">"{r.review}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReviewAction(r._id, "approved")}
                      className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewAction(r._id, "rejected")}
                      className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-[10px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No pending reviews requiring moderation.</p>
          )}
        </div>
      </div>
    </div>
  );
}
