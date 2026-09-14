import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import API from "../../services/api";
import { Plus, Edit, Trash2, Check, X, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";

export const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "Combos",
    isAvailable: true
  });

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get("/menu");
      if (res.data.success) setItems(res.data.items || []);
    } catch (err) {
      setError("Failed to fetch menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "Combos",
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category || "Combos",
      isAvailable: item.isAvailable
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (item) => {
    try {
      const res = await API.patch("/admin/menu/" + item._id, { isAvailable: !item.isAvailable });
      if (res.data.success) {
        setItems(items.map((i) => (i._id === item._id ? res.data.item : i)));
      }
    } catch (err) {
      setError("Failed to toggle availability.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const res = await API.delete("/admin/menu/" + id);
      if (res.data.success) {
        setItems(items.filter((i) => i._id !== id));
        setMessage("Item deleted successfully.");
      }
    } catch (err) {
      setError("Failed to delete menu item.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingItem) {
        const res = await API.patch("/admin/menu/" + editingItem._id, formData);
        if (res.data.success) {
          setItems(items.map((i) => (i._id === editingItem._id ? res.data.item : i)));
          setMessage("Menu item updated successfully.");
        }
      } else {
        const res = await API.post("/admin/menu", formData);
        if (res.data.success) {
          setItems([res.data.item, ...items]);
          setMessage("New menu item created successfully.");
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save menu item.");
    }
  };

  return (
    <AdminLayout title="Menu Items Management">
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Add, edit, or toggle availability of food items for the stall menu.</p>
          <button
            onClick={handleOpenAddModal}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Food Item
          </button>
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Menu Grid / Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          {loading ? (
            <p className="text-xs text-slate-500 py-10 text-center">Loading menu...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item._id} className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-slate-50/50">
                  <div className="flex items-start gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-200" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="font-extrabold text-orange-600 text-sm">?{item.price}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={"flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-colors " +
                        (item.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")
                      }
                    >
                      {item.isAvailable ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-red-600" />}
                      {item.isAvailable ? "Available" : "Disabled"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price (?) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="Combos">Combos</option>
                      <option value="Momos">Momos</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Specials">Specials</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isAvailableCheck"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="isAvailableCheck" className="font-bold text-slate-700">
                    Available for customer ordering
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl uppercase tracking-wider shadow-md transition-all mt-2"
                >
                  {editingItem ? "Save Changes" : "Create Item"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
