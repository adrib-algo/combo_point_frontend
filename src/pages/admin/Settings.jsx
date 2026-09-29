import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { useSettings } from "../../context/SettingsContext";
import { ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, ShieldAlert, Store, Clock, Sparkles, Sliders } from "lucide-react";

export const Settings = () => {
  const { fetchSettings } = useSettings();
  const [formData, setFormData] = useState({
    freeTasteMode: true,
    deliveryTimeEnabled: false,
    acceptOrders: true,
    storeStatus: "OPEN",
    mainOrderMode: "PRE-ORDER",
    preOrderAdvanceHours: 24,
    minimumPrepHours: 1,
    freeTasteMaxPerPhone: 1
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/admin/settings");
        if (res.data.success && res.data.settings) {
          setFormData(prev => ({ ...prev, ...res.data.settings }));
        }
      } catch (err) {
        setError("Failed to load settings.");
      }
    };
    load();
  }, []);

  const handleUpdate = async (updatedFields) => {
    const updated = { ...formData, ...updatedFields };
    setFormData(updated);
    try {
      setSaving(true);
      setMessage("");
      setError("");
      const res = await API.patch("/admin/settings", updated);
      if (res.data.success) {
        setMessage("Order Settings updated successfully!");
        fetchSettings();
      }
    } catch (err) {
      setError("Failed to update setting.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Order Settings & Operational Toggles">
      <div className="space-y-6 max-w-3xl">
        <p className="text-xs text-slate-500 font-medium">Configure live ordering modes, Free Taste campaign status, pre-order deadlines, and prep times.</p>

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
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-amber-950 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" /> Free Taste Campaign
              </div>
              <p className="text-xs text-slate-600">Controls whether customers can view and submit Free Taste requests.</p>
            </div>
            <button
              onClick={() => handleUpdate({ freeTasteMode: !formData.freeTasteMode })}
              className="p-1"
            >
              {formData.freeTasteMode ? (
                <ToggleRight className="w-10 h-10 text-amber-600" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Sliders className="w-4 h-4 text-orange-600" /> Main Order Operating Mode
                </div>
                <p className="text-xs text-slate-600">Switch between 24-hour advance Pre-Order and Immediate Instant Order.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleUpdate({ mainOrderMode: "PRE-ORDER" })}
                className={"p-3.5 rounded-2xl border text-left transition-all " +
                  (formData.mainOrderMode === "PRE-ORDER"
                    ? "border-orange-500 bg-orange-50/80 ring-2 ring-orange-500 text-orange-950 font-extrabold shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100")
                }
              >
                <div className="text-xs font-black">○ Pre-Order Mode</div>
                <div className="text-[11px] font-normal text-slate-500 mt-1">Requires delivery date & 24h advance placement.</div>
              </button>

              <button
                type="button"
                onClick={() => handleUpdate({ mainOrderMode: "INSTANT" })}
                className={"p-3.5 rounded-2xl border text-left transition-all " +
                  (formData.mainOrderMode === "INSTANT"
                    ? "border-orange-500 bg-orange-50/80 ring-2 ring-orange-500 text-orange-950 font-extrabold shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100")
                }
              >
                <div className="text-xs font-black">○ Instant Order Mode</div>
                <div className="text-[11px] font-normal text-slate-500 mt-1">Immediate order placement for current prep.</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Clock className="w-4 h-4 text-blue-600" /> Pre-Order Advance Requirement
              </div>
              <p className="text-xs text-slate-600">Hours required before target delivery date/time.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="72"
                value={formData.preOrderAdvanceHours}
                onChange={(e) => setFormData({ ...formData, preOrderAdvanceHours: Number(e.target.value) })}
                className="w-16 px-2.5 py-1 text-xs font-extrabold rounded-xl border border-slate-300 text-center"
              />
              <span className="text-xs font-bold text-slate-700">Hours</span>
              <button
                onClick={() => handleUpdate({ preOrderAdvanceHours: formData.preOrderAdvanceHours })}
                className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-xl hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Clock className="w-4 h-4 text-emerald-600" /> Minimum Preparation Time
              </div>
              <p className="text-xs text-slate-600">Configured prep duration for instant stall orders.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="12"
                value={formData.minimumPrepHours}
                onChange={(e) => setFormData({ ...formData, minimumPrepHours: Number(e.target.value) })}
                className="w-16 px-2.5 py-1 text-xs font-extrabold rounded-xl border border-slate-300 text-center"
              />
              <span className="text-xs font-bold text-slate-700">Hour(s)</span>
              <button
                onClick={() => handleUpdate({ minimumPrepHours: formData.minimumPrepHours })}
                className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-xl hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <ShieldAlert className="w-4 h-4 text-orange-600" /> Accept New Orders
              </div>
              <p className="text-xs text-slate-600">When OFF, order placement is blocked across the app.</p>
            </div>
            <button
              onClick={() => handleUpdate({ acceptOrders: !formData.acceptOrders })}
              className="p-1"
            >
              {formData.acceptOrders ? (
                <ToggleRight className="w-10 h-10 text-orange-600" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
