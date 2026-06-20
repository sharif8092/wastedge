import React, { useState, useEffect } from "react";
import { 
  Profile, 
  Vendor, 
  PickupRequest, 
  Category, 
  Notification,
  UserRole,
  PickupRequestStatus
} from "../types";
import { 
  LayoutDashboard, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  History, 
  X, 
  Check, 
  Trash, 
  User, 
  Search, 
  Filter, 
  PlusCircle, 
  AlertTriangle,
  Info,
  ExternalLink,
  MapPin,
  Camera,
  Layers,
  Award,
  Recycle,
  Globe
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { SubdomainsPage } from "./pages/SubdomainsPage";

interface AdminDashboardProps {
  profile: Profile;
  profiles: Profile[];
  vendors: Vendor[];
  requests: PickupRequest[];
  categories: Category[];
  notifications: Notification[];
  onLogout: () => void;
  onAssignVendor: (requestId: string, vendorId: string) => void;
  onUpdateStatusByAdmin: (requestId: string, status: PickupRequestStatus) => void;
  onDeleteRequest: (requestId: string) => void;
  onApproveVendor: (vendorId: string) => void;
  onRejectVendor: (vendorId: string, reason: string) => void;
  onDeleteUser: (userId: string) => void;
}

export function AdminDashboard({
  profile,
  profiles,
  vendors,
  requests,
  categories,
  notifications,
  onLogout,
  onAssignVendor,
  onUpdateStatusByAdmin,
  onDeleteRequest,
  onApproveVendor,
  onRejectVendor,
  onDeleteUser
}: AdminDashboardProps) {
  // Navigation tabs
  const [localProfiles, setLocalProfiles] = useState<Profile[]>([]);
  const [localVendors, setLocalVendors] = useState<Vendor[]>([]);
  const [localRequests, setLocalRequests] = useState<PickupRequest[]>([]);
  const [localNotifs, setLocalNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profs } = await supabase.from('profiles').select('*');
      if (profs) setLocalProfiles(profs);

      const { data: vends } = await supabase.from('vendors').select('*');
      if (vends) setLocalVendors(vends);

      const { data: reqs } = await supabase.from('pickup_requests').select('*').order('created_at', { ascending: false });
      if (reqs) setLocalRequests(reqs);

      const { data: notifs } = await supabase.from('notifications').select('*');
      if (notifs) setLocalNotifs(notifs);
    };
    fetchData();
  }, []);

  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "vendors" | "customers" | "subdomains">("overview");

  // Search & Filter state
  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>("all");
  const [vendorSearch, setVendorSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  // Rejection modal state
  const [rejectVendorId, setRejectVendorId] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState("");

  // Delete confirmations states
  const [deleteTargetRequest, setDeleteTargetRequest] = useState<string | null>(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState<string | null>(null);

  // Detail View State
  const [previewRequestDetail, setPreviewRequestDetail] = useState<PickupRequest | null>(null);

  // Statistics summaries
  const customerCount = localProfiles.filter(p => p.role === "customer").length;
  const approvedVendorsCount = localVendors.filter(v => v.verification_status === "approved").length;
  const pendingVendorsCount = localVendors.filter(v => v.verification_status === "pending").length;
  const totalRequestsCount = localRequests.length;
  const pendingRequestsCount = localRequests.filter(r => r.status === "pending").length;
  const completedRequestsCount = localRequests.filter(r => r.status === "completed").length;

  // Joint queries helper
  const getProfileForId = (id: string) => {
    return localProfiles.find(p => p.id === id) || {
      full_name: "Deleted User",
      email: "deleted@wastedge.in",
      phone: "0000000000"
    };
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.category_name || "General Scrap";
  };

  // approved vendors for dropdown assign allocation
  const approvedVendorsList = localVendors
    .filter(v => v.verification_status === "approved")
    .map(v => {
      const p = localProfiles.find(prof => prof.id === v.user_id);
      return {
        vendor_id: v.id,
        user_id: v.user_id, // profile id
        displayName: `${v.business_name} (${p?.full_name || "Agent"})`
      };
    });

  // Filters Requests list
  const filteredRequests = localRequests.filter(req => {
    const customer = getProfileForId(req.customer_id);
    const catName = getCategoryName(req.category_id);
    const searchString = `${req.id} ${customer.full_name} ${catName} ${req.pincode} ${req.city}`.toLowerCase();
    const matchesSearch = searchString.includes(requestSearch.toLowerCase());
    const matchesStatus = requestStatusFilter === "all" || req.status === requestStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filters vendors
  const filteredVendors = localVendors.filter(v => {
    const p = localProfiles.find(prof => prof.id === v.user_id);
    const searchString = `${v.business_name} ${p?.full_name || ""} ${p?.email || ""} ${p?.phone || ""}`.toLowerCase();
    return searchString.includes(vendorSearch.toLowerCase());
  });

  // Filters customers
  const filteredCustomers = localProfiles
    .filter(p => p.role === "customer")
    .filter(p => {
      const searchString = `${p.full_name} ${p.email} ${p.phone}`.toLowerCase();
      return searchString.includes(customerSearch.toLowerCase());
    });

  const getStatusColor = (status: PickupRequestStatus) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-250",
      assigned: "bg-indigo-100 text-indigo-800 border-indigo-250",
      accepted: "bg-sky-100 text-sky-800 border-sky-250",
      in_progress: "bg-blue-100 text-blue-800 border-blue-250",
      completed: "bg-green-100 text-green-800 border-green-250",
      cancelled: "bg-gray-100 text-gray-800 border-gray-250"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-250";
  };

  const handleApproveClick = (vendorId: string) => {
    onApproveVendor(vendorId);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectVendorId) return;
    if (!rejectReasonText.trim()) {
      alert("Please tell the collector agency vendor why details did not pass verification.");
      return;
    }

    onRejectVendor(rejectVendorId, rejectReasonText);
    setRejectVendorId(null);
    setRejectReasonText("");
  };

  const confirmDeleteRequest = () => {
    if (!deleteTargetRequest) return;
    onDeleteRequest(deleteTargetRequest);
    setDeleteTargetRequest(null);
  };

  const confirmDeleteUser = () => {
    if (!deleteTargetUser) return;
    onDeleteUser(deleteTargetUser);
    setDeleteTargetUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-68 bg-white border-r border-slate-200 p-6 flex flex-col md:h-screen sticky top-0 z-30">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6 text-left">
          <div className="w-9 h-9 bg-brand-green-600 text-white rounded-xl flex items-center justify-center shrink-0">
            <Recycle size={20} className="animate-spin-slow" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-800 font-display">
              wastEdge<span className="text-brand-green-600 underline decoration-brand-sky-500 decoration-3">Solution</span>
            </span>
          </div>
        </div>

        {/* Admin profile snippet */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-8 text-left">
          <img 
            className="w-10 h-10 rounded-full object-cover border-2 border-brand-green-300" 
            src={profile.avatar_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
            alt="Admin visual profile avatar" 
          />
          <div>
            <span className="block font-extrabold text-sm text-gray-800 truncate">{profile.full_name}</span>
            <span className="inline-flex py-0.2 px-2 bg-brand-green-100 text-brand-green-700 rounded-full text-[9px] font-bold tracking-widest font-mono uppercase mt-1">
              {profile.role} user
            </span>
          </div>
        </div>

        {/* Tabs sidebar selectors */}
        <nav className="space-y-1.5 flex-1 text-left">
          <SidebarNavBtn 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")} 
            icon={<LayoutDashboard size={18} />} 
            label="Live Statistics" 
          />
          <SidebarNavBtn 
            active={activeTab === "requests"} 
            onClick={() => setActiveTab("requests")} 
            icon={<History size={18} />} 
            label="Pickup requests" 
          />
          <SidebarNavBtn 
            active={activeTab === "vendors"} 
            onClick={() => setActiveTab("vendors")} 
            icon={<Truck size={18} />} 
            label="Manage Vendors" 
          />
          <SidebarNavBtn 
            active={activeTab === "customers"} 
            onClick={() => setActiveTab("customers")} 
            icon={<Users size={18} />} 
            label="Manage Customers" 
          />
          <SidebarNavBtn 
            active={activeTab === "subdomains"} 
            onClick={() => setActiveTab("subdomains")} 
            icon={<Layers size={18} />} 
            label="Subdomains" 
          />
        </nav>

        {/* Realtime database status bar */}
        <div className="bg-brand-green-50/50 p-4 rounded-2xl mb-6 border border-brand-green-100 text-brand-green-800 text-left">
          <div className="flex items-center gap-1.5 font-bold text-xs select-none">
            <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            <span>Realtime Synchronized</span>
          </div>
          <span className="block text-[9.5px] text-gray-500 mt-1 leading-normal">Interactive database updates. Actions mirror on respective worker screens.</span>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full py-3.5 border border-red-155 bg-red-50 text-red-505 rounded-xl text-sm font-extrabold hover:bg-red-101/40 tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
        >
          Logout Console
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        
        {/* TOP METADATA BAR FOR DESKTOP */}
        <div className="hidden md:flex justify-between items-center border-b border-gray-100 pb-6 mb-8 text-left">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-905 tracking-tight font-display">wastEdge Admin Control Room</h1>
            <p className="text-xs text-gray-400 mt-1 font-sans">Dispatch garbage collectors, review vendor records, and audit active recycling.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-gray-400 block tracking-wider uppercase">Live Session Node</span>
            <span className="text-sm font-semibold text-gray-700">Administrator: {profile.email}</span>
          </div>
        </div>

        {/* TAB 1: STATISTICS OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 text-left animate-fade-in">
            {/* Core Counter Stats Card Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              
              <div className="bg-white/80 backdrop-blur-md p-5 rounded-[24px] border border-slate-200 shadow-xl shadow-slate-100/40 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Customers</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1">{customerCount}</span>
                </div>
                <div className="p-3 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <Users size={18} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-5 rounded-[24px] border border-slate-200 shadow-xl shadow-slate-100/40 flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Vendors</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1">{approvedVendorsCount}</span>
                </div>
                <div className="p-3 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <Truck size={18} />
                </div>
                {pendingVendorsCount > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-white font-black text-[8px] rounded-full uppercase tracking-wider">
                    {pendingVendorsCount} PENDING
                  </span>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur-md p-5 rounded-[24px] border border-slate-200 shadow-xl shadow-slate-100/40 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Requests</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1">{totalRequestsCount}</span>
                </div>
                <div className="p-3 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <History size={18} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-5 rounded-[24px] border border-amber-100 shadow-xl shadow-amber-50/40 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-650">Unassigned Pile</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1">{pendingRequestsCount}</span>
                </div>
                <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                  <AlertCircle size={18} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-5 rounded-[24px] border border-emerald-100 shadow-xl shadow-emerald-50/40 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-green-600">Completed Cycles</span>
                  <span className="block text-2xl font-black text-slate-800 mt-1">{completedRequestsCount}</span>
                </div>
                <div className="p-3 bg-brand-green-50 text-brand-green-600 rounded-xl">
                  <CheckCircle size={18} />
                </div>
              </div>

            </div>

            {/* Quick attention review boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              
              {/* Box 1: Pending Vendor Audits */}
              <div className="glass-card shadow-xl p-6 rounded-[28px] hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 font-display">
                  <h3 className="font-extrabold text-gray-950 text-base flex items-center gap-2">
                    <Truck className="text-amber-500" size={18} /> Pending Vendor Approvals ({pendingVendorsCount})
                  </h3>
                  <button onClick={() => setActiveTab("vendors")} className="text-xs text-brand-green-700 font-bold hover:underline cursor-pointer">
                    Manage Board
                  </button>
                </div>

                {pendingVendorsCount === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400">
                     Great job! No pending collector registrations waiting.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {localVendors
                      .filter(v => v.verification_status === "pending")
                      .slice(0, 3)
                      .map(v => {
                        const contact = getProfileForId(v.user_id);
                        return (
                          <div key={v.id} className="p-4 bg-gray-50 border border-gray-105 rounded-2xl flex items-center justify-between text-xs">
                            <div className="text-left">
                              <span className="block font-bold text-gray-800">{v.business_name}</span>
                              <span className="text-gray-450 block mt-0.5">Owner: {contact.full_name} • Email: {contact.email}</span>
                              <span className="text-[10px] text-gray-400 font-mono block mt-1.5">Areas: {v.service_areas.join(", ")}</span>
                            </div>
                            <div className="flex gap-1.5 shrink-0 ml-4">
                              <button 
                                onClick={() => handleApproveClick(v.id)}
                                className="p-2.5 bg-brand-green-600 text-white rounded-xl shadow-xs hover:bg-brand-green-700 cursor-pointer"
                              >
                                <Check size={14} />
                              </button>
                              <button 
                                onClick={() => setRejectVendorId(v.id)}
                                className="p-2.5 bg-red-604 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Box 2: Pending Vendor Allocation */}
              <div className="glass-card shadow-xl p-6 rounded-[28px] hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="font-extrabold text-gray-950 text-base flex items-center gap-2 font-display">
                    <AlertCircle className="text-amber-500 animate-pulse" size={18} /> Direct Vendor Allocation ({pendingRequestsCount})
                  </h3>
                  <button onClick={() => setActiveTab("requests")} className="text-xs text-brand-green-700 font-bold hover:underline cursor-pointer">
                    Manage Schedule
                  </button>
                </div>

                {pendingRequestsCount === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400">
                    No unassigned customer garbage files. Clean table!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {localRequests
                      .filter(r => r.status === "pending")
                      .slice(0, 3)
                      .map(req => {
                        const client = getProfileForId(req.customer_id);
                        return (
                          <div key={req.id} className="p-4 bg-gray-50 border border-gray-105 rounded-2xl flex items-center justify-between text-xs">
                            <div className="text-left overflow-hidden">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800">{getCategoryName(req.category_id)}</span>
                                <span className="text-[10px] font-semibold font-mono text-gray-400">#{req.id}</span>
                              </div>
                              <span className="block text-gray-500 truncate mt-1">Client: {client.full_name} • Location: {req.city} ({req.pincode})</span>
                            </div>

                            <div className="shrink-0 flex gap-1.5 ml-4">
                              <button 
                                onClick={() => setActiveTab("requests")}
                                className="px-3.5 py-1.5 bg-brand-green-600 text-white rounded-xl text-[10px] font-bold shadow-xs cursor-pointer"
                              >
                                Dispatch Vendor
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

            </div>

            {/* Custom SVG performance trends dashboard graphics */}
            <div className="glass-card p-6 md:p-8 rounded-[28px] text-left mt-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Historical Analytics Grid Overview</span>
              <h3 className="font-bold text-gray-800 text-base mt-2 mb-6">Recycled Scrap Category Weights</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnalyticsBlock title="Paper raddi" wt="1,245 kg" accent="bg-sky-50 text-sky-700 border-sky-102" percent="64%" />
                <AnalyticsBlock title="Metal rods" wt="842 kg" accent="bg-amber-50 text-amber-700 border-amber-102" percent="42%" />
                <AnalyticsBlock title="PET Plastic" wt="621 kg" accent="bg-emerald-50 text-emerald-700 border-emerald-111" percent="24%" />
                <AnalyticsBlock title="Obsolete E-Waste" wt="321 kg" accent="bg-purple-50 text-purple-700 border-purple-102" percent="15%" />
              </div>
            </div>
          </div>
        )}

        {/* TAB: SUBDOMAINS */}
        {activeTab === "subdomains" && (
          <div className="animate-fade-in -mt-6">
            <SubdomainsPage />
          </div>
        )}

        {/* TAB 2: REQUESTS MANAGEMENT TABLE */}
        {activeTab === "requests" && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="pb-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-905 font-display">Cargo Schedule & Allocations</h2>
                <p className="text-xs text-gray-400 mt-1">View active scrap listings, allocate near-by certified vendors, or edit states.</p>
              </div>

              {/* Filters Box */}
              <div className="flex flex-wrap gap-2">
                <div className="relative font-sans text-xs">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input 
                    type="text" 
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    placeholder="Search ID, Client, Pincode..."
                    className="pl-9 pr-4 py-2 bg-white border border-gray-150 rounded-xl"
                  />
                </div>
                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="bg-white border border-gray-150 rounded-xl text-xs px-3.5"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending Admin Assignment</option>
                  <option value="assigned font-bold text-indigo-700">Vendor Assigned</option>
                  <option value="accepted font-bold text-sky-700">Accepted by Vendor</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed Successfully</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="glass-card p-16 rounded-[28px] text-center shadow-lg bg-white/40">
                <History className="mx-auto mb-4 text-gray-300" size={36} />
                <h4 className="font-bold text-gray-750 text-sm">No matching pickup requests</h4>
                <p className="text-xs text-gray-400 mt-1">Refine your search triggers or status filters.</p>
              </div>
            ) : (
              <div className="glass-card rounded-[28px] overflow-hidden shadow-xl shadow-slate-100/40">
                <table className="w-full text-left font-sans text-sm">
                  <thead className="bg-gray-50/80 text-xs font-bold text-gray-500 uppercase border-b border-gray-150">
                    <tr>
                      <th className="p-4">Ref ID</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4 font-display font-semibold text-gray-600">Recycle Type</th>
                      <th className="p-4">Destination Pin/Info</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Assign licensed vendor</th>
                      <th className="p-4 text-right">Row actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRequests.map(req => {
                      const client = getProfileForId(req.customer_id);
                      const currentVendorProfileId = req.vendor_id;
                      
                      // Match the current vendor's profile name
                      const currentVendor = approvedVendorsList.find(av => av.user_id === currentVendorProfileId);

                      return (
                        <tr key={req.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-mono font-bold text-xs text-gray-400">#{req.id}</td>
                          <td className="p-4">
                            <span className="block font-bold text-gray-800">{client.full_name}</span>
                            <span className="block text-[10.5px] text-gray-400 font-mono">+91 {client.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-gray-850 block">{getCategoryName(req.category_id)}</span>
                            <span className="block text-[10px] text-gray-400 line-clamp-1 max-w-[150px]">{req.description}</span>
                          </td>
                          <td className="p-4 text-xs text-gray-500">
                            <span className="block font-bold mt-0.5 text-gray-800">{req.pincode} • {req.city}</span>
                            <span className="block text-[10px] truncate max-w-[130px]">{req.address}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full border text-[9.5px] font-bold font-mono tracking-wider uppercase ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                          </td>
                          
                          {/* Vendor Allocation drop down */}
                          <td className="p-4">
                            {["completed", "cancelled"].includes(req.status) ? (
                              <span className="text-xs text-gray-400 italic">Terminated run</span>
                            ) : (
                              <select
                                value={req.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  if (!newStatus) return;
                                  await supabase.from('pickup_requests').update({ status: newStatus }).eq('id', req.id);
                                  setLocalRequests(localRequests.map(r => r.id === req.id ? { ...r, status: newStatus as PickupRequestStatus } : r));
                                }}
                                className="bg-white border border-gray-200 select-xs text-[11px] rounded-lg p-1.5 font-sans"
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">Dispatched (In Progress)</option>
                                <option value="completed">Completed</option>
                              </select>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setPreviewRequestDetail(req)}
                                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 cursor-pointer"
                                title="Inspect snap previews"
                              >
                                <Camera size={13} />
                              </button>
                              <button
                                onClick={() => setDeleteTargetRequest(req.id)}
                                className="p-2 border border-red-101 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                                title="Delete schedule row"
                              >
                                <Trash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VENDOR REVIEWS */}
        {activeTab === "vendors" && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="pb-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-905 font-display">Collector Agency Directory</h2>
                <p className="text-xs text-gray-400 mt-1">Approve pending registries, edit service areas or revoke active profiles.</p>
              </div>

              <div className="relative font-sans text-xs">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  placeholder="Search operational vendor..."
                  className="pl-9 pr-4 py-2 bg-white border border-gray-150 rounded-xl"
                />
              </div>
            </div>

            {filteredVendors.length === 0 ? (
              <div className="glass-card p-16 rounded-[28px] text-center shadow-lg bg-white/40">
                <Truck className="mx-auto mb-4 text-gray-300" size={36} />
                <h4 className="font-bold text-gray-700 text-sm">No vendors match query</h4>
                <p className="text-sm text-gray-400 mt-1">Refine searchable string triggers.</p>
              </div>
            ) : (
              <div className="glass-card rounded-[28px] overflow-hidden shadow-xl shadow-slate-100/40">
                <table className="w-full text-left text-sm font-sans">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-150">
                    <tr>
                      <th className="p-4">Collector identifier</th>
                      <th className="p-4">Owner Profile</th>
                      <th className="p-4 font-display font-medium text-gray-550">Registered codes areas</th>
                      <th className="p-4">Stat Badge</th>
                      <th className="p-4 text-right">Approve / Reject actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredVendors.map(v => {
                      const contact = getProfileForId(v.user_id);
                      return (
                        <tr key={v.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4">
                            <span className="block font-bold text-gray-800 font-display">{v.business_name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {v.id.substring(0, 8)}...</span>
                          </td>
                          <td className="p-4">
                            <span className="block font-semibold text-gray-800">{contact.full_name}</span>
                            <span className="block text-[10px] text-gray-400 font-mono">{contact.email} • +91 {contact.phone}</span>
                          </td>
                          <td className="p-4 text-xs font-mono text-gray-650 max-w-xs truncate">
                            {v.service_areas.join(", ")}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex py-0.5 px-2.5 rounded-full text-[9px] font-bold font-mono tracking-wide uppercase ${
                              v.verification_status === "approved" 
                                ? "bg-green-100 text-green-800" 
                                : v.verification_status === "rejected" 
                                  ? "bg-red-100 text-red-800" 
                                  : "bg-amber-100 text-amber-805"
                            }`}>
                              {v.verification_status}
                            </span>
                            {v.rejection_reason && v.verification_status === "rejected" && (
                              <span className="block text-[9.5px] italic text-red-500 mt-1 max-w-[150px] truncate" title={v.rejection_reason}>
                                Reason: {v.rejection_reason}
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {v.verification_status !== "approved" && (
                                <button
                                  onClick={() => handleApproveClick(v.id)}
                                  className="px-3.5 py-1.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-bold text-[10px] rounded-lg tracking-wide cursor-pointer"
                                >
                                  Approve
                                </button>
                              )}
                              {v.verification_status !== "rejected" && (
                                <button
                                  onClick={() => setRejectVendorId(v.id)}
                                  className="px-3 py-1.5 border border-red-101 text-red-500 hover:bg-red-50 font-bold text-[10px] rounded-lg cursor-pointer"
                                >
                                  Reject Reason
                                </button>
                              )}
                              <button
                                onClick={() => setDeleteTargetUser(v.user_id)}
                                className="p-2 border border-red-101 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                                title="Delete user"
                              >
                                <Trash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CUSTOMER INDIVIDUALS DIRECTORY */}
        {activeTab === "customers" && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="pb-4 border-b border-gray-105 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-905 font-display">Client Base Registry</h2>
                <p className="text-xs text-gray-400 mt-1">Audit active citizens directory or manage user profiles safety.</p>
              </div>

              <div className="relative font-sans text-xs">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search clean clients..."
                  className="pl-9 pr-4 py-2 bg-white border border-gray-150 rounded-xl"
                />
              </div>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="glass-card p-16 rounded-[28px] text-center shadow-lg bg-white/40">
                <Users className="mx-auto mb-4 text-gray-300" size={36} />
                <h4 className="font-bold text-gray-700 text-sm">No customers recorded</h4>
                <p className="text-xs text-gray-400 mt-1">Incoming consumer registrations configure indices here.</p>
              </div>
            ) : (
              <div className="glass-card rounded-[28px] overflow-hidden shadow-xl shadow-slate-100/40">
                <table className="w-full text-left text-sm font-sans">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-150">
                    <tr>
                      <th className="p-4">Customer profile avatar</th>
                      <th className="p-4 font-display font-medium text-gray-550">Contact records</th>
                      <th className="p-4">Requests pile counts</th>
                      <th className="p-4">Registered Date</th>
                      <th className="p-4 text-right">Row deletion Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-105">
                    {filteredCustomers.map(customer => {
                      const clientRequestsCount = localRequests.filter(r => r.customer_id === customer.id).length;
                      return (
                        <tr key={customer.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 flex items-center gap-2.5">
                            <img className="w-8 h-8 rounded-full object-cover" src={customer.avatar_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} alt="Customer Profile Photo placeholder icon" />
                            <span className="font-bold text-gray-800">{customer.full_name}</span>
                          </td>
                          <td className="p-4">
                            <span className="block text-xs font-semibold text-gray-700">{customer.email}</span>
                            <span className="block text-[10.5px] text-gray-450 font-mono">+91 {customer.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex py-0.5 px-2 bg-brand-sky-50 text-brand-sky-800 rounded-full text-xs font-bold font-mono">
                              {clientRequestsCount} requests
                            </span>
                          </td>
                          <td className="p-4 text-xs text-gray-400">
                            {new Date(customer.created_at).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setDeleteTargetUser(customer.id)}
                              className="p-2 border border-red-101 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer inline-flex"
                              title="Ban customer user and details"
                            >
                              <Trash size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* REJECTION REASON DIALOG POPUP */}
      {rejectVendorId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setRejectVendorId(null)}>
          <div 
            className="glass-card rounded-[32px] w-full max-w-sm shadow-2xl shadow-slate-900/10 p-6 md:p-8 animate-slide-up text-left border border-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 font-display">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="text-red-600" size={16} /> Specify Application Rejection Reason
              </h3>
              <button onClick={() => setRejectVendorId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Rejection reason explanations</label>
                <textarea 
                  required
                  rows={3}
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  placeholder="E.g. Provided business registration number cannot be verified in Kalyan MMR records. Operational PIN lacks logistic paths."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:border-red-500 focus:bg-white focus:outline-hidden"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRejectVendorId(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Rejection Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE REQUEST ROW MODAL */}
      {deleteTargetRequest && (
        <ConfirmDeleteModal 
          title="Delete Scrap Request Permanent?"
          msg="This action is irreversible. The customer's pickup request will be immediately purged from local databases."
          onCancel={() => setDeleteTargetRequest(null)}
          onConfirm={confirmDeleteRequest}
        />
      )}

      {/* CONFIRM DELETE USER DIRECTORY ROW MODAL */}
      {deleteTargetUser && (
        <ConfirmDeleteModal 
          title="Ban and delete user profile?"
          msg="Are you sure you want to completely erase this user account? All corresponding history structures will lock."
          onCancel={() => setDeleteTargetUser(null)}
          onConfirm={confirmDeleteUser}
        />
      )}

      {/* INSPECT DETAIL REQUEST PANEL IN ADMIN */}
      {previewRequestDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans" onClick={() => setPreviewRequestDetail(null)}>
          <div 
            className="glass-card rounded-[32px] w-full max-w-lg shadow-2xl shadow-slate-900/10 p-6 md:p-10 text-left animate-slide-up border border-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <h3 className="font-extrabold text-gray-900 font-display text-base">
                Ref #{previewRequestDetail.id} Snap Previews
              </h3>
              <button onClick={() => setPreviewRequestDetail(null)} className="p-1 px-3 bg-gray-100 border border-gray-250 rounded-xl font-bold text-[10px] text-gray-600 cursor-pointer">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Assigned Client Address</span>
                <p className="text-xs font-semibold text-gray-700 font-sans">{previewRequestDetail.address}, {previewRequestDetail.city} ({previewRequestDetail.pincode})</p>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Pile snaps attached</span>
                {previewRequestDetail.image_urls.length === 0 ? (
                  <div className="bg-gray-50 border border-dashed rounded-2xl h-28 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <Camera size={20} className="mb-1" /> No snapshots attached.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto">
                    {previewRequestDetail.image_urls.map((url, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-gray-100 aspect-video select-none">
                        <img src={url} alt="admin snap preview audit" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub components helpers
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
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-105/50"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function AnalyticsBlock({ title, wt, accent, percent }: { title: string; wt: string; accent: string; percent: string }) {
  return (
    <div className={`p-4 rounded-2xl border ${accent} flex flex-col justify-between h-28 text-left`}>
      <span className="text-[10px] uppercase font-bold tracking-wider leading-none">{title}</span>
      <div>
        <span className="text-xl font-extrabold block leading-tight">{wt}</span>
        <span className="text-[9px] block text-gray-400 mt-1 font-medium font-sans">Index Share: {percent} of global runs</span>
      </div>
    </div>
  );
}

interface ConfirmDeleteModalProps {
  title: string;
  msg: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDeleteModal({ title, msg, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans" onClick={onCancel}>
      <div 
        className="glass-card rounded-[32px] w-full max-w-sm shadow-2xl shadow-slate-900/10 p-6 md:p-8 text-left animate-slide-up border border-white/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-4 text-red-650">
          <AlertTriangle size={24} className="shrink-0" />
          <h3 className="font-extrabold text-gray-900 text-base font-display leading-tight">{title}</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-sans mb-6">{msg}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-gray-100 font-bold text-xs text-gray-600 rounded-xl hover:bg-gray-155 cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-707 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer animate-scale"
          >
            Confirm Delete permanent
          </button>
        </div>
      </div>
    </div>
  );
}
