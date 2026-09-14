import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Sparkles, Check, X, Eye } from "lucide-react";
import API from "../../services/api";

export default function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  const initialForm = {
    title: "",
    destination: "",
    imageUrl: "",
    description: "",
    duration: "5 Days / 4 Nights",
    startDate: "",
    endDate: "",
    price: 9999,
    lastBookingDate: "",
    maxTravelers: 20,
    active: true,
    featured: false
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchTours = async () => {
    try {
      const res = await API.get("/tours?activeOnly=false");
      setTours(res.data);
    } catch (err) {
      console.error("Error fetching admin tours", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleOpenCreate = () => {
    setEditingTour(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      destination: tour.destination,
      imageUrl: tour.images && tour.images[0] ? tour.images[0] : "",
      description: tour.description,
      duration: tour.duration,
      startDate: tour.startDate ? tour.startDate.split("T")[0] : "",
      endDate: tour.endDate ? tour.endDate.split("T")[0] : "",
      price: tour.price,
      lastBookingDate: tour.lastBookingDate ? tour.lastBookingDate.split("T")[0] : "",
      maxTravelers: tour.maxTravelers || 20,
      active: tour.active,
      featured: tour.featured
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        images: formData.imageUrl ? [formData.imageUrl] : []
      };

      if (editingTour) {
        await API.put(`/tours/${editingTour._id}`, payload);
      } else {
        await API.post("/tours", payload);
      }
      setModalOpen(false);
      fetchTours();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save tour package.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tour package?")) return;
    try {
      await API.delete(`/tours/${id}`);
      fetchTours();
    } catch (err) {
      alert("Failed to delete tour package.");
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      await API.put(`/tours/${id}/feature`);
      fetchTours();
    } catch (err) {
      alert("Failed to set featured tour.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">Tour Packages Management</h2>
          <p className="text-xs text-slate-500">Create, modify, toggle active state, or set featured promotional trips.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Tour
        </button>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-4">Tour Title & Destination</th>
                <th className="p-4">Duration & Price</th>
                <th className="p-4">Trip Dates</th>
                <th className="p-4">Status & Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tours.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900">
                    <div>
                      <span className="font-outfit text-sm block">{t.title}</span>
                      <span className="text-teal-600 font-semibold">{t.destination}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800">₹{t.price?.toLocaleString("en-IN")}</span>
                    <span className="text-slate-500 block text-[10px]">{t.duration}</span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span>{t.startDate ? new Date(t.startDate).toLocaleDateString() : "N/A"}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${t.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                        {t.active ? "Active" : "Inactive"}
                      </span>
                      {t.featured && (
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-sunset-500 text-white flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {!t.featured && (
                      <button
                        onClick={() => handleToggleFeature(t._id)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold hover:bg-amber-100"
                        title="Set as homepage big announcement"
                      >
                        Feature
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold font-outfit text-slate-900">
              {editingTour ? "Edit Tour Package" : "Create New Tour Package"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tour Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Darjeeling Misty Peaks Explorer"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Darjeeling, West Bengal"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="5 Days / 4 Nights"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Booking Date</label>
                  <input
                    type="date"
                    value={formData.lastBookingDate}
                    onChange={(e) => setFormData({ ...formData, lastBookingDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="accent-teal-600"
                  />
                  <span>Active & Searchable</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 text-white font-bold"
                >
                  Save Tour Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
