import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { Star, Check, X, Sparkles } from "lucide-react";

export const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/reviews");
      if (res.data.success) setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdate = async (id, status, isFeatured) => {
    try {
      const res = await API.patch("/admin/reviews/" + id, { status, isFeatured });
      if (res.data.success) {
        setReviews(reviews.map((r) => (r._id === id ? res.data.review : r)));
      }
    } catch (err) {
      console.error("Update review error:", err);
    }
  };

  return (
    <AdminLayout title="Customer Review Moderation">
      <div className="space-y-6">
        <p className="text-xs text-slate-500 font-medium">Moderate incoming customer reviews and feature highlights on the public website.</p>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          {loading ? (
            <p className="text-xs text-slate-500 py-10 text-center">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No reviews submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className={"p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 " +
                    (r.status === "PENDING" ? "bg-amber-50/60 border-amber-200" : "bg-slate-50/50 border-slate-100")
                  }
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{r.name}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={"w-3.5 h-3.5 " + (i < r.rating ? "fill-amber-400" : "text-slate-300")} />
                        ))}
                      </div>
                      <span className={"text-[10px] font-extrabold uppercase px-2 py-0.5 rounded " +
                        (r.status === "PENDING" ? "bg-amber-200 text-amber-900" :
                        r.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")
                      }>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.reviewText}"</p>
                    <p className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {r.status === "APPROVED" && (
                      <button
                        onClick={() => handleUpdate(r._id, r.status, !r.isFeatured)}
                        className={"flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all " +
                          (r.isFeatured ? "bg-amber-500 text-white border-amber-600" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100")
                        }
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {r.isFeatured ? "Featured" : "Feature"}
                      </button>
                    )}

                    {r.status !== "APPROVED" && (
                      <button
                        onClick={() => handleUpdate(r._id, "APPROVED", r.isFeatured)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {r.status !== "REJECTED" && (
                      <button
                        onClick={() => handleUpdate(r._id, "REJECTED", false)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
