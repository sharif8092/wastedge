import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Profile, Vendor, Category, PickupRequest, Notification, UserRole, PickupRequestStatus } from "./types";
import { SEED_PROFILES, SEED_VENDORS, SEED_CATEGORIES, SEED_REQUESTS, SEED_NOTIFICATIONS } from "./data";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/pages/HomePage";
import { BookPage } from "./components/pages/BookPage";
import { AboutPage } from "./components/pages/AboutPage";
import { RatesPage } from "./components/pages/RatesPage";
import { TermsPage } from "./components/pages/TermsPage";
import { CustomerDashboard } from "./components/CustomerDashboard";
import { VendorDashboard } from "./components/VendorDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import {
  Recycle, ArrowRight, ShieldAlert, CheckCircle, Info, ArrowLeft, Phone
} from "lucide-react";

interface DatabaseState {
  profiles: Profile[];
  vendors: Vendor[];
  requests: PickupRequest[];
  notifications: Notification[];
}

// ──────────────────────────────────────────────────────────
// AUTH PAGES (Login / Register) with new light theme
// ──────────────────────────────────────────────────────────
function LoginPage({
  loginEmail, setLoginEmail,
  loginPassword, setLoginPassword,
  loginError,
  handleLoginSubmit,
  isSandboxUnlocked, setIsSandboxUnlocked,
  handleQuickLogin,
  triggerToast,
  setRegisterRoleField,
}: any) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 max-w-md w-full shadow-xl shadow-gray-100 animate-fade-in-up">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs text-gray-400 font-bold hover:text-brand-green-600 mb-8 cursor-pointer transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>

          <div className="mb-6">
            <div className="w-12 h-12 bg-brand-green-100 rounded-2xl flex items-center justify-center mb-4">
              <Recycle size={22} className="text-brand-green-600" />
            </div>
            <span className="text-[10px] bg-brand-green-100 text-brand-green-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mb-2">Sign In</span>
            <h2 className="text-3xl font-black text-gray-900 font-display">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your scrap collections and track pickups.</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold mb-4 flex gap-2 items-center animate-slide-down">
              <ShieldAlert size={16} className="shrink-0 text-red-500" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                placeholder="E.g. customer@wastedge.in"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 transition-all" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => triggerToast("Password reset email sent to your inbox.", "info")}
                  className="text-xs text-brand-green-600 hover:underline font-bold cursor-pointer">Forgot?</button>
              </div>
              <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-800 transition-all" />
            </div>
            <button type="submit"
              className="w-full py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl shadow-md shadow-brand-green-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2">
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          {/* Sandbox panel */}
          <div className="border-t border-gray-100 pt-5 mt-5 bg-gray-50 rounded-2xl p-4">
            {!isSandboxUnlocked ? (
              <div className="text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">🔒 Demo Access</p>
                <div className="flex gap-2">
                  <input type="password" id="sandbox-pin-input" placeholder="Enter PIN: 1234"
                    className="flex-1 border border-gray-200 text-xs rounded-xl px-3 py-2.5 bg-white font-mono text-center"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        const val = (e.target as HTMLInputElement).value;
                        if (val === "1234" || val === "admin123" || val === "admin") {
                          setIsSandboxUnlocked(true);
                        } else {
                          triggerToast("Wrong PIN. Try '1234'!", "warning");
                        }
                      }
                    }} />
                  <button type="button" onClick={() => {
                    const val = (document.getElementById("sandbox-pin-input") as HTMLInputElement)?.value;
                    if (val === "1234" || val === "admin123" || val === "admin") {
                      setIsSandboxUnlocked(true);
                    } else {
                      triggerToast("Wrong PIN. Try '1234'!", "warning");
                    }
                  }}
                    className="bg-gray-800 text-white rounded-xl px-4 py-2.5 font-bold text-xs cursor-pointer hover:bg-gray-900">
                    Unlock
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">⚡ Demo Profiles</span>
                  <button onClick={() => setIsSandboxUnlocked(false)} className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer">Lock</button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Aarav (Customer)", email: "customer@wastedge.in", color: "bg-brand-green-50 border-brand-green-100 text-brand-green-700" },
                    { label: "Kamran (Admin)", email: "admin@wastedge.in", color: "bg-indigo-50 border-indigo-100 text-indigo-700" },
                    { label: "Rajesh (Vendor)", email: "vendor@wastedge.in", color: "bg-orange-50 border-orange-100 text-orange-700" },
                  ].map(p => (
                    <button key={p.email} type="button" onClick={() => handleQuickLogin(p.email)}
                      className={`p-2.5 border rounded-xl font-bold text-center cursor-pointer hover:opacity-80 transition-all ${p.color}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <button onClick={() => { setRegisterRoleField("customer"); navigate("/register"); }}
              className="font-bold text-brand-green-600 hover:underline cursor-pointer">Create one free</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({
  regFullName, setRegFullName,
  regEmail, setRegEmail,
  regPhone, setRegPhone,
  regPassword, setRegPassword,
  regBusinessName, setRegBusinessName,
  regServiceAreas, setRegServiceAreas,
  registrationError,
  handleRegisterSubmit,
  registerRoleField, setRegisterRoleField,
}: any) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 max-w-md w-full shadow-xl shadow-gray-100 animate-fade-in-up">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-xs text-gray-400 font-bold hover:text-brand-green-600 mb-8 cursor-pointer transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>

          <div className="mb-5">
            <div className="w-12 h-12 bg-brand-green-100 rounded-2xl flex items-center justify-center mb-4">
              <Recycle size={22} className="text-brand-green-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 font-display">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1">Recycle for cash or become a verified collector.</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 mb-5 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
            {(["customer", "vendor"] as const).map(role => (
              <button key={role} type="button" onClick={() => setRegisterRoleField(role)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  registerRoleField === role
                    ? "bg-brand-green-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                {role === "customer" ? "🏠 Sell Scrap" : "🚛 Collect Scrap"}
              </button>
            ))}
          </div>

          {registrationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold mb-4 flex gap-2 items-center animate-slide-down">
              <ShieldAlert size={14} className="shrink-0" /> {registrationError}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {[
              { label: "Full Name", value: regFullName, onChange: setRegFullName, placeholder: "E.g. Aarav Mehta", type: "text" },
              { label: "Email Address", value: regEmail, onChange: setRegEmail, placeholder: "user@gmail.com", type: "email" },
              { label: "Mobile Number (+91)", value: regPhone, onChange: setRegPhone, placeholder: "9876543210", type: "text", maxLength: 10 },
              { label: "Password", value: regPassword, onChange: setRegPassword, placeholder: "••••••••", type: "password" },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                <input type={f.type} required value={f.value} onChange={e => f.onChange(e.target.value)}
                  placeholder={f.placeholder} maxLength={f.maxLength}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 transition-all" />
              </div>
            ))}

            {registerRoleField === "vendor" && (
              <div className="p-4 border border-brand-green-100 bg-brand-green-50 rounded-xl space-y-3 animate-fade-in">
                <span className="text-[10px] font-black text-brand-green-700 uppercase tracking-wider">Collector Agency Info</span>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Business Name</label>
                  <input type="text" required value={regBusinessName} onChange={e => setRegBusinessName(e.target.value)}
                    placeholder="E.g. Kalyan Green Recyclers"
                    className="w-full bg-white border border-brand-green-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Service PIN Codes (comma separated)</label>
                  <input type="text" required value={regServiceAreas} onChange={e => setRegServiceAreas(e.target.value)}
                    placeholder="E.g. 400001, 421301"
                    className="w-full bg-white border border-brand-green-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-800" />
                </div>
              </div>
            )}

            <button type="submit"
              className="w-full py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl shadow-md shadow-brand-green-200 transition-all active:scale-95 cursor-pointer">
              Create {registerRoleField === "vendor" ? "Collector Account" : "Free Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="font-bold text-brand-green-600 hover:underline cursor-pointer">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();

  const [db, setDb] = useState<DatabaseState>({ profiles: [], vendors: [], requests: [], notifications: [] });
  const [activeUser, setActiveUser] = useState<Profile | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning"; show: boolean }>({ message: "", type: "success", show: false });
  const [registerRoleField, setRegisterRoleField] = useState<"customer" | "vendor">("customer");
  const [isSandboxUnlocked, setIsSandboxUnlocked] = useState(false);

  // DB init
  useEffect(() => {
    try {
      const savedDb = localStorage.getItem("wastedge_db");
      if (savedDb) { setDb(JSON.parse(savedDb)); }
      else {
        const initialDb: DatabaseState = { profiles: SEED_PROFILES, vendors: SEED_VENDORS, requests: SEED_REQUESTS, notifications: SEED_NOTIFICATIONS };
        localStorage.setItem("wastedge_db", JSON.stringify(initialDb));
        setDb(initialDb);
      }
    } catch {
      setDb({ profiles: SEED_PROFILES, vendors: SEED_VENDORS, requests: SEED_REQUESTS, notifications: SEED_NOTIFICATIONS });
    }
  }, []);

  const syncToDisk = (updatedDb: DatabaseState) => {
    setDb(updatedDb);
    localStorage.setItem("wastedge_db", JSON.stringify(updatedDb));
  };

  const triggerToast = (msg: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message: msg, type, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4500);
  };

  // Auth states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) { setLoginError("Please fill in both fields."); return; }
    const matchedUser = db.profiles.find(p => p.email.toLowerCase().trim() === loginEmail.toLowerCase().trim());
    if (matchedUser) {
      setActiveUser(matchedUser);
      triggerToast(`Welcome back, ${matchedUser.full_name}!`);
      if (matchedUser.role === "admin") navigate("/admin-dashboard");
      else if (matchedUser.role === "vendor") navigate("/vendor-dashboard");
      else navigate("/customer-dashboard");
    } else {
      setLoginError("Invalid email or password. Try a demo account below.");
    }
  };

  const handleQuickLogin = (email: string) => {
    const matchedUser = db.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      setActiveUser(matchedUser);
      triggerToast(`Signed in as ${matchedUser.full_name}.`);
      if (matchedUser.role === "admin") navigate("/admin-dashboard");
      else if (matchedUser.role === "vendor") navigate("/vendor-dashboard");
      else navigate("/customer-dashboard");
    }
  };

  // Register states
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regServiceAreas, setRegServiceAreas] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError("");
    if (!regFullName || !regEmail || !regPhone || !regPassword) { setRegistrationError("All fields are required."); return; }
    if (regPhone.length !== 10 || isNaN(Number(regPhone))) { setRegistrationError("Phone must be 10 digits."); return; }
    if (db.profiles.some(p => p.email.toLowerCase().trim() === regEmail.toLowerCase().trim())) {
      setRegistrationError("Email already in use."); return;
    }
    const newProfileId = `prof-${Date.now()}`;
    const newProfile: Profile = {
      id: newProfileId,
      email: regEmail.toLowerCase().trim(),
      full_name: regFullName.trim(),
      phone: regPhone.trim(),
      role: registerRoleField,
      avatar_url: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?auto=format&fit=crop&q=80&w=150`,
      created_at: new Date().toISOString()
    };
    let updatedVendorsList = [...db.vendors];
    if (registerRoleField === "vendor") {
      if (!regBusinessName.trim()) { setRegistrationError("Business name is required."); return; }
      const initialCodes = regServiceAreas.split(",").map(c => c.trim()).filter(c => c.length > 0);
      if (initialCodes.length === 0) { setRegistrationError("At least one PIN code is required."); return; }
      updatedVendorsList.push({
        id: `ven-${Date.now()}`, user_id: newProfileId,
        business_name: regBusinessName.trim(), service_areas: initialCodes,
        verification_status: "pending", created_at: new Date().toISOString()
      });
    }
    syncToDisk({ ...db, profiles: [...db.profiles, newProfile], vendors: updatedVendorsList });
    setActiveUser(newProfile);
    triggerToast(`Welcome, ${newProfile.full_name}! Account created.`);
    if (newProfile.role === "vendor") navigate("/vendor-dashboard");
    else navigate("/customer-dashboard");
    setRegFullName(""); setRegEmail(""); setRegPhone(""); setRegPassword(""); setRegBusinessName(""); setRegServiceAreas("");
  };

  // Pickup operations
  const handleCreatePickupRequest = (reqData: Omit<PickupRequest, "id" | "customer_id" | "created_at" | "updated_at">) => {
    if (!activeUser) return;
    const newReqId = `req-${Math.floor(100 + Math.random() * 900)}`;
    const newRequest: PickupRequest = { ...reqData, id: newReqId, customer_id: activeUser.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const notif: Notification = { id: `not-${Date.now()}`, user_id: "prof-admin", title: "New Pickup Request 📥", message: `${activeUser.full_name} submitted a new pickup request in pincode ${reqData.pincode}.`, type: "request_created", is_read: false, created_at: new Date().toISOString() };
    syncToDisk({ ...db, requests: [newRequest, ...db.requests], notifications: [notif, ...db.notifications] });
    triggerToast("Pickup request submitted successfully.");
  };

  const handleCancelRequest = (requestId: string) => {
    const nextRequests = db.requests.map(r => r.id === requestId ? { ...r, status: "cancelled" as PickupRequestStatus, updated_at: new Date().toISOString() } : r);
    const notif: Notification = { id: `not-${Date.now()}`, user_id: "prof-admin", title: "Request Cancelled ⚠️", message: `Pickup #${requestId} was cancelled by customer.`, type: "vendor_status", is_read: false, created_at: new Date().toISOString() };
    syncToDisk({ ...db, requests: nextRequests, notifications: [notif, ...db.notifications] });
    triggerToast("Pickup request cancelled.", "warning");
  };

  const handleUpdateProfile = (name: string, phone: string) => {
    if (!activeUser) return;
    const nextProfiles = db.profiles.map(p => p.id === activeUser.id ? { ...p, full_name: name, phone } : p);
    syncToDisk({ ...db, profiles: nextProfiles });
    setActiveUser(prev => prev ? { ...prev, full_name: name, phone } : null);
    triggerToast("Profile updated.");
  };

  const handleUpdateVendorProfile = (bizName: string, serviceAreas: string[], ownerFullName: string, ownerPhone: string) => {
    if (!activeUser) return;
    const nextVendors = db.vendors.map(v => v.user_id === activeUser.id ? { ...v, business_name: bizName, service_areas: serviceAreas, verification_status: "pending" as const } : v);
    const nextProfiles = db.profiles.map(p => p.id === activeUser.id ? { ...p, full_name: ownerFullName, phone: ownerPhone } : p);
    const notif: Notification = { id: `not-${Date.now()}`, user_id: "prof-admin", title: "Vendor Profiles Audit 📋", message: `${ownerFullName} modified agency details. Returned to pending.`, type: "vendor_status", is_read: false, created_at: new Date().toISOString() };
    syncToDisk({ ...db, vendors: nextVendors, profiles: nextProfiles, notifications: [notif, ...db.notifications] });
    setActiveUser(prev => prev ? { ...prev, full_name: ownerFullName, phone: ownerPhone } : null);
    triggerToast("Agency profile updated. Re-submitted for audit.", "info");
  };

  const handleAcceptAssignmentByVendor = (reqId: string) => {
    if (!activeUser) return;
    const req = db.requests.find(r => r.id === reqId);
    if (!req) return;
    const myVendor = db.vendors.find(v => v.user_id === activeUser.id);
    const bizName = myVendor?.business_name || "Collector";
    const nextReqs = db.requests.map(r => r.id === reqId ? { ...r, status: "accepted" as const, updated_at: new Date().toISOString() } : r);
    const notifs: Notification[] = [
      { id: `not-${Date.now()}`, user_id: req.customer_id, title: "Collector Dispatched! 👋", message: `${bizName} accepted your pickup request.`, type: "vendor_accepted", is_read: false, created_at: new Date().toISOString() },
      { id: `not-adm-${Date.now()}`, user_id: "prof-admin", title: "Vendor Accept Alert", message: `${bizName} accepted request #${reqId}.`, type: "vendor_status", is_read: false, created_at: new Date().toISOString() },
    ];
    syncToDisk({ ...db, requests: nextReqs, notifications: [...notifs, ...db.notifications] });
    triggerToast("Assignment accepted!");
  };

  const handleDeclineAssignmentByVendor = (reqId: string) => {
    if (!activeUser) return;
    const myVendor = db.vendors.find(v => v.user_id === activeUser.id);
    const bizName = myVendor?.business_name || "Vendor";
    const nextReqs = db.requests.map(r => r.id === reqId ? { ...r, status: "pending" as const, vendor_id: undefined, updated_at: new Date().toISOString() } : r);
    const notif: Notification = { id: `not-adm-${Date.now()}`, user_id: "prof-admin", title: "Vendor Decline ⚠️", message: `${bizName} declined #${reqId}.`, type: "vendor_declined", is_read: false, created_at: new Date().toISOString() };
    syncToDisk({ ...db, requests: nextReqs, notifications: [notif, ...db.notifications] });
    triggerToast("Assignment declined.", "warning");
  };

  const handleStartPickupByVendor = (reqId: string) => {
    const nextReqs = db.requests.map(r => r.id === reqId ? { ...r, status: "in_progress" as const, updated_at: new Date().toISOString() } : r);
    const req = db.requests.find(r => r.id === reqId);
    const notifs = [...db.notifications];
    if (req) notifs.unshift({ id: `not-${Date.now()}`, user_id: req.customer_id, title: "Collector En Route! 🚚", message: "Your collector is on the way with a weighing scale.", type: "pickup_started", is_read: false, created_at: new Date().toISOString() });
    syncToDisk({ ...db, requests: nextReqs, notifications: notifs });
    triggerToast("Pickup started!");
  };

  const handleCompletePickupByVendor = (reqId: string, notes: string) => {
    const nextReqs = db.requests.map(r => r.id === reqId ? { ...r, status: "completed" as const, notes, updated_at: new Date().toISOString() } : r);
    const req = db.requests.find(r => r.id === reqId);
    const notifs = [...db.notifications];
    if (req) {
      notifs.unshift({ id: `not-${Date.now()}`, user_id: req.customer_id, title: "Pickup Complete! 🎉", message: `Your scrap was collected. Notes: "${notes}"`, type: "pickup_completed", is_read: false, created_at: new Date().toISOString() });
      notifs.unshift({ id: `not-adm-${Date.now()}`, user_id: "prof-admin", title: "Collections Completed ✓", message: `Pickup #${reqId} cleared by vendor.`, type: "vendor_status", is_read: false, created_at: new Date().toISOString() });
    }
    syncToDisk({ ...db, requests: nextReqs, notifications: notifs });
    triggerToast("Pickup completed!");
  };

  const handleAssignVendorByAdmin = (requestId: string, vendorProfileId: string) => {
    const targetReq = db.requests.find(r => r.id === requestId);
    const targetVendor = db.vendors.find(v => v.user_id === vendorProfileId);
    if (!targetReq || !targetVendor) return;
    const nextRequests = db.requests.map(r => r.id === requestId ? { ...r, vendor_id: vendorProfileId, status: "assigned" as const, updated_at: new Date().toISOString() } : r);
    const notifs: Notification[] = [
      { id: `not-c-${Date.now()}`, user_id: targetReq.customer_id, title: "Collector Assigned! ⚡", message: `"${targetVendor.business_name}" has been assigned to your request.`, type: "vendor_assigned", is_read: false, created_at: new Date().toISOString() },
      { id: `not-v-${Date.now()}`, user_id: vendorProfileId, title: "New Job Assigned! 📦", message: `Admin assigned you a pickup in ${targetReq.pincode}.`, type: "vendor_assigned", is_read: false, created_at: new Date().toISOString() },
    ];
    syncToDisk({ ...db, requests: nextRequests, notifications: [...notifs, ...db.notifications] });
    triggerToast(`Assigned request #${requestId}.`);
  };

  const handleUpdateStatusByAdmin = (requestId: string, status: PickupRequestStatus) => {
    const nextReqs = db.requests.map(r => r.id === requestId ? { ...r, status, updated_at: new Date().toISOString() } : r);
    const req = db.requests.find(r => r.id === requestId);
    const notif: Notification = { id: `not-${Date.now()}`, user_id: req?.customer_id || "prof-admin", title: "Status Update", message: `Request #${requestId} status changed to "${status}".`, type: "vendor_status", is_read: false, created_at: new Date().toISOString() };
    syncToDisk({ ...db, requests: nextReqs, notifications: [notif, ...db.notifications] });
    triggerToast(`Status updated to ${status}.`);
  };

  const handleDeleteRequestByAdmin = (requestId: string) => {
    syncToDisk({ ...db, requests: db.requests.filter(r => r.id !== requestId) });
    triggerToast(`Request #${requestId} deleted.`, "warning");
  };

  const handleApproveVendorByAdmin = (vendorId: string) => {
    const vRef = db.vendors.find(v => v.id === vendorId);
    if (!vRef) return;
    const nextVendors = db.vendors.map(v => v.id === vendorId ? { ...v, verification_status: "approved" as const, rejection_reason: undefined } : v);
    const notif: Notification = { id: `not-${Date.now()}`, user_id: vRef.user_id, title: "Account Activated! 🎉", message: "Your collector account has been approved. You can now accept jobs.", type: "vendor_status", is_read: false, created_at: new Date().toISOString() };
    syncToDisk({ ...db, vendors: nextVendors, notifications: [notif, ...db.notifications] });
    triggerToast(`Approved "${vRef.business_name}".`);
  };

  const handleRejectVendorByAdmin = (vendorId: string, reason: string) => {
    const vRef = db.vendors.find(v => v.id === vendorId);
    if (!vRef) return;
    const nextVendors = db.vendors.map(v => v.id === vendorId ? { ...v, verification_status: "rejected" as const, rejection_reason: reason } : v);
    const notif: Notification = { id: `not-${Date.now()}`, user_id: vRef.user_id, title: "Application Rejected ⚠️", message: `Reason: ${reason}. Please update your profile.`, type: "vendor_status", is_read: false, created_at: new Date().toISOString() };
    syncToDisk({ ...db, vendors: nextVendors, notifications: [notif, ...db.notifications] });
    triggerToast("Application rejected.", "warning");
  };

  const handleDeleteUserByAdmin = (userId: string) => {
    syncToDisk({ ...db, profiles: db.profiles.filter(p => p.id !== userId), vendors: db.vendors.filter(v => v.user_id !== userId), requests: db.requests.filter(r => r.customer_id !== userId && r.vendor_id !== userId) });
    triggerToast("User account deleted.", "warning");
  };

  const handleMarkNotificationRead = (notifId: string) => {
    syncToDisk({ ...db, notifications: db.notifications.map(n => n.id === notifId ? { ...n, is_read: true } : n) });
  };

  const handleNavigateDashboard = () => {
    if (!activeUser) { navigate("/login"); return; }
    if (activeUser.role === "admin") navigate("/admin-dashboard");
    else if (activeUser.role === "vendor") navigate("/vendor-dashboard");
    else navigate("/customer-dashboard");
  };

  const handleRegisterCustomerDirect = (name: string, email: string, phone: string): Profile => {
    const newProfileId = `prof-${Date.now()}`;
    const newProfile: Profile = {
      id: newProfileId, email: email.toLowerCase().trim(), full_name: name.trim(),
      phone: phone.trim(), role: "customer",
      avatar_url: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?auto=format&fit=crop&q=80&w=150`,
      created_at: new Date().toISOString()
    };
    syncToDisk({ ...db, profiles: [...db.profiles, newProfile] });
    setActiveUser(newProfile);
    return newProfile;
  };

  // Public pages layout (with Navbar + Footer)
  const PublicLayout = ({ children }: { children: React.ReactNode }) => (
    <>
      <Navbar activeUser={activeUser} onNavigateDashboard={handleNavigateDashboard} />
      {children}
      <Footer />
    </>
  );

  // Dashboard layout (no public nav/footer)
  const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Sandbox switcher */}
      {isSandboxUnlocked && activeUser && (
        <div className="bg-gray-900 text-gray-300 py-2.5 px-4 flex flex-col md:flex-row items-center justify-between text-xs gap-2 border-b border-gray-800">
          <span className="bg-brand-green-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0">Sandbox</span>
          <div className="flex flex-wrap gap-2 items-center">
            {[
              { label: "Aarav (Customer)", email: "customer@wastedge.in", role: "customer" as UserRole },
              { label: "Rajesh (Vendor)", email: "vendor@wastedge.in", role: "vendor" as UserRole },
              { label: "Kamran (Admin)", email: "admin@wastedge.in", role: "admin" as UserRole },
            ].map(p => (
              <button key={p.email} onClick={() => handleQuickLogin(p.email)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                  activeUser?.email === p.email ? "bg-brand-green-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}>{p.label}</button>
            ))}
            <button onClick={() => navigate("/")} className="px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 text-[10px] font-bold text-gray-400 cursor-pointer">← Public Home</button>
          </div>
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div className="antialiased">
      {/* Global Toast */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-full px-4 animate-slide-down">
          <div className={`p-4 rounded-2xl shadow-xl flex gap-3 text-sm font-semibold items-center ${
            toast.type === "success" ? "bg-brand-green-700 text-white" :
            toast.type === "warning" ? "bg-red-600 text-white" : "bg-gray-800 text-white"
          }`}>
            {toast.type === "success" && <CheckCircle size={18} className="shrink-0" />}
            {toast.type === "warning" && <ShieldAlert size={18} className="shrink-0" />}
            {toast.type === "info" && <Info size={18} className="shrink-0" />}
            <p className="flex-1 leading-snug text-sm">{toast.message}</p>
          </div>
        </div>
      )}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/book" element={<PublicLayout><BookPage activeUser={activeUser} db={db} onInstantDirectBooking={handleCreatePickupRequest} onRegisterCustomerDirect={handleRegisterCustomerDirect} /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/rates" element={<PublicLayout><RatesPage /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />

        {/* Auth pages */}
        <Route path="/login" element={
          <LoginPage
            loginEmail={loginEmail} setLoginEmail={setLoginEmail}
            loginPassword={loginPassword} setLoginPassword={setLoginPassword}
            loginError={loginError} handleLoginSubmit={handleLoginSubmit}
            isSandboxUnlocked={isSandboxUnlocked} setIsSandboxUnlocked={setIsSandboxUnlocked}
            handleQuickLogin={handleQuickLogin} triggerToast={triggerToast}
            setRegisterRoleField={setRegisterRoleField}
          />
        } />
        <Route path="/register" element={
          <RegisterPage
            regFullName={regFullName} setRegFullName={setRegFullName}
            regEmail={regEmail} setRegEmail={setRegEmail}
            regPhone={regPhone} setRegPhone={setRegPhone}
            regPassword={regPassword} setRegPassword={setRegPassword}
            regBusinessName={regBusinessName} setRegBusinessName={setRegBusinessName}
            regServiceAreas={regServiceAreas} setRegServiceAreas={setRegServiceAreas}
            registrationError={registrationError} handleRegisterSubmit={handleRegisterSubmit}
            registerRoleField={registerRoleField} setRegisterRoleField={setRegisterRoleField}
          />
        } />

        {/* Protected dashboards */}
        <Route path="/customer-dashboard" element={
          activeUser && (activeUser.role === "customer" || activeUser.role === "admin")
            ? <DashboardLayout><CustomerDashboard profile={activeUser} requests={db.requests} categories={SEED_CATEGORIES} notifications={db.notifications} allProfiles={db.profiles} onLogout={() => { setActiveUser(null); navigate("/"); }} onCreateRequest={handleCreatePickupRequest} onCancelRequest={handleCancelRequest} onUpdateProfile={handleUpdateProfile} onMarkNotificationRead={handleMarkNotificationRead} onSwitchToVendor={() => navigate("/vendor-dashboard")} /></DashboardLayout>
            : <Navigate to="/login" replace />
        } />
        <Route path="/vendor-dashboard" element={
          activeUser && (activeUser.role === "vendor" || activeUser.role === "admin")
            ? <DashboardLayout><VendorDashboard profile={activeUser} vendor={db.vendors.find(v => v.user_id === activeUser.id)} requests={db.requests} categories={SEED_CATEGORIES} notifications={db.notifications} allProfiles={db.profiles} onLogout={() => { setActiveUser(null); navigate("/"); }} onAcceptAssignment={handleAcceptAssignmentByVendor} onDeclineAssignment={handleDeclineAssignmentByVendor} onStartPickup={handleStartPickupByVendor} onCompletePickup={handleCompletePickupByVendor} onUpdateVendorProfile={handleUpdateVendorProfile} onMarkNotificationRead={handleMarkNotificationRead} onSwitchToCustomer={() => navigate("/customer-dashboard")} /></DashboardLayout>
            : <Navigate to="/login" replace />
        } />
        <Route path="/admin-dashboard" element={
          activeUser && activeUser.role === "admin"
            ? <DashboardLayout><AdminDashboard profile={activeUser} profiles={db.profiles} vendors={db.vendors} requests={db.requests} categories={SEED_CATEGORIES} notifications={db.notifications} onLogout={() => { setActiveUser(null); navigate("/"); }} onAssignVendor={handleAssignVendorByAdmin} onUpdateStatusByAdmin={handleUpdateStatusByAdmin} onDeleteRequest={handleDeleteRequestByAdmin} onApproveVendor={handleApproveVendorByAdmin} onRejectVendor={handleRejectVendorByAdmin} onDeleteUser={handleDeleteUserByAdmin} /></DashboardLayout>
            : <Navigate to="/login" replace />
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
