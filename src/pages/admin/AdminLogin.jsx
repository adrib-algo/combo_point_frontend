import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { admin, login, setup, hasAdminSetup } = useAuth();
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  
  // Setup fields
  const [setupUsername, setSetupUsername] = useState("");
  const [setupEmail, setSetupEmail] = useState("");
  const [setupPassword, setSetupPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (admin) {
      navigate("/admin/dashboard");
    }
  }, [admin, navigate]);

  useEffect(() => {
    if (!hasAdminSetup) {
      setIsSetupMode(true);
    }
  }, [hasAdminSetup]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError("Please enter your username/email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(usernameOrEmail, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.message || "Invalid username/email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    if (!setupUsername || !setupEmail || !setupPassword) {
      setError("Please fill out all setup fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await setup(setupUsername, setupEmail, setupPassword);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Setup failed", err);
      setError(err.response?.data?.message || "Failed to create admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sunset-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-sunset-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-7 h-7" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-white font-outfit tracking-tight pt-2">
            Azure Horizons
          </h2>
          <span className="text-xs uppercase font-bold text-teal-400 tracking-widest block">
            {isSetupMode ? "Initial Admin Setup" : "Admin Portal Authentication"}
          </span>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {!isSetupMode ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">
                Username or Email *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="admin or admin@azurehorizons.com"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Login to Admin Dashboard
                </>
              )}
            </button>
          </form>
        ) : (
          /* Initial Setup Form */
          <form onSubmit={handleSetupSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">
                Admin Username *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. admin"
                value={setupUsername}
                onChange={(e) => setSetupUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">
                Admin Email *
              </label>
              <input
                type="email"
                required
                placeholder="admin@azurehorizons.com"
                value={setupEmail}
                onChange={(e) => setSetupEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase mb-1.5">
                Admin Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a strong password"
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sunset-500 to-amber-500 hover:from-sunset-600 hover:to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              {loading ? "Creating Account..." : "Complete Admin Setup"}
            </button>
          </form>
        )}

        {/* Return Link */}
        <div className="pt-4 border-t border-slate-700/60 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
