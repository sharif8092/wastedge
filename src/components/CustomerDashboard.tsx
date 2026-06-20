import React, { useState, useRef, useEffect } from "react";
import { 
  Profile, 
  PickupRequest, 
  Category, 
  Notification,
  PickupRequestStatus
} from "../types";
import { supabase } from "../lib/supabase";
import { 
  INDIAN_STATES 
} from "../data";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  User, 
  LogOut, 
  Trash2, 
  Clock, 
  CheckCircle,
  Truck, 
  AlertTriangle, 
  Info,
  MapPin, 
  Camera, 
  X, 
  Menu, 
  Bell,
  Trash,
  Phone,
  FileText,
  Recycle
} from "lucide-react";

interface CustomerDashboardProps {
  profile: Profile;
  requests: PickupRequest[];
  categories: Category[];
  notifications: Notification[];
  onLogout: () => void;
  onCreateRequest: (request: Omit<PickupRequest, "id" | "customer_id" | "created_at" | "updated_at">) => void;
  onCancelRequest: (requestId: string) => void;
  onUpdateProfile: (name: string, phone: string) => void;
  onMarkNotificationRead: (notifId: string) => void;
  allProfiles: Profile[]; // to show assigned vendor business name
  onSwitchToVendor?: () => void;
}

export function CustomerDashboard({
  profile,
  requests,
  categories,
  notifications,
  onLogout,
  onCreateRequest,
  onCancelRequest,
  onUpdateProfile,
  onMarkNotificationRead,
  allProfiles,
  onSwitchToVendor
}: CustomerDashboardProps) {
  // Navigation tabs
  const [localRequests, setLocalRequests] = useState<PickupRequest[]>([]);
  const [localNotifs, setLocalNotifs] = useState<Notification[]>([]);
  const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: reqs } = await supabase.from('pickup_requests').select('*').eq('customer_id', profile.id).order('created_at', { ascending: false });
      if (reqs) setLocalRequests(reqs);

      const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
      if (notifs) setLocalNotifs(notifs);

      const { data: profs } = await supabase.from('profiles').select('*');
      if (profs) setLocalProfiles(profs);
    };
    fetchData();
  }, [profile.id]);

  const [activeTab, setActiveTab] = useState<"overview" | "new-request" | "history" | "profile">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  // Detail View State
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);

  // Forms states
  const [formCategory, setFormCategory] = useState(categories[0]?.id || "");
  const [formDescription, setFormDescription] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formStateVal, setFormStateVal] = useState(INDIAN_STATES[0]);
  const [formPincode, setFormPincode] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Edit Form State
  const [profileName, setProfileName] = useState(profile.full_name);
  const [profilePhone, setProfilePhone] = useState(profile.phone);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form error messages
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Total statistics calculations
  const myRequests = localRequests.filter(r => r.customer_id === profile.id);
  const pendingCount = myRequests.filter(r => r.status === "pending").length;
  const completedCount = myRequests.filter(r => r.status === "completed").length;
  const inProgressCount = myRequests.filter(r => ["assigned", "accepted", "in_progress"].includes(r.status)).length;

  // Filter requests
  const [historyFilter, setHistoryFilter] = useState<"all" | PickupRequestStatus>("all");
  const filteredHistory = myRequests.filter(r => {
    if (historyFilter === "all") return true;
    return r.status === historyFilter;
  });

  // Notifications for current customer
  const myNotifs = localNotifs.filter(n => n.user_id === profile.id);
  const unreadNotifCount = myNotifs.filter(n => !n.is_read).length;

  // Image upload triggers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      appendFiles(e.target.files);
    }
  };

  const appendFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith("image/"));
    
    if (validFiles.length + formImages.length > 5) {
      alert("A maximum of 5 images are allowed per pickup request.");
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      appendFiles(e.dataTransfer.files);
    }
  };

  // Create Request Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formCategory) errors.category = "Category is required";
    if (formDescription.length < 10) errors.description = "Please describe the items (minimum 10 characters)";
    if (formDescription.length > 500) errors.description = "Maximum 500 characters allowed";
    if (!formAddress.trim()) errors.address = "Street address is required";
    if (!formCity.trim()) errors.city = "City is required";
    if (!formPincode.trim() || formPincode.length !== 6 || isNaN(Number(formPincode))) {
      errors.pincode = "Please enter a valid 6-digit numeric Indian PIN code";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Call state provider insert
    const reqId = 'REQ-' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random()*1000);
    const { data: newReq, error } = await supabase.from('pickup_requests').insert({
      id: reqId,
      customer_id: profile.id,
      category_id: formCategory,
      description: formDescription,
      address: formAddress,
      city: formCity,
      state: formStateVal,
      pincode: formPincode,
      image_urls: formImages,
      status: "pending"
    }).select();
    if (error) {
      alert("Error creating request: " + error.message);
      return;
    }
    if (newReq) setLocalRequests([newReq[0], ...localRequests]);
    
    onCreateRequest({
      category_id: formCategory,
      description: formDescription,
      address: formAddress,
      city: formCity,
      state: formStateVal,
      pincode: formPincode,
      image_urls: formImages,
      status: "pending"
    });

    setFormErrors({});
    setFormDescription("");
    setFormAddress("");
    setFormCity("");
    setFormPincode("");
    setFormImages([]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab("history");
    }, 2000);
  };

  // Profile update submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setProfileMessage({ type: "error", text: "Full name cannot be blank." });
      return;
    }
    if (profilePhone.length !== 10 || isNaN(Number(profilePhone))) {
      setProfileMessage({ type: "error", text: "Phone number must be exactly 10 digits." });
      return;
    }

    onUpdateProfile(profileName, profilePhone);
    setProfileMessage({ type: "success", text: "Account profile records updated successfully!" });
    setTimeout(() => setProfileMessage(null), 3500);
  };

  // Helper helper to get Category Name from ID
  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.category_name : "General Waste";
  }

  const getStatusColor = (status: PickupRequestStatus) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      assigned: "bg-indigo-100 text-indigo-800 border-indigo-200",
      accepted: "bg-sky-100 text-sky-800 border-sky-200",
      in_progress: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Find vendor details
  const getVendorName = (vendorProfileId?: string) => {
    if (!vendorProfileId) return "Waiting for Admin Assignment";
    const v = localProfiles.find(p => p.id === vendorProfileId);
    return v ? `${v.full_name} (Collector)` : "Assigned Collector Service";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative font-sans">
      
      {/* Mobile Top Header Bar */}
      <header className="md:hidden bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green-600 text-white rounded-lg flex items-center justify-center shrink-0">
            <Recycle size={18} className="animate-spin-slow" />
          </div>
          <span className="font-bold text-slate-800 font-display text-sm">
            wastEdge<span className="text-brand-green-600 underline decoration-brand-sky-500 decoration-2">Solution</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNotifPanelOpen(!notifPanelOpen)} 
            className="p-2 relative bg-gray-50 rounded-lg text-gray-600"
          >
            <Bell size={20} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                {unreadNotifCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 bg-gray-100 rounded-lg text-gray-700"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Floating Notification Panel */}
      {notifPanelOpen && (
        <div className="fixed inset-0 bg-transparent z-50 flex justify-end" onClick={() => setNotifPanelOpen(false)}>
          <div 
            className="w-80 bg-white shadow-2xl h-full border-l border-gray-150 p-6 flex flex-col mt-[60px] md:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 animate-fade-in">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Bell className="text-brand-green-600" size={18} /> Notifications
              </h3>
              <button onClick={() => setNotifPanelOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {myNotifs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No notifications recorded yet.
                </div>
              ) : (
                myNotifs.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-3 rounded-xl border transition-all text-left relative ${
                      notif.is_read 
                        ? 'bg-gray-50/50 border-gray-100 text-gray-500' 
                        : 'bg-brand-green-50/70 border-brand-green-100 text-gray-800 shadow-xs'
                    }`}
                  >
                    <h4 className="font-semibold text-xs text-gray-800">{notif.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="block text-[9px] text-gray-400 mt-2">
                      {new Date(notif.created_at).toLocaleString("en-IN", { hour: "numeric", minute: "2-digit" })}
                    </span>
                    {!notif.is_read && (
                      <button 
                        onClick={() => onMarkNotificationRead(notif.id)}
                        className="absolute top-2 right-2 text-[9px] font-bold text-brand-green-700 hover:underline cursor-pointer"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Drawer Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-64 p-6 flex flex-col z-50 transform transition-transform duration-350 ease-in-out
        md:translate-x-0 md:static md:h-screen md:w-68
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-150">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 bg-brand-green-600 text-white rounded-xl flex items-center justify-center shrink-0">
              <Recycle size={20} className="animate-spin-slow" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800 font-display">
              wastEdge<span className="text-brand-green-600 underline decoration-brand-sky-500 decoration-3">Solution</span>
            </span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="bg-gray-50/80 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-gray-100">
          <img 
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-green-200" 
            src={profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"} 
            alt="customer profile placeholder avatar" 
          />
          <div className="text-left overflow-hidden">
            <span className="block font-bold text-sm text-gray-800 truncate leading-tight">{profile.full_name}</span>
            <span className="inline-flex py-0.5 px-2 bg-brand-green-100 text-brand-green-700 rounded-full text-[9px] font-semibold tracking-wider font-mono mt-1 uppercase">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="space-y-1.5 flex-1">
          <SidebarNavBtn 
            active={activeTab === "overview"} 
            onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
            icon={<LayoutDashboard size={18} />} 
            label="Overview Panel" 
          />
          <SidebarNavBtn 
            active={activeTab === "new-request"} 
            onClick={() => { setActiveTab("new-request"); setMobileMenuOpen(false); }}
            icon={<PlusCircle size={18} />} 
            label="New Pickup" 
          />
          <SidebarNavBtn 
            active={activeTab === "history"} 
            onClick={() => { setActiveTab("history"); setMobileMenuOpen(false); }}
            icon={<History size={18} />} 
            label="My Scrap Jobs" 
          />
          <SidebarNavBtn 
            active={activeTab === "profile"} 
            onClick={() => { setActiveTab("profile"); setMobileMenuOpen(false); }}
            icon={<User size={18} />} 
            label="Account Profile" 
          />
          {profile.role === "vendor" && onSwitchToVendor && (
            <div className="border-t border-slate-150 pt-4 mt-4">
              <button
                type="button"
                onClick={() => { onSwitchToVendor(); setMobileMenuOpen(false); }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 bg-brand-sky-50 text-brand-sky-650 hover:bg-brand-sky-100 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer border border-brand-sky-100/50"
              >
                <Truck size={18} className="animate-pulse" />
                <span>Collector Hub</span>
              </button>
            </div>
          )}
        </nav>

        {/* Info Box */}
        <div className="bg-brand-sky-50 rounded-2xl p-4 border border-brand-sky-100 text-left mb-6">
          <div className="flex gap-2 items-start text-brand-sky-700">
            <Info size={16} className="mt-0.5 shrink-0" />
            <div>
              <span className="block text-xs font-bold leading-normal">Fair Weighing</span>
              <span className="block text-[10px] text-gray-500 mt-0.5 leading-normal">Collectors arrive with calibrated handheld scales. Cash paid on spot.</span>
            </div>
          </div>
        </div>

        {/* Logout bottom */}
        <button 
          onClick={onLogout}
          className="w-full py-3.5 border border-red-100 text-red-500 bg-red-50 hover:bg-red-100/50 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      {/* Main panel container */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        
        {/* Desktop header metrics bar */}
        <div className="hidden md:flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
          <div className="text-left">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-display">
              Welcome back, {profile.full_name}!
            </h1>
            <p className="text-xs text-gray-400 mt-1">Ready to recycle household scrap today?</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Desktop Notification Selector */}
            <div className="relative">
              <button 
                onClick={() => setNotifPanelOpen(!notifPanelOpen)}
                className="p-3 bg-white border border-gray-150 rounded-xl text-gray-600 hover:bg-gray-50 transition cursor-pointer relative"
              >
                <Bell size={20} />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            </div>

            <div className="text-right">
              <span className="block text-xs text-gray-400 font-bold tracking-wider font-mono uppercase">User Session</span>
              <span className="text-sm font-semibold text-gray-700">Phone: +91 {profile.phone}</span>
            </div>
          </div>
        </div>

        {/* OVERVIEW PANEL */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
             {/* Quick dashboard metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-200 shadow-xl shadow-slate-100/40 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <span className="block text-slate-400 font-bold text-[10px] tracking-wider uppercase">Total Requests</span>
                <span className="block text-3xl font-black text-slate-800 mt-1.5">{myRequests.length}</span>
                <div className="absolute right-4 bottom-4 p-2.5 bg-slate-50 text-slate-500 rounded-2xl group-hover:bg-slate-100 transition-colors">
                  <History size={20} />
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-amber-100 shadow-xl shadow-amber-50/40 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <span className="block text-amber-650 font-bold text-[10px] tracking-wider uppercase">Pending Verification</span>
                <span className="block text-3xl font-black text-slate-800 mt-1.5">{pendingCount}</span>
                <div className="absolute right-4 bottom-4 p-2.5 bg-amber-50 text-amber-500 rounded-2xl group-hover:bg-amber-100 transition-colors animate-pulse">
                  <Clock size={20} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-sky-100 shadow-xl shadow-sky-50/40 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <span className="block text-brand-sky-600 font-bold text-[10px] tracking-wider uppercase">Active Pickups</span>
                <span className="block text-3xl font-black text-slate-800 mt-1.5">{inProgressCount}</span>
                <div className="absolute right-4 bottom-4 p-2.5 bg-sky-50 text-brand-sky-500 rounded-2xl group-hover:bg-sky-100 transition-colors">
                  <Truck size={20} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-emerald-100 shadow-xl shadow-emerald-50/40 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <span className="block text-brand-green-600 font-bold text-[10px] tracking-wider uppercase">Completed Orders</span>
                <span className="block text-3xl font-black text-slate-800 mt-1.5">{completedCount}</span>
                <div className="absolute right-4 bottom-4 p-2.5 bg-emerald-50 text-brand-green-600 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                  <CheckCircle size={20} />
                </div>
              </div>
            </div>

            {/* Quick Action Block */}
            <div className="bg-gradient-to-br from-brand-green-600 via-emerald-600 to-teal-700 rounded-[32px] p-8 md:p-10 text-white relative shadow-2xl shadow-emerald-700/20 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 mt-8 hover:shadow-emerald-600/30 transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-5 animate-pulse"></div>
              <div className="text-left max-w-xl relative z-10">
                <span className="inline-block bg-white/20 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-3">
                  Eco-Initiative Instant Form
                </span>
                <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight tracking-tight">Need scrap collected at your doorstep?</h2>
                <p className="text-emerald-100 text-xs md:text-sm font-medium leading-relaxed opacity-90">
                  Submit an interactive pickup request in seconds. Our verified nearby recycler agencies will immediately evaluate the live value rate and call to schedule collection!
                </p>
              </div>
              <button 
                onClick={() => setActiveTab("new-request")}
                className="px-8 py-4 bg-white text-brand-green-700 hover:text-white hover:bg-brand-green-850 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer relative z-10 border border-transparent hover:border-white/20"
              >
                + Create Request
              </button>
            </div>

            {/* Recent Requests list overview */}
            <div className="glass-card shadow-xl rounded-[28px] p-6 md:p-8 text-left hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <h3 className="font-bold text-gray-900 text-base">Your Active Requests</h3>
                <button 
                  onClick={() => { setActiveTab("history"); setHistoryFilter("all"); }}
                  className="text-xs text-brand-green-700 font-bold hover:underline cursor-pointer"
                >
                  View Histories
                </button>
              </div>

              {myRequests.filter(r => r.status !== "completed" && r.status !== "cancelled").length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <History size={26} />
                  </div>
                  <h4 className="font-bold text-gray-700 text-sm">No Active Scrap Pickup Assignments</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Create a collection request when ready. Your active tracking will display here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myRequests
                    .filter(r => r.status !== "completed" && r.status !== "cancelled")
                    .slice(0, 4)
                    .map(request => (
                      <div 
                        key={request.id}
                        className="bg-white/55 border border-white/70 p-5 rounded-2xl hover:border-brand-green-300 hover:shadow-lg transition-all duration-350 flex flex-col justify-between backdrop-blur-md"
                      >
                        <div className="text-left">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-xs text-gray-400 font-mono">Job #{request.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold font-mono tracking-wider uppercase ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-gray-800 text-sm font-display">{getCategoryName(request.category_id)}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{request.description}</p>
                          
                          <div className="flex items-center gap-1.5 mt-3 text-gray-400">
                            <MapPin size={12} />
                            <span className="text-[10px] font-semibold truncate max-w-full">{request.address}, {request.city}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                          <span className="text-[10px] text-gray-400">
                            Created: {new Date(request.created_at).toLocaleDateString("en-IN")}
                          </span>
                          <button 
                            onClick={() => { setSelectedRequest(request); }}
                            className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 font-bold text-[10px] rounded-lg hover:bg-gray-50 shadow-xs cursor-pointer"
                          >
                            Track Status & Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CREATE PICKUP REQUEST FORM */}
        {activeTab === "new-request" && (
          <div className="max-w-3xl glass-card rounded-[32px] p-6 md:p-10 text-left shadow-2xl animate-fade-in">
            <div className="pb-4 border-b border-gray-105 mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-display">Schedule Free Doorstep Pickup</h2>
              <p className="text-xs text-gray-400 mt-1 font-sans">Fill in waste descriptions, upload optional images, and tell vendors where to arrive.</p>
            </div>

            {submitSuccess ? (
              <div className="bg-brand-green-100 text-brand-green-800 border border-brand-green-200 p-8 rounded-2xl text-center flex flex-col items-center">
                <CheckCircle className="text-brand-green-600 w-16 h-16 mb-4 animate-scale" />
                <h3 className="text-lg font-bold">Scrap Pickup Scheduled!</h3>
                <p className="text-xs mt-1 text-brand-green-700">Thank you. Your request is registered as PENDING and dispatched to an administrator for vendor allocation.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="space-y-6">
                
                {/* Visual Alert */}
                <div className="bg-brand-green-50 border border-brand-green-150 p-4 rounded-xl flex gap-3 text-brand-green-800 text-xs">
                  <Info size={18} className="shrink-0" />
                  <p className="leading-relaxed">
                    <strong>Preloaded Info:</strong> We have attached details for customer <strong>{profile.full_name}</strong> (+91 {profile.phone}). Our collectors will use this line to initiate calls before cargo load.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category of Scrap</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green-500 focus:outline-hidden"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Pincode (6-digit Indian PIN)</label>
                    <input 
                      type="text"
                      maxLength={6}
                      value={formPincode}
                      onChange={(e) => setFormPincode(e.target.value)}
                      placeholder="E.g. 400001 (Mumbai)"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green-500 focus:outline-hidden"
                    />
                    {formErrors.pincode && (
                      <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> {formErrors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Provide Scrap Description</label>
                    <span className="text-[10px] font-semibold font-mono text-gray-400">
                      {formDescription.length} / 500
                    </span>
                  </div>
                  <textarea 
                    rows={4}
                    maxLength={500}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="E.g. Old textbooks, steel construction rods, or dead chargers. Mention estimated weight and pile size..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green-500 focus:outline-hidden"
                  ></textarea>
                  {formErrors.description && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertTriangle size={10} /> {formErrors.description}
                    </p>
                  )}
                </div>

                {/* Drag-and-Drop Image Uploader */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Upload Waste Images (Optional - Max 5 snaps)
                  </label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center cursor-pointer
                      ${isDragOver ? "border-brand-green-500 bg-brand-green-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100/50"}
                    `}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Camera className="text-gray-450 w-8 h-8 mb-2" />
                    <span className="block text-xs font-bold text-gray-700">Drag & Drop Waste snapshots here</span>
                    <span className="block text-[10px] text-gray-400 mt-1">Or click to browse storage files (PNG / JPEG)</span>
                  </div>

                  {/* Thumbnail gallery */}
                  {formImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 mt-4">
                      {formImages.map((b64, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-150 aspect-square">
                          <img src={b64} alt="waste preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeUploadedImage(index); }}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Street Address</label>
                    <input 
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="E.g. Flat, building, society unit..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green-500 focus:outline-hidden"
                    />
                    {formErrors.address && (
                      <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> {formErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">City</label>
                      <input 
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="E.g. Kalyan"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green-500 focus:outline-hidden"
                      />
                      {formErrors.city && (
                        <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertTriangle size={10} /> {formErrors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">State</label>
                      <select
                        value={formStateVal}
                        onChange={(e) => setFormStateVal(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green-500 focus:outline-hidden"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-extrabold text-sm tracking-widest rounded-xl shadow-md uppercase cursor-pointer"
                >
                  Create Recycling Request ♻️
                </button>
              </form>
            )}
          </div>
        )}

        {/* MY REQUESTS / HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-display">Recycling Request History</h2>
                <p className="text-xs text-gray-400 mt-1">Track progress, view logs, or cancel pending collections.</p>
              </div>

              {/* Status Filters */}
              <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-150 overflow-x-auto max-w-full">
                <FilterBtn active={historyFilter === "all"} onClick={() => setHistoryFilter("all")} label="All" />
                <FilterBtn active={historyFilter === "pending"} onClick={() => setHistoryFilter("pending")} label="Pending" />
                <FilterBtn active={historyFilter === "assigned"} onClick={() => setHistoryFilter("assigned")} label="Assigned" />
                <FilterBtn active={historyFilter === "accepted"} onClick={() => setHistoryFilter("accepted")} label="Accepted" />
                <FilterBtn active={historyFilter === "completed"} onClick={() => setHistoryFilter("completed")} label="Completed" />
                <FilterBtn active={historyFilter === "cancelled"} onClick={() => setHistoryFilter("cancelled")} label="Cancelled" />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="glass-card p-16 rounded-[28px] text-center shadow-lg">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <History size={26} />
                </div>
                <h4 className="font-bold text-gray-700 text-sm">No Scrap Request Entries Matches Filter</h4>
                <p className="text-xs text-gray-400 mt-1">Adjust filters or submit a new doorstep collection request.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredHistory.map((request) => (
                  <div 
                    key={request.id} 
                    className="glass-card p-5 rounded-2xl hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] text-gray-400 font-semibold">REF: #{request.id}</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wider font-mono uppercase ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-800 text-base font-display">{getCategoryName(request.category_id)}</h3>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{request.description}</p>

                      <div className="border-t border-gray-50 pt-3 mt-4 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pincode:</span>
                          <span className="font-semibold text-gray-700">{request.pincode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">City Location:</span>
                          <span className="font-semibold text-gray-700">{request.city}</span>
                        </div>
                        <div className="flex justify-between items-center gap-1 overflow-hidden">
                          <span className="text-gray-400 shrink-0">Assigned Vendor:</span>
                          <span className="font-bold text-brand-green-700 truncate">{getVendorName(request.vendor_id)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center">
                      <span className="text-[10px] text-gray-400">
                        {new Date(request.created_at).toLocaleDateString("en-IN")}
                      </span>
                      
                      <div className="flex gap-2">
                        {request.status === "pending" && (
                          <button 
                            onClick={async () => {
                              if (confirm("Are you sure you want to cancel this pickup request?")) {
                                await supabase.from('pickup_requests').update({ status: 'cancelled' }).eq('id', request.id);
  setLocalRequests(localRequests.map(r => r.id === request.id ? { ...r, status: 'cancelled' } : r));
  onCancelRequest(request.id);
                              }
                            }}
                            className="p-1 px-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            <Trash size={12} className="inline mr-1" /> Cancel
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="px-3 py-1.5 bg-brand-green-600 text-white hover:bg-brand-green-700 font-bold text-[10px] rounded-lg shadow-xs cursor-pointer"
                        >
                          Details & Timeline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE CARD TAB */}
        {activeTab === "profile" && (
          <div className="max-w-2xl glass-card rounded-[32px] p-6 md:p-10 text-left shadow-2xl animate-fade-in">
            <div className="pb-4 border-b border-gray-105 mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-display">Manage Account Credentials</h2>
              <p className="text-xs text-gray-400 mt-1">Edit default billing/shipping collections details used below forms.</p>
            </div>

            {profileMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold border mb-6 flex gap-2 ${
                profileMessage.type === "success" 
                  ? "bg-brand-green-100 text-brand-green-800 border-brand-green-200" 
                  : "bg-red-50 text-red-700 border-red-100"
              }`}>
                <Info size={16} /> {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center gap-4 pb-4">
                <img className="w-16 h-16 rounded-full object-cover border-4 border-brand-green-100" src={profile.avatar_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} alt="Customer Avatar" />
                <div>
                  <h3 className="font-bold text-gray-800 text-base">{profile.full_name}</h3>
                  <span className="text-xs text-gray-400 font-medium">Joined: {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Registered Email Address</label>
                <input 
                  type="email"
                  disabled
                  value={profile.email} 
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Account emails cannot be changed once authenticated.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Full Legal Name</label>
                  <input 
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="E.g. Aarav Mehta"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-green-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Mobile Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-xs text-gray-400 font-extrabold">+91</span>
                    <input 
                      type="text"
                      maxLength={10}
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-brand-green-500 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-xs tracking-widest rounded-xl shadow-md uppercase transition cursor-pointer"
              >
                Save Profile Records
              </button>
            </form>
          </div>
        )}

      </main>

      {/* MODAL WINDOW FOR REQUEST DETAILS & TIMELINE */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setSelectedRequest(null)}>
          <div 
            className="glass-card rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-900/10 p-6 md:p-10 text-left animate-slide-up border border-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">Ref: #{selectedRequest.id}</span>
                <h3 className="font-extrabold text-gray-900 text-lg md:text-xl font-display mt-0.5">
                  {getCategoryName(selectedRequest.category_id)} Pickup Details
                </h3>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-1 px-2.5 hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs cursor-pointer">
                Close
              </button>
            </div>

            {/* Details Content */}
            <div className="space-y-6">
              
              {/* Timeline Graphic */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Request Status Timeline</span>
                <div className="grid grid-cols-5 gap-2 relative">
                  <TimelineStep active={true} done={true} index={1} label="Pending" />
                  <TimelineStep active={["assigned", "accepted", "in_progress", "completed"].includes(selectedRequest.status)} done={["assigned", "accepted", "in_progress", "completed"].includes(selectedRequest.status)} index={2} label="Assigned" />
                  <TimelineStep active={["accepted", "in_progress", "completed"].includes(selectedRequest.status)} done={["accepted", "in_progress", "completed"].includes(selectedRequest.status)} index={3} label="Accepted" />
                  <TimelineStep active={["in_progress", "completed"].includes(selectedRequest.status)} done={["in_progress", "completed"].includes(selectedRequest.status)} index={4} label="In Progress" />
                  <TimelineStep active={selectedRequest.status === "completed"} done={selectedRequest.status === "completed"} index={5} label="Completed" />
                </div>
                {selectedRequest.status === "cancelled" && (
                  <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-lg text-xs font-semibold text-center border border-red-100 flex items-center justify-center gap-2">
                    <AlertTriangle size={14} /> Request cancelled by Customer
                  </div>
                )}
              </div>

              {/* Grid content split info and images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Information Logs</span>
                  <div className="space-y-3.5">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Assigned Recycler</span>
                      <span className="font-extrabold text-brand-green-800 text-sm">{getVendorName(selectedRequest.vendor_id)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Pincode Area</span>
                      <span className="font-semibold text-gray-700">{selectedRequest.pincode}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Street Address</span>
                      <span className="font-semibold text-gray-700">{selectedRequest.address}, {selectedRequest.city}, {selectedRequest.state}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Full Description</span>
                      <p className="text-gray-500 leading-relaxed text-xs">{selectedRequest.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Uploaded Snapshots</span>
                  {selectedRequest.image_urls.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-150 rounded-2xl h-40 flex flex-col items-center justify-center text-gray-400 text-xs">
                      <Camera size={22} className="mb-2" /> No pictures attached
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto">
                      {selectedRequest.image_urls.map((url, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-gray-100 aspect-video">
                          <img src={url} alt="attached waste pile" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedRequest.notes && (
                    <div className="bg-brand-sky-50 p-4 rounded-xl border border-brand-sky-100 text-brand-sky-900 text-xs text-left">
                      <span className="font-bold block mb-1">📋 Vendor Handover Notes:</span>
                      <p className="italic">{selectedRequest.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom footer controls */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs">
                <span className="text-gray-450 font-medium">Logged on: {new Date(selectedRequest.created_at).toLocaleString()}</span>
                {selectedRequest.status === "pending" && (
                  <button 
                    onClick={async () => {
                              if (confirm("Are you sure you want to cancel this request?")) {
                        await supabase.from('pickup_requests').update({ status: 'cancelled' }).eq('id', selectedRequest.id);
  setLocalRequests(localRequests.map(r => r.id === selectedRequest.id ? { ...r, status: 'cancelled' } : r));
  onCancelRequest(selectedRequest.id);
                        setSelectedRequest(null);
                      }
                    }}
                    className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Cancel This Request
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub components helper
interface SidebarNavBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function SidebarNavBtn({ active, onClick, icon, label }: SidebarNavBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer
        ${active 
          ? "bg-brand-green-100 text-brand-green-700 border-l-4 border-brand-green-600" 
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer
        ${active 
          ? "bg-brand-green-600 text-white shadow-sm" 
          : "text-gray-550 hover:bg-gray-100"
        }
      `}
    >
      {label}
    </button>
  );
}

function TimelineStep({ active, done, index, label }: { active: boolean; done: boolean; index: number; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all relative z-10
        ${done 
          ? 'bg-brand-green-500 text-white ring-4 ring-brand-green-100' 
          : active 
            ? 'bg-white border-2 border-brand-green-500 text-brand-green-600 animate-pulse' 
            : 'bg-white border text-gray-300'
        }
      `}>
        {done ? "✓" : index}
      </div>
      <span className={`block text-[8px] md:text-[10px] font-bold mt-2 truncate max-w-full ${active ? 'text-brand-green-700 font-extrabold' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
