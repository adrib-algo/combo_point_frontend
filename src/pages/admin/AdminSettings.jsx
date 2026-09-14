import React, { useState, useEffect } from "react";
import { Save, Building, Phone, Mail, MapPin, Globe, MessageSquare } from "lucide-react";
import API from "../../services/api";
import { useSettings } from "../../context/SettingsContext";

export default function AdminSettings() {
  const { settings, refreshSettings } = useSettings();

  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    businessHours: "",
    aboutText: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: ""
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || "",
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        email: settings.email || "",
        address: settings.address || "",
        businessHours: settings.businessHours || "",
        aboutText: settings.aboutText || "",
        facebook: settings.socialLinks?.facebook || "",
        instagram: settings.socialLinks?.instagram || "",
        twitter: settings.socialLinks?.twitter || "",
        youtube: settings.socialLinks?.youtube || ""
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      const payload = {
        companyName: formData.companyName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        address: formData.address,
        businessHours: formData.businessHours,
        aboutText: formData.aboutText,
        socialLinks: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter,
          youtube: formData.youtube
        }
      };

      await API.put("/settings", payload);
      await refreshSettings();
      setSuccessMsg("Website settings saved successfully!");
    } catch (err) {
      alert("Failed to save website settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 font-outfit">Website Settings</h2>
        <p className="text-xs text-slate-500">Update agency details, contact information, and WhatsApp hotline.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs font-bold">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Support Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">WhatsApp Number (for chat button)</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+919876543210"
              className="w-full px-4 py-2.5 border rounded-xl font-bold text-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Office Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Business Hours</label>
          <input
            type="text"
            value={formData.businessHours}
            onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-xl"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">About Agency Text</label>
          <textarea
            rows="3"
            value={formData.aboutText}
            onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-xl"
          ></textarea>
        </div>

        <div className="pt-4 border-t space-y-3">
          <h4 className="font-bold text-slate-900 uppercase">Social Media Handles</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="url"
              placeholder="Facebook URL"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="px-3 py-2 border rounded-xl"
            />
            <input
              type="url"
              placeholder="Instagram URL"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="px-3 py-2 border rounded-xl"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-teal-500/20 hover:opacity-95 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
