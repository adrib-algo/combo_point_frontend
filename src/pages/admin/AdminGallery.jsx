import React, { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import API from "../../services/api";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Destinations");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = ["Mountains", "Beaches", "Adventure", "Group Trips", "Destinations", "Events"];

  const fetchGallery = async () => {
    try {
      const res = await API.get("/gallery");
      setImages(res.data);
    } catch (err) {
      console.error("Gallery fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageUrl) return alert("Please enter an image URL");

    try {
      await API.post("/gallery", { title, category, imageUrl });
      setTitle("");
      setImageUrl("");
      fetchGallery();
    } catch (err) {
      alert("Failed to upload image.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery image?")) return;
    try {
      await API.delete(`/gallery/${id}`);
      fetchGallery();
    } catch (err) {
      alert("Failed to delete image.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">Gallery Management</h2>
        <p className="text-xs text-slate-500">Upload travel photos to display on the public gallery page.</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-xl">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Add New Photo</h3>
        <form onSubmit={handleUpload} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Photo Title</label>
              <input
                type="text"
                placeholder="e.g. Darjeeling Sunset"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl font-semibold bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md"
          >
            Publish to Gallery
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((item) => (
          <div key={item._id} className="relative group rounded-2xl overflow-hidden h-48 bg-slate-900 border border-slate-200 shadow-sm">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
              <button
                onClick={() => handleDelete(item._id)}
                className="p-2.5 bg-rose-600 text-white rounded-xl shadow hover:bg-rose-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded">
              {item.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
