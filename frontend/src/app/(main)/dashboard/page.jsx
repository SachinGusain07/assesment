"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthGuard from "@/utils/AuthGuard";

// Actions
import { fetchDevices, createDevice, deleteDevice } from "@/features/devices/deviceAction";
import { logoutUser } from "@/features/auth/authActions";

import { 
  Plus, Search, Trash2, Smartphone, Monitor, Apple, 
  ChevronLeft, ChevronRight, Loader2, LogOut, XCircle 
} from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux Store (Updated to include pagination info from backend)
  const { devices, loading, totalPages, currentPage: serverPage, error } = useSelector((state) => state.devices);
  const { user } = useSelector((state) => state.auth);

  // --- UI States for Backend Filtering ---
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Add Device Form State ---
  const [newDevice, setNewDevice] = useState({ name: "", platform: "" });
  const [formError, setFormError] = useState("");

  // 1. Fetch devices from Backend whenever filters or page change
  useEffect(() => {
    // Debounce search to avoid too many API calls
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchDevices({
        page: currentPage,
        limit: 5,
        name: searchTerm,
        platform: platformFilter,
        sortBy: sortBy
      }));
    }, 400); // 400ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, currentPage, searchTerm, platformFilter, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, platformFilter, sortBy]);

  // --- Handlers ---

  const handleAddDevice = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newDevice.name.trim()) return setFormError("Device name is required");
    if (!["android", "ios", "web"].includes(newDevice.platform)) 
        return setFormError("Select a valid platform");

    const result = await dispatch(createDevice(newDevice));
    
    if (createDevice.fulfilled.match(result)) {
      setIsModalOpen(false);
      setNewDevice({ name: "", platform: "" });
      // Refresh list to show the new item at the top
      setCurrentPage(1);
    } else {
        setFormError(result.payload || "Failed to create device");
    }
  };

  const handleDelete = (deviceId) => {
    if (window.confirm("Remove this device from the database?")) {
      dispatch(deleteDevice(deviceId));
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Smartphone className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">DeviceManager</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block border-r border-slate-200 pr-4">
              <p className="text-sm font-bold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button 
              onClick={() => dispatch(logoutUser())} 
              className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </nav>

        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search backend database..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                <select 
                  className="bg-transparent px-3 py-2 text-sm outline-none cursor-pointer font-medium text-slate-600"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                >
                  <option value="all">All Platforms</option>
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                  <option value="web">Web</option>
                </select>

                <div className="w-px h-4 bg-slate-200 mx-1"></div>

                <select 
                  className="bg-transparent px-3 py-2 text-sm outline-none cursor-pointer font-medium text-slate-600"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Latest</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <Plus size={20} /> Add Device
              </button>
            </div>
          </div>

          {/* Device Table Container */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
            {/* Loading Overlay */}
            {loading && (
               <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
               </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Identifier</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Device Name</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Platform</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {devices.length > 0 ? (
                    devices.map((device) => (
                      <tr key={device._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-5">
                          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                            {device._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-800">{device.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Added {new Date(device.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                            device.platform === 'ios' ? 'bg-slate-50 border-slate-200 text-slate-700' : 
                            device.platform === 'android' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-blue-50 border-blue-100 text-blue-700'
                          }`}>
                            {device.platform === 'ios' && <Apple size={14} />}
                            {device.platform === 'android' && <Smartphone size={14} />}
                            {device.platform === 'web' && <Monitor size={14} />}
                            {device.platform}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleDelete(device._id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : !loading && (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <XCircle className="text-slate-200" size={48} />
                           <p className="text-slate-400 font-medium">No devices found in this search.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-white">
              <div className="text-sm text-slate-400 font-medium">
                Page <span className="text-slate-800 font-bold">{currentPage}</span> of <span className="text-slate-800 font-bold">{totalPages || 1}</span>
              </div>
              <div className="flex gap-3">
                <button 
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-30 bg-white hover:bg-slate-50 transition-all text-sm font-bold text-slate-600"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button 
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-30 bg-white hover:bg-slate-50 transition-all text-sm font-bold text-slate-600"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Modal Logic Remains the same as previous */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
              <h2 className="text-2xl font-black text-slate-800 mb-2">New Device</h2>
              <p className="text-slate-400 text-sm mb-8 font-medium">Fill in the technical details below.</p>

              <form onSubmit={handleAddDevice} className="space-y-6">
                {formError && (
                  <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-3">
                    <XCircle size={16} /> {formError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Device Name</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                    placeholder="e.g. Production iPad"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Platform</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium cursor-pointer"
                    value={newDevice.platform}
                    onChange={(e) => setNewDevice({...newDevice, platform: e.target.value})}
                  >
                    <option value="">Select Platform</option>
                    <option value="android">Android OS</option>
                    <option value="ios">Apple iOS</option>
                    <option value="web">Web Browser</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/30">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default Dashboard;