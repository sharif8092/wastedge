import React, { useState } from "react";
import { 
  Profile, 
  Vendor, 
  PickupRequest, 
  Category, 
  Notification 
} from "../types";
import { 
  LayoutDashboard, 
  Truck, 
  CheckCircle, 
  User, 
  LogOut, 
  MapPin, 
  AlertTriangle, 
  X, 
  Phone, 
  Bell, 
  Menu,
  Check,
  Search,
  BookOpen,
  Info,
  Recycle
} from "lucide-react";

interface VendorDashboardProps {
  profile: Profile;
  vendor: Vendor | undefined;
  requests: PickupRequest[];
  categories: Category[];
  notifications: Notification[];
  allProfiles: Profile[]; // to join and retrieve customer full_names and real details
  onLogout: () => void;
  onAcceptAssignment: (requestId: string) => void;
  onDeclineAssignment: (requestId: string) => void;
  onStartPickup: (requestId: string) => void;
  onCompletePickup: (requestId: string, notes: string) => void;
  onUpdateVendorProfile: (businessName: string, serviceAreas: string[], fullName: string, phone: string) => void;
  onMarkNotificationRead: (notifId: string) => void;
  onSwitchToCustomer?: () => void;
}

export function VendorDashboard({
  profile,
  vendor,
  requests,
  categories,
  notifications,
  allProfiles,
  onLogout,
  onAcceptAssignment,
  onDeclineAssignment,
  onStartPickup,
  onCompletePickup,
  onUpdateVendorProfile,
  onMarkNotificationRead,
  onSwitchToCustomer
}: VendorDashboardProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"overview" | "assigned" | "completed" | "profile">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  // Completion Dialog Modal State
  const [completingRequestId, setCompletingRequestId] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");

  // Forms editing states
  const [businessName, setBusinessName] = useState(vendor?.business_name || "");
  const [serviceAreasRaw, setServiceAreasRaw] = useState(vendor?.service_areas.join(", ") || "");
  const [vendorFullName, setVendorFullName] = useState(profile.full_name);
  const [vendorPhone, setVendorPhone] = useState(profile.phone);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Calculations
  const myAssignedRequests = requests.filter(r => r.vendor_id === profile.id);
  const activeJobs = myAssignedRequests.filter(r => ["assigned", "accepted", "in_progress"].includes(r.status));
  const completedJobs = myAssignedRequests.filter(r => r.status === "completed");
  
  // Quick stats
  const totalCompletedWeight = completedJobs.length * 15.4; // simulated weights
  const carbonOffsetCount = completedJobs.length * 8.2; // simulated offset index

  // Customer Join helper
  const getCustomerProfile = (customerProfileId: string) => {
    return allProfiles.find(p => p.id === customerProfileId) || {
      full_name: "Valued Client",
      phone: "0000000000",
      email: "client@wastedge.in"
    };
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.category_name : "General Waste";
  };

  // Masking phone numbers until accepted
  const getMaskedPhone = (phone: string, requestStatus: string) => {
    if (["accepted", "in_progress", "completed"].includes(requestStatus)) {
      return `+91 ${phone}`;
    }
    return `+91 ${phone.substring(0, 3)}XXXX${phone.substring(7)}`;
  };

  const myNotifs = notifications.filter(n => n.user_id === profile.id);
  const unreadNotifCount = myNotifs.filter(n => !n.is_read).length;

  // Form Submissions
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const areas = serviceAreasRaw
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    onUpdateVendorProfile(businessName, areas, vendorFullName, vendorPhone);
    setProfileSuccessMsg("Vendor records and service areas modified successfully!");
    setTimeout(() => setProfileSuccessMsg(null), 3505);
  };

  const submitPickupCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingRequestId) return;
    if (!completionNotes.trim()) {
      alert("Please specify weight measurements or payout receipts in transaction notes.");
      return;
    }

    onCompletePickup(completingRequestId, completionNotes);
    setCompletingRequestId(null);
    setCompletionNotes("");
    setActiveTab("completed");
  };

  // Safe checks for vendor approval state
  const isApproved = vendor?.verification_status === "approved";
  const isPending = vendor?.verification_status === "pending" || !vendor;
  const isRejected = vendor?.verification_status === "rejected";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-green-600 text-white rounded-lg flex items-center justify-center shrink-0">
            <Recycle size={16} className="animate-spin-slow" />
          </div>
          <span className="font-bold text-slate-800 font-display text-sm">
            wastEdge<span className="text-brand-green-600 underline decoration-brand-sky-500 decoration-2">Solution</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNotifPanelOpen(!notifPanelOpen)} 
            className="p-2 relative bg-gray-50 rounded-lg"
          >
            <Bell size={20} className="text-gray-600" />
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

      {/* Slideout Notifications for Vendor */}
      {notifPanelOpen && (
        <div className="fixed inset-0 bg-transparent z-50 flex justify-end animate-fade-in" onClick={() => setNotifPanelOpen(false)}>
          <div 
            className="w-80 bg-white shadow-2xl h-full border-l border-gray-150 p-6 flex flex-col mt-[60px] md:mt-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider font-display">
                <Bell className="text-brand-sky-500" size={16} /> Notification Feed
              </h3>
              <button onClick={() => setNotifPanelOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {myNotifs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No notifications recorded.
                </div>
              ) : (
                myNotifs.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-3 rounded-xl border text-left text-xs ${
                      notif.is_read 
                        ? 'bg-gray-50 border-gray-100 text-gray-500' 
                        : 'bg-brand-sky-50 border-brand-sky-100 text-gray-800 font-medium'
                    }`}
                  >
                    <h4 className="font-bold text-gray-800 text-xs">{notif.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                    <div className="flex justify-between items-center mt-3 text-[9px] text-gray-400">
                      <span>{new Date(notif.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                      {!notif.is_read && (
                        <button 
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className="text-brand-sky-600 hover:underline cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-64 p-6 flex flex-col z-50 transform transition-transform duration-350 ease-in-out
        md:translate-x-0 md:static md:h-screen md:w-68
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-150">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 bg-brand-green-600 text-white rounded-xl flex items-center justify-center shrink-0">
              <Recycle size={18} className="animate-spin-slow" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800 font-display">
              wastEdge<span className="text-brand-green-600 underline decoration-brand-sky-500 decoration-3">Solution</span>
            </span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Agency Summary */}
        <div className="bg-gray-50 p-4 rounded-2xl mb-8 flex flex-col text-left border border-gray-100">
          <span className="text-[10px] uppercase font-bold text-gray-400">Collector Agency</span>
          <h4 className="font-extrabold text-sm text-gray-800 mt-1 uppercase truncate">
            {vendor?.business_name || "Unverified Agency"}
          </h4>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-semibold">Verification status</span>
            <span className={`inline-flex py-0.5 px-2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
              isApproved 
                ? 'bg-green-100 text-green-800' 
                : isRejected 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-amber-100 text-amber-800'
            }`}>
              {vendor?.verification_status || "pending"}
            </span>
          </div>
        </div>

        {/* Navigation Sidebar List */}
        <nav className="space-y-1.5 flex-1 text-left">
          <button
            onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
              activeTab === "overview" ? "bg-brand-sky-50 text-brand-sky-600 border-l-4 border-brand-sky-500" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={18} /> Overview Hub
          </button>
          
          <button
            disabled={!isApproved}
            onClick={() => { if (isApproved) { setActiveTab("assigned"); setMobileMenuOpen(false); } }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
              !isApproved 
                ? "text-gray-305 cursor-not-allowed opacity-40" 
                : activeTab === "assigned" 
                  ? "bg-brand-sky-50 text-brand-sky-600 border-l-4 border-brand-sky-500" 
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center gap-3"><Truck size={18} /> Assigned runs</span>
            {isApproved && activeJobs.length > 0 && (
              <span className="bg-brand-sky-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {activeJobs.length}
              </span>
            )}
          </button>

          <button
            disabled={!isApproved}
            onClick={() => { if (isApproved) { setActiveTab("completed"); setMobileMenuOpen(false); } }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
              !isApproved 
                ? "text-gray-305 cursor-not-allowed opacity-40" 
                : activeTab === "completed" 
                  ? "bg-brand-sky-50 text-brand-sky-600 border-l-4 border-brand-sky-500" 
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <CheckCircle size={18} /> Legwork History
          </button>

          <button
            onClick={() => { setActiveTab("profile"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
              activeTab === "profile" ? "bg-brand-sky-50 text-brand-sky-600 border-l-4 border-brand-sky-500" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <User size={18} /> Collector Profile
          </button>
          
          {onSwitchToCustomer && (
            <div className="border-t border-slate-150 pt-4 mt-4">
              <button
                type="button"
                onClick={() => { onSwitchToCustomer(); setMobileMenuOpen(false); }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 bg-brand-green-50 text-brand-green-700 hover:bg-brand-green-105 rounded-xl font-bold text-sm transition-all duration-205 cursor-pointer border border-brand-green-100/50"
              >
                <Recycle size={18} className="animate-spin-slow text-brand-green-600" />
                <span>Sell My Scrap</span>
              </button>
            </div>
          )}
        </nav>

        {/* System parameters */}
        <div className="bg-brand-sky-50 p-4 rounded-xl border border-brand-sky-100 text-left mb-6 text-xs text-slate-700">
          <BookOpen className="text-brand-sky-600 mb-1" size={14} />
          <span className="font-bold block">Safety Code</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Contact customer only after accepting assignments to align pickup slots.</span>
        </div>

        {/* Logout bottom */}
        <button 
          onClick={onLogout}
          className="w-full py-3.5 border border-red-155 text-red-500 bg-red-50 hover:bg-red-100/40 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={16} /> Log Out
        </button>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">

        {/* Desktop Header panel info */}
        <div className="hidden md:flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
          <div className="text-left">
            <h1 className="text-2xl font-extrabold text-gray-900 font-display">
              Vendor Area: {profile.full_name}
            </h1>
            <p className="text-xs text-gray-400 mt-1">Legitimate environmental clearances for your designated pin codes.</p>
          </div>
          
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setNotifPanelOpen(!notifPanelOpen)}
              className="p-3 bg-white border border-gray-150 rounded-xl hover:bg-gray-50 cursor-pointer relative"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold">
                  {unreadNotifCount}
                </span>
              )}
            </button>
            <div className="text-right">
              <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">Mobile Node</span>
              <span className="text-sm font-semibold text-gray-700">+91 {profile.phone}</span>
            </div>
          </div>
        </div>

        {/* BLOCKING INTERFACE GATES IF NOT APPROVED */}
        {isPending && (
          <div className="bg-white border border-amber-200 rounded-3xl p-8 text-left max-w-3xl mb-8 flex gap-5 shadow-xs relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 h-fit">
              <AlertTriangle size={32} />
            </div>
            <div>
              <span className="inline-flex py-1 px-3 bg-amber-50 rounded-lg text-amber-800 text-xs font-bold font-mono tracking-wide uppercase">
                Pending Registration Approval
              </span>
              <h2 className="text-xl font-bold font-display text-gray-900 mt-3 mb-2">
                Your collector credentials are currently under administrative review
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Thank you for applying to the wastEdge Solution platform! Our state recycling officers are currently auditing your chosen service areas. You will gain full dashboard assignment functionalities as soon as verification completes.
              </p>
              
              <div className="mt-6 p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Your Submitted Areas:</span>
                <span className="text-xs text-gray-700 block mt-1.5 font-semibold font-mono">
                  {vendor?.service_areas.length ? vendor.service_areas.join(", ") : "No pin codes submitted yet"}
                </span>
              </div>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="bg-white border border-red-200 rounded-3xl p-8 text-left max-w-3xl mb-8 flex gap-5 shadow-xs relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-650"></div>
            <div className="p-4 bg-red-50 rounded-2xl text-red-600 h-fit shrink-0">
              <AlertTriangle size={32} />
            </div>
            <div>
              <span className="inline-flex py-1 px-3 bg-red-105 rounded-lg text-red-800 text-xs font-bold font-mono tracking-wide uppercase">
                Vendor Application Rejected
              </span>
              <h2 className="text-xl font-bold font-display text-gray-900 mt-3 mb-2">
                We could not approve your garbage collector profile
              </h2>
              <div className="p-4 bg-red-50/50 rounded-2xl font-mono text-xs text-red-700 leading-relaxed mb-4">
                <strong>Rejection Reason:</strong> {vendor?.rejection_reason || "Missing certified business license parameters / Non-operational location."}
              </div>
              <p className="text-xs text-gray-400">
                Please edit and save your Profile details at the bottom navigation tab, updating your business name or operational PIN codes to re-trigger audited triggers.
              </p>
            </div>
          </div>
        )}

        {/* OVERVIEW PANEL */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Highlights metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-slate-200 shadow-xl shadow-slate-100/40 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <span className="block text-slate-400 font-bold text-[10px] tracking-wider uppercase">Active Assigned Jobs</span>
                <span className="block text-3xl font-black text-slate-800 mt-1.5">{activeJobs.length}</span>
                <div className="absolute right-4 bottom-4 p-2.5 bg-slate-50 text-slate-500 rounded-2xl group-hover:bg-slate-100 transition-colors">
                  <Truck size={20} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-sky-150 shadow-xl shadow-sky-50/40 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <span className="block text-brand-sky-600 font-bold text-[10px] tracking-wider uppercase">Jobs Finished</span>
                <span className="block text-3xl font-black text-slate-800 mt-1.5">{completedJobs.length}</span>
                <div className="absolute right-4 bottom-4 p-2.5 bg-sky-50 text-brand-sky-500 rounded-2xl group-hover:bg-sky-100 transition-colors">
                  <CheckCircle size={20} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-emerald-100 shadow-xl shadow-emerald-50/40 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <span className="block text-emerald-600 font-bold text-[10px] tracking-wider uppercase">Recovered Cargo (Kg)</span>
                <span className="block text-3xl font-black text-slate-800 mt-1.5">{totalCompletedWeight.toFixed(1)}</span>
                <div className="absolute right-4 bottom-4 p-2.5 bg-emerald-50 text-brand-green-600 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                  <Info size={20} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-teal-105 shadow-xl shadow-teal-50/40 text-left relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <span className="block text-teal-650 font-bold text-[10px] tracking-wider uppercase">Carbon Offset Equivalent</span>
                <span className="block text-3xl font-black text-slate-800 mt-1.5">-{carbonOffsetCount.toFixed(1)} CO₂</span>
                <div className="absolute right-4 bottom-4 p-2.5 bg-teal-50 text-teal-650 rounded-2xl group-hover:bg-teal-100 transition-colors">
                  <Check size={20} />
                </div>
              </div>

            </div>

            {/* In Progress Jobs Highlight */}
            {isApproved && (
              <div className="glass-card shadow-xl rounded-[28px] p-6 md:p-8 text-left hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 font-display">
                  <h3 className="font-bold text-gray-900 text-base">Your Active Collection Schedule</h3>
                  <button onClick={() => setActiveTab("assigned")} className="text-xs text-brand-sky-600 font-bold hover:underline cursor-pointer">
                    Manage Assignments
                  </button>
                </div>

                {activeJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Truck size={22} />
                    </div>
                    <h4 className="font-bold text-gray-700 text-sm">No Active Trips Dispatched</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Wait for admins to assign incoming customer listings in your operational pin codes.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeJobs.map(job => {
                      const customer = getCustomerProfile(job.customer_id);
                      return (
                        <div key={job.id} className="bg-white/55 border border-white/70 p-5 rounded-2xl hover:border-brand-sky-300 hover:shadow-lg transition-all duration-350 flex flex-col justify-between backdrop-blur-md">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-mono text-[9px] font-bold text-gray-400">Job #{job.id}</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-brand-sky-100 text-brand-sky-800 border-none text-[9px] font-bold font-mono tracking-wider uppercase">
                                {job.status}
                              </span>
                            </div>

                            <h4 className="font-bold text-gray-800 text-sm font-display">{getCategoryName(job.category_id)}</h4>
                            <p className="text-xs font-medium text-gray-550 mt-1 truncate">{customer.full_name} • Phone: {getMaskedPhone(customer.phone, job.status)}</p>
                            <p className="text-xs text-gray-405 mt-2 line-clamp-2">{job.description}</p>
                          </div>

                          <div className="border-t border-gray-200/50 pt-3 mt-4 flex items-center justify-between text-xs">
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <MapPin size={10} /> {job.pincode}, {job.city}
                            </span>
                            <button
                              onClick={() => setActiveTab("assigned")}
                              className="px-3 py-1 bg-white border border-gray-200 text-brand-sky-600 font-bold text-[10px] rounded-lg cursor-pointer"
                            >
                              Open Job Controls
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ASSIGNED REQUESTS LIST */}
        {activeTab === "assigned" && isApproved && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Manage Cargo Collections</h2>
              <p className="text-xs text-gray-400 mt-1">Accept local assignments, acquire customer contact parameters, or tick runs finished.</p>
            </div>

            {myAssignedRequests.length === 0 ? (
              <div className="glass-card p-16 rounded-[28px] text-center shadow-lg">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-350">
                  <Truck size={26} />
                </div>
                <h4 className="font-bold text-gray-700 text-sm">No assignments found</h4>
                <p className="text-xs text-gray-405 mt-1 max-w-sm mx-auto">Admins dispatch recycling requests here based on your registered operational pin codes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeJobs.map(job => {
                  const customer = getCustomerProfile(job.customer_id);
                  return (
                    <div key={job.id} className="glass-card p-5 md:p-6 rounded-[28px] hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
                      <div>
                        
                        {/* Header metadata row */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-mono text-[10px] text-gray-400 font-bold">REF: #{job.id}</span>
                          <span className="inline-flex py-0.5 px-2.5 bg-brand-sky-100 text-brand-sky-850 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider">
                            Status: {job.status}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-base font-display">{getCategoryName(job.category_id)}</h3>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{job.description}</p>

                        {/* Customer profile snippet */}
                        <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs space-y-2.5">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Customer Location:</span>
                            <span className="font-bold text-gray-800">{customer.full_name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Mobile Parameter:</span>
                            {["accepted", "in_progress"].includes(job.status) ? (
                              <a href={`tel:${customer.phone}`} className="font-bold text-brand-sky-600 hover:underline flex items-center gap-1 font-mono">
                                <Phone size={10} /> +91 {customer.phone}
                              </a>
                            ) : (
                              <span className="font-semibold text-gray-400 bg-gray-200/50 p-0.5 px-1.5 rounded-sm h-fit text-[10px]" title="Accept job to unlock caller info">
                                {getMaskedPhone(customer.phone, job.status)}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Operational PIN:</span>
                            <span className="font-semibold text-gray-700 font-mono">{job.pincode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Street Map:</span>
                            <span className="font-semibold text-gray-700 max-w-[180px] text-right truncate">{job.address}</span>
                          </div>
                        </div>

                        {/* Attached pictures */}
                        {job.image_urls.length > 0 && (
                          <div className="mt-4">
                            <span className="block text-[10px] font-bold uppercase text-gray-400 mb-2">Customer Snap Previews</span>
                            <div className="grid grid-cols-4 gap-2">
                              {job.image_urls.map((url, idx) => (
                                <div key={idx} className="rounded-lg overflow-hidden border border-gray-150 aspect-video select-none">
                                  <img src={url} alt="attached waste snapshots" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Operations buttons bar based on status */}
                      <div className="border-t border-gray-100 pt-5 mt-6 flex justify-between items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-medium">Assigned: {new Date(job.created_at).toLocaleDateString()}</span>
                        
                        <div className="flex gap-2">
                          {job.status === "assigned" && (
                            <>
                              <button
                                onClick={() => onDeclineAssignment(job.id)}
                                className="px-3.5 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 font-bold text-xs rounded-xl cursor-pointer"
                              >
                                Decline
                              </button>
                              <button
                                onClick={() => onAcceptAssignment(job.id)}
                                className="px-5 py-2.5 bg-brand-sky-500 hover:bg-brand-sky-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                              >
                                Accept Run
                              </button>
                            </>
                          )}

                          {job.status === "accepted" && (
                            <button
                              onClick={() => onStartPickup(job.id)}
                              className="px-5 py-2.5 bg-brand-sky-600 hover:bg-brand-sky-700 text-white font-bold text-[11px] rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Truck size={14} /> Start Dispatch Run
                            </button>
                          )}

                          {job.status === "in_progress" && (
                            <button
                              onClick={() => setCompletingRequestId(job.id)}
                              className="px-5 py-2.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-extrabold text-[11px] rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle size={14} /> Mark Handover Finished
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* COMPLETED JOBS READ-ONLY PANEL */}
        {activeTab === "completed" && isApproved && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 font-display">Completed collections history</h2>
              <p className="text-xs text-gray-405 mt-1">Read-only audit parameters of completed runs.</p>
            </div>

            {completedJobs.length === 0 ? (
              <div className="glass-card p-16 rounded-[28px] text-center shadow-lg">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-350">
                  <CheckCircle size={26} />
                </div>
                <h4 className="font-bold text-gray-700 text-sm">No completed runs recorded</h4>
                <p className="text-xs text-gray-400 mt-1">Legwork metadata settles here once completion is confirmed.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 border-b border-gray-150">
                    <tr>
                      <th className="p-4">Ref ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Address Parameters</th>
                      <th className="p-4">Your Completion Notes</th>
                      <th className="p-4">Completion Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-y-gray-100">
                    {completedJobs.map(job => {
                      const customer = getCustomerProfile(job.customer_id);
                      return (
                        <tr key={job.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-mono font-bold text-xs text-gray-400 select-all">#{job.id}</td>
                          <td className="p-4">
                            <span className="block font-bold text-gray-800">{customer.full_name}</span>
                            <span className="block text-[10px] text-gray-400 font-mono">+91 {customer.phone}</span>
                          </td>
                          <td className="p-4 text-xs font-bold text-gray-800">{getCategoryName(job.category_id)}</td>
                          <td className="p-4 text-xs text-gray-500">
                            <span className="block">{job.pincode}, {job.city}</span>
                            <span className="block text-[10px] text-gray-400 truncate max-w-[150px]">{job.address}</span>
                          </td>
                          <td className="p-4 text-xs text-gray-600 italic max-w-xs truncate" title={job.notes}>
                            {job.notes || "Not specified."}
                          </td>
                          <td className="p-4 text-xs text-gray-400">{new Date(job.updated_at).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

            {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="max-w-3xl glass-card rounded-[32px] p-6 md:p-10 text-left shadow-2xl animate-fade-in">
            <div className="pb-4 border-b border-gray-105 mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-display">Collector Credentials & Pincodes</h2>
              <p className="text-xs text-gray-400 mt-1">Configure your logistical business identifier and operated cities/postals.</p>
            </div>

            {profileSuccessMsg && (
              <div className="bg-brand-sky-50 border border-brand-sky-100 text-brand-sky-800 p-4 rounded-xl text-xs font-semibold mb-6 flex gap-2">
                <Check size={16} /> {profileSuccessMsg}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Agency Business Identifier Name</label>
                  <input 
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-sky-500 focus:outline-hidden uppercase font-semibold"
                    placeholder="E.g. Kalyan Green Recyclers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Operated Area Pin codes (Comma separated)</label>
                  <input 
                    type="text"
                    required
                    value={serviceAreasRaw}
                    onChange={(e) => setServiceAreasRaw(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-sky-500 focus:outline-hidden font-mono"
                    placeholder="E.g. 400001, Kalyan, Thane, 421301"
                  />
                  <span className="text-[10px] text-gray-450 mt-1 block">Separate pin codes or municipalities with commas.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Authorized Owner Full Name</label>
                  <input 
                    type="text"
                    required
                    value={vendorFullName}
                    onChange={(e) => setVendorFullName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-brand-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Authorized Phone Contact Line</label>
                  <div className="relative font-mono">
                    <span className="absolute left-4 top-3.5 text-xs text-gray-400 font-extrabold">+91</span>
                    <input 
                      type="text"
                      maxLength={10}
                      required
                      value={vendorPhone}
                      onChange={(e) => setVendorPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-brand-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-brand-sky-500 hover:bg-brand-sky-600 text-white font-extrabold text-xs tracking-widest rounded-xl shadow-md uppercase transition cursor-pointer"
              >
                Save Collector Profile & Area Pin codes
              </button>
            </form>
          </div>
        )}

      </main>

      {/* CONFIRMATION DIALOG FOR MARKING HANDOVER COMPLETED */}
      {completingRequestId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setCompletingRequestId(null)}>
          <div 
            className="glass-card rounded-[32px] w-full max-w-md shadow-2xl shadow-slate-900/10 p-6 md:p-8 animate-slide-up text-left border border-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-extrabold text-gray-900 text-base font-display flex items-center gap-2">
                <CheckCircle className="text-brand-green-600" size={18} /> Confirm Handover Weight & Payout
              </h3>
              <button onClick={() => setCompletingRequestId(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitPickupCompletion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-550 mb-2">Transaction Logs / Scale Weight Notes</label>
                <textarea 
                  required
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="E.g. Weighed 15kg scrap steel. Paid Customer ₹300 directly via GPay transfer. Dispatched to regional depot."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:border-brand-green-500 focus:bg-white focus:outline-hidden"
                ></textarea>
                <span className="text-[10px] text-gray-400 mt-1 block leading-normal">This handover note is visible on the customer's permanent timeline tracking.</span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingRequestId(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-205 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Verify Permanent Completion ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
