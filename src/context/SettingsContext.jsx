import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    freeTasteMode: true,
    deliveryTimeEnabled: false,
    acceptOrders: true,
    storeStatus: "OPEN",
    mainOrderMode: "PRE-ORDER",
    preOrderAdvanceHours: 24,
    minimumPrepHours: 1,
    freeTasteMaxPerPhone: 1
  });

  const [business, setBusiness] = useState({
    bannerUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    aboutText: "Combo Point offers delicious food combos and momos at New Barrackpore.",
    physicalLocation: "New Barrackpore, near Axis Bank, opposite Monda Mithai Store",
    contactPhone: "7439709997",
    contactEmail: "combopointcafe@gmail.com",
    socialLinks: {}
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await API.get("/settings");
      if (res.data.success && res.data.settings) {
        setSettings(prev => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const fetchBusiness = async () => {
    try {
      const res = await API.get("/business");
      if (res.data.success && res.data.business) {
        setBusiness(res.data.business);
      }
    } catch (err) {
      console.error("Error fetching business info:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchSettings(), fetchBusiness()]);
      setLoading(false);
    };
    loadAll();

    // Auto-poll settings every 10 seconds to reflect Admin live toggle changes instantly
    const interval = setInterval(() => {
      fetchSettings();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        business,
        loading,
        fetchSettings,
        fetchBusiness
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
