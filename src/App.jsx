import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";

// Customer Pages
import { Menu } from "./pages/Menu";
import { About } from "./pages/About";
import { Reviews } from "./pages/Reviews";
import { OrderSuccess } from "./pages/OrderSuccess";

// Admin Pages
import { Login } from "./pages/admin/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { Orders } from "./pages/admin/Orders";
import { OrderDetail } from "./pages/admin/OrderDetail";
import { MenuManagement } from "./pages/admin/MenuManagement";
import { ReviewManagement } from "./pages/admin/ReviewManagement";
import { BusinessInfo } from "./pages/admin/BusinessInfo";
import { Settings } from "./pages/admin/Settings";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Navigate to="/menu" replace />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/menu"
                element={
                  <ProtectedRoute>
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  <ProtectedRoute>
                    <ReviewManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/business"
                element={
                  <ProtectedRoute>
                    <BusinessInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Catch all fallback to /menu */}
              <Route path="*" element={<Navigate to="/menu" replace />} />
            </Routes>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
