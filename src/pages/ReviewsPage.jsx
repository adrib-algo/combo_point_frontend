import React, { useState, useEffect } from "react";
import { MessageSquareQuote, CheckCircle, Send } from "lucide-react";
import API from "../services/api";
import RatingStars from "../components/common/RatingStars";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 5.0 });
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews");
      setReviews(res.data.reviews || []);
      setStats(res.data.stats || { totalReviews: 0, averageRating: 5.0 });
    } catch (err) {
      console.error("Error loading reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !review) {
      setErrorMsg("Please fill out your name and review message.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setFeedback("");

    try {
      const res = await API.post("/reviews", { name, rating, review });
      setFeedback(res.data.message || "Thank you! Your review has been submitted for admin approval.");
      setName("");
      setReview("");
      setRating(5);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 mb-12 text-center overflow-hidden shadow-xl rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
          alt="Reviews Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/40 to-slate-950/60"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold text-teal-400 tracking-widest">Real Traveler Stories</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-outfit">Reviews & Ratings</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Read genuine feedback from travelers who explored the world with Azure Horizons.
        </p>

        <div className="max-w-md mx-auto pt-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex items-center justify-around">
            <div className="text-center">
              <span className="text-4xl font-black text-white font-outfit">{stats.averageRating || 5.0}</span>
              <div className="mt-1">
                <RatingStars rating={Math.round(stats.averageRating || 5)} size="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-300 mt-1 uppercase font-bold">Overall Rating</p>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-center">
              <span className="text-4xl font-black text-teal-400 font-outfit">{stats.totalReviews || reviews.length}</span>
              <p className="text-[11px] text-slate-300 mt-1 uppercase font-bold">Total Approved Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-teal-600" /> Customer Testimonials
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-36 rounded-2xl skeleton-shimmer"></div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md space-y-3 flex flex-col justify-between">
                  <div>
                    <RatingStars rating={rev.rating} />
                    <p className="text-xs text-slate-600 italic mt-3 leading-relaxed">
                      "{rev.review}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 font-outfit">{rev.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500">
              No public reviews yet. Be the first to share your experience!
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl h-fit">
          <h3 className="text-xl font-bold text-slate-900 font-outfit mb-1">Share Your Travel Experience</h3>
          <p className="text-xs text-slate-500 mb-6">Your feedback helps us continuously elevate our tour services.</p>

          {feedback ? (
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">{feedback}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priyanshu Roy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Rating (1 to 5 Stars) <span className="text-rose-500">*</span>
                </label>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-center">
                  <RatingStars rating={rating} onChange={(r) => setRating(r)} size="w-6 h-6" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Your Review <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us about the hotel accommodation, food, guide service, and places visited..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sunset-500 to-sunset-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sunset-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? "Submitting..." : (
                  <>
                    <Send className="w-4 h-4" /> Submit Review
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
