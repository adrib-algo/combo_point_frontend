import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { PlaceOrderModal } from "../components/customer/PlaceOrderModal";
import { Star, MessageSquare, CheckCircle, Sparkles, Send } from "lucide-react";

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: "", rating: 5, reviewText: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get("/reviews");
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name || !formData.reviewText) {
      setError("Please fill in your name and review text.");
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await API.post("/reviews", formData);
      if (res.data.success) {
        setSuccessMessage(res.data.message || "Thank you! Your review has been submitted for moderation.");
        setFormData({ name: "", rating: 5, reviewText: "" });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const featuredReviews = reviews.filter((r) => r.isFeatured);
  const otherReviews = reviews.filter((r) => !r.isFeatured);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar onOpenCart={() => setIsCartModalOpen(true)} />

        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-10 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/90 text-white text-xs font-bold mb-3 shadow">
              <Star className="w-3.5 h-3.5 fill-current" /> Customer Feedback
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Combo Point Customer Reviews
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              See what food lovers in New Barrackpore are saying about our delicious combos & momos!
            </p>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
          {/* Featured Reviews */}
          {featuredReviews.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Featured Customer Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredReviews.map((r) => (
                  <div
                    key={r._id}
                    className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-2 relative"
                  >
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={"w-4 h-4 " + (i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 font-medium italic">"{r.reviewText}"</p>
                    <p className="text-xs font-extrabold text-slate-900">• {r.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Approved Reviews Grid */}
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" /> All Customer Reviews
            </h2>
            {loading ? (
              <div className="text-center py-10 text-xs text-slate-500">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-500 border border-slate-100">
                No reviews yet. Be the first to leave a review!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((r) => (
                  <div key={r._id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={"w-3.5 h-3.5 " + (i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.reviewText}</p>
                    <div className="pt-2 border-t border-slate-50 text-[11px] font-bold text-slate-900 flex justify-between items-center">
                      <span>{r.name}</span>
                      <span className="text-slate-400 font-normal">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Write a Review Form */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm max-w-2xl mx-auto">
            <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center gap-2">
              <Send className="w-5 h-5 text-orange-600" /> Leave a Review
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Share your dining experience with us! Submitted reviews are moderated before publishing.
            </p>

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Roy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={"w-6 h-6 " + (star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-slate-300")}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">{formData.rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Comments *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Tell us what you liked about the food..."
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                {submitLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </section>
        </main>
      </div>

      <Footer />
      <PlaceOrderModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </div>
  );
};
