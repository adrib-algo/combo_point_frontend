import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { useSettings } from "../../context/SettingsContext";
import { ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, ShieldAlert, Store, Clock, Sparkles } from "lucide-react";

export const Settings = () => {
  const { fetchSettings } = useSettings();
  const [formData, setFormData] = useState({
    freeTasteMode: true,
    deliveryTimeEnabled: false,
    acceptOrders: true,
    storeStatus: "OPEN"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/settings");
        if (res.data.success && res.data.settings) {
          setFormData(res.data.settings);
        }
      } catch (err) {
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggle = async (key, value) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    try {
      setSaving(true);
      setMessage("");
      const res = await API.patch("/admin/settings", updated);
      if (res.data.success) {
        setMessage("Settings successfully updated!");
        fetchSettings();
      }
    } catch (err) {
      setError("Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Operational Settings & Toggles">
      <div className="space-y-6 max-w-3xl">
        <p className="text-xs text-slate-500 font-medium">Control live ordering behavior, store status, and campaign features without rebuilding code.</p>

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

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Free Taste Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" /> Free Taste Campaign Mode
              </div>
              <p className="text-xs text-slate-600">Initial MVP campaign state. Bypasses online payment requirement.</p>
            </div>
            <button
              onClick={() => handleToggle("freeTasteMode", !formData.freeTasteMode)}
              className="p-1"
            >
              {formData.freeTasteMode ? (
                <ToggleRight className="w-10 h-10 text-amber-600" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          {/* Delivery Time Selector */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Clock className="w-4 h-4 text-blue-600" /> Preferred Delivery Time Selection
              </div>
              <p className="text-xs text-slate-600">Controls whether customers can pick a preferred delivery time slot at checkout.</p>
            </div>
            <button
              onClick={() => handleToggle("deliveryTimeEnabled", !formData.deliveryTimeEnabled)}
              className="p-1"
            >
              {formData.deliveryTimeEnabled ? (
                <ToggleRight className="w-10 h-10 text-blue-600" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          {/* Accept Orders Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <ShieldAlert className="w-4 h-4 text-orange-600" /> Accept New Orders
              </div>
              <p className="text-xs text-slate-600">When OFF, customer order placement is blocked at frontend and backend.</p>
            </div>
            <button
              onClick={() => handleToggle("acceptOrders", !formData.acceptOrders)}
              className="p-1"
            >
              {formData.acceptOrders ? (
                <ToggleRight className="w-10 h-10 text-orange-600" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          {/* Store Status OPEN / CLOSED */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Store className="w-4 h-4 text-emerald-600" /> Store Operational Status
              </div>
              <p className="text-xs text-slate-600">Set stall status to OPEN or CLOSED. Shows banner alert on customer site.</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-xl">
              <button
                onClick={() => handleToggle("storeStatus", "OPEN")}
                className={"px-3 py-1 rounded-lg text-xs font-extrabold transition-all " +
                  (formData.storeStatus === "OPEN" ? "bg-emerald-600 text-white shadow" : "text-slate-600")
                }
              >
                OPEN
              </button>
              <button
                onClick={() => handleToggle("storeStatus", "CLOSED")}
                className={"px-3 py-1 rounded-lg text-xs font-extrabold transition-all " +
                  (formData.storeStatus === "CLOSED" ? "bg-red-600 text-white shadow" : "text-slate-600")
                }
              >
                CLOSED
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
