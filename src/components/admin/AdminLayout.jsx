import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Utensils, Star, Building, Settings, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AdminLayout = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { label: "Menu CRUD", path: "/admin/menu", icon: Utensils },
    { label: "Review Moderation", path: "/admin/reviews", icon: Star },
    { label: "Business Info", path: "/admin/business", icon: Building },
    { label: "Settings", path: "/admin/settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">??</span>
              <div>
                <h1 className="font-extrabold text-white text-base tracking-tight">COMBO POINT</h1>
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={"flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors " +
                    (active ? "bg-orange-600 text-white font-bold shadow-sm" : "hover:bg-slate-800 text-slate-400 hover:text-white")
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Customer Menu View
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/50 px-3 py-2 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout ({user?.username || "Admin"})
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {title && (
            <div className="mb-6 pb-4 border-b border-slate-200">
              <h1 className="font-extrabold text-2xl text-slate-900">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};
