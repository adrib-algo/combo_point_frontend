import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { useSettings } from "../../context/SettingsContext";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

export const BusinessInfo = () => {
  const { fetchBusiness } = useSettings();
  const [formData, setFormData] = useState({
    bannerUrl: "",
    aboutText: "",
    physicalLocation: "",
    contactPhone: "",
    contactEmail: "",
    socialLinks: { facebook: "", instagram: "", whatsapp: "" }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/business");
        if (res.data.success && res.data.business) {
          setFormData(res.data.business);
        }
      } catch (err) {
        setError("Failed to load business details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      setSaving(true);
      const res = await API.patch("/admin/business", formData);
      if (res.data.success) {
        setMessage("Business information successfully updated!");
        fetchBusiness();
      }
    } catch (err) {
      setError("Failed to update business details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Business Information Management">
      <div className="space-y-6 max-w-3xl">
        <p className="text-xs text-slate-500 font-medium">Edit the public stall information displayed on the About page.</p>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Banner Image URL</label>
            <input
              type="url"
              required
              value={formData.bannerUrl || ""}
              onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">About Stall Description</label>
            <textarea
              required
              rows="4"
              value={formData.aboutText || ""}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Physical Stall Location</label>
            <input
              type="text"
              required
              value={formData.physicalLocation || ""}
              onChange={(e) => setFormData({ ...formData, physicalLocation: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={formData.contactPhone || ""}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={formData.contactEmail || ""}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 text-orange-400" /> {saving ? "Saving Changes..." : "Save Business Info"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};
