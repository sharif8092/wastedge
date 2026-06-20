import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Profile, Vendor, Category, PickupRequest, Notification, UserRole, PickupRequestStatus } from "./types";
import { SEED_CATEGORIES } from "./data";
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
import { SubdomainsPage } from "./components/pages/SubdomainsPage";
import {
  Recycle, ArrowRight, ShieldAlert, CheckCircle, Info, ArrowLeft, Phone
} from "lucide-react";
import { supabase } from "./lib/supabase";

// ──────────────────────────────────────────────────────────
// AUTH PAGES (Login / Register) with new light theme
// ──────────────────────────────────────────────────────────
function LoginPage({
  loginEmail, setLoginEmail,
  loginPassword, setLoginPassword,
  loginError,
  handleLoginSubmit,
  triggerToast,
  setRegisterRoleField,
  loginMethod, setLoginMethod,
  loginPhone, setLoginPhone,
  otp, setOtp,
  showOtpInput,
  handleSendOtp,
  handleVerifyOtp,
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

          <div className="flex gap-2 mb-5 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
            {(["email", "phone"] as const).map(method => (
              <button key={method} type="button" onClick={() => setLoginMethod(method)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  loginMethod === method
                    ? "bg-brand-green-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                {method === "email" ? "✉️ Email" : "📱 Phone OTP"}
              </button>
            ))}
          </div>

          <form onSubmit={loginMethod === 'email' ? handleLoginSubmit : (showOtpInput ? handleVerifyOtp : handleSendOtp)} className="space-y-4">
            {loginMethod === 'email' ? (
              <>
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
              </>
            ) : (
              <>
                {!showOtpInput ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Mobile Number (+91)</label>
                      <input type="tel" required value={loginPhone} onChange={e => setLoginPhone(e.target.value)}
                        placeholder="9876543210" maxLength={10}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 transition-all" />
                    </div>
                    <button type="submit"
                      className="w-full py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl shadow-md shadow-brand-green-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                      Send OTP <ArrowRight size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Enter OTP</label>
                      <input type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                        placeholder="123456" maxLength={6}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 transition-all tracking-widest text-center" />
                    </div>
                    <button type="submit"
                      className="w-full py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl shadow-md shadow-brand-green-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                      Verify OTP <CheckCircle size={16} />
                    </button>
                  </>
                )}
              </>
            )}
          </form>

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

  const [activeUser, setActiveUser] = useState<Profile | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning"; show: boolean }>({ message: "", type: "success", show: false });
  const [registerRoleField, setRegisterRoleField] = useState<"customer" | "vendor">("customer");

  // Supabase Auth Listener
  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (profile) {
        setActiveUser(profile);
      }
    };

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setActiveUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const triggerToast = (msg: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message: msg, type, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4500);
  };

  // Auth states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [loginPhone, setLoginPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) { setLoginError("Please fill in both fields."); return; }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginError(error.message);
    } else {
      let route = "/customer-dashboard";
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
        let finalProfile = profile;
        
        if (!profile) {
          const newProfile = {
            id: data.user.id,
            email: data.user.email || null,
            full_name: 'User',
            phone: '0000000000',
            role: 'customer' as const
          };
          await supabase.from('profiles').insert([newProfile]);
          finalProfile = newProfile;
        }

        setActiveUser(finalProfile);
        if (finalProfile.role === 'admin') route = "/admin-dashboard";
        else if (finalProfile.role === 'vendor') route = "/vendor-dashboard";
      }
      triggerToast(`Signed in successfully.`);
      navigate(route);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginPhone || loginPhone.length !== 10) { setLoginError("Please enter a valid 10-digit phone number."); return; }
    
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${loginPhone}` });
    if (error) {
      setLoginError(error.message);
    } else {
      setShowOtpInput(true);
      triggerToast("OTP sent successfully to your phone.", "info");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!otp || otp.length !== 6) { setLoginError("Please enter a valid 6-digit OTP."); return; }

    const { data, error } = await supabase.auth.verifyOtp({ phone: `+91${loginPhone}`, token: otp, type: 'sms' });
    if (error) {
      setLoginError(error.message);
      return;
    }

    if (data.user) {
      // Check if profile exists
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
      
      let finalProfile = profile;
      if (!profile) {
        // Insert basic profile
        const newProfile = {
          id: data.user.id,
          email: data.user.email || null,
          full_name: 'User',
          phone: loginPhone,
          role: 'customer' as const
        };
        const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
        if (insertError) {
          alert("Profile creation failed (RLS issue?): " + insertError.message);
        }
        finalProfile = newProfile;
      }
      
      setActiveUser(finalProfile);
      triggerToast("Signed in successfully.");
      if (finalProfile.role === "admin") navigate("/admin-dashboard");
      else if (finalProfile.role === "vendor") navigate("/vendor-dashboard");
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError("");
    if (!regFullName || !regEmail || !regPhone || !regPassword) { setRegistrationError("All fields are required."); return; }
    if (regPhone.length !== 10 || isNaN(Number(regPhone))) { setRegistrationError("Phone must be 10 digits."); return; }
    
    if (registerRoleField === "vendor") {
      if (!regBusinessName.trim()) { setRegistrationError("Business name is required."); return; }
      const initialCodes = regServiceAreas.split(",").map(c => c.trim()).filter(c => c.length > 0);
      if (initialCodes.length === 0) { setRegistrationError("At least one PIN code is required."); return; }
    }

    const { data, error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
    });

    if (error) {
      setRegistrationError(error.message);
      return;
    }

    if (data.user) {
      // Insert profile
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: regEmail.toLowerCase().trim(),
          full_name: regFullName.trim(),
          phone: regPhone.trim(),
          role: registerRoleField,
        }
      ]);

      if (profileError) {
        setRegistrationError(profileError.message);
        return;
      }

      if (registerRoleField === "vendor") {
        const initialCodes = regServiceAreas.split(",").map(c => c.trim()).filter(c => c.length > 0);
        await supabase.from('vendors').insert([
          {
            user_id: data.user.id,
            business_name: regBusinessName.trim(),
            service_areas: initialCodes,
            verification_status: 'pending'
          }
        ]);
      }

      triggerToast(`Account created! Welcome, ${regFullName}.`);
      if (registerRoleField === "admin") navigate("/admin-dashboard");
      else if (registerRoleField === "vendor") navigate("/vendor-dashboard");
      else navigate("/customer-dashboard");
      
      setRegFullName(""); setRegEmail(""); setRegPhone(""); setRegPassword(""); setRegBusinessName(""); setRegServiceAreas("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveUser(null);
    navigate("/");
  };

  const handleNavigateDashboard = () => {
    if (!activeUser) { navigate("/login"); return; }
    if (activeUser.role === "admin") navigate("/admin-dashboard");
    else if (activeUser.role === "vendor") navigate("/vendor-dashboard");
    else navigate("/customer-dashboard");
  };

  const handleRegisterCustomerDirect = async (name: string, email: string, phone: string): Promise<Profile | null> => {
    // Return null since we just want to remove dummy state
    triggerToast("Please complete full registration to create an account.", "info");
    navigate("/register");
    return null;
  };

  // Stub functions for components expecting them
  const handleCreatePickupRequest = async (payload: any) => {
    if (!activeUser) return;
    const reqId = 'REQ-' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random()*1000);
    const { error } = await supabase.from('pickup_requests').insert({
      id: reqId,
      customer_id: activeUser.id,
      ...payload
    });
    if (error) triggerToast("Error booking: " + error.message, "warning");
  };
  const handleCancelRequest = () => {};
  const handleUpdateProfile = () => {};
  const handleUpdateVendorProfile = () => {};
  const handleAcceptAssignmentByVendor = () => {};
  const handleDeclineAssignmentByVendor = () => {};
  const handleStartPickupByVendor = () => {};
  const handleCompletePickupByVendor = () => {};
  const handleAssignVendorByAdmin = () => {};
  const handleUpdateStatusByAdmin = () => {};
  const handleDeleteRequestByAdmin = () => {};
  const handleApproveVendorByAdmin = () => {};
  const handleRejectVendorByAdmin = () => {};
  const handleDeleteUserByAdmin = () => {};
  const handleMarkNotificationRead = () => {};

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
        <Route path="/book" element={<PublicLayout><BookPage activeUser={activeUser} db={{ requests: [], vendors: [], profiles: [] } as any} onInstantDirectBooking={handleCreatePickupRequest} onRegisterCustomerDirect={handleRegisterCustomerDirect} /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/rates" element={<PublicLayout><RatesPage /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
        <Route path="/subdomains" element={<PublicLayout><SubdomainsPage /></PublicLayout>} />

        {/* Auth pages */}
        <Route path="/login" element={
          <LoginPage
            loginEmail={loginEmail} setLoginEmail={setLoginEmail}
            loginPassword={loginPassword} setLoginPassword={setLoginPassword}
            loginError={loginError} handleLoginSubmit={handleLoginSubmit}
            triggerToast={triggerToast}
            setRegisterRoleField={setRegisterRoleField}
            loginMethod={loginMethod} setLoginMethod={setLoginMethod}
            loginPhone={loginPhone} setLoginPhone={setLoginPhone}
            otp={otp} setOtp={setOtp}
            showOtpInput={showOtpInput}
            handleSendOtp={handleSendOtp}
            handleVerifyOtp={handleVerifyOtp}
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
            ? <DashboardLayout><CustomerDashboard profile={activeUser} requests={[]} categories={SEED_CATEGORIES} notifications={[]} allProfiles={[]} onLogout={handleLogout} onCreateRequest={handleCreatePickupRequest} onCancelRequest={handleCancelRequest} onUpdateProfile={handleUpdateProfile} onMarkNotificationRead={handleMarkNotificationRead} onSwitchToVendor={() => navigate("/vendor-dashboard")} /></DashboardLayout>
            : <Navigate to="/login" replace />
        } />
        <Route path="/vendor-dashboard" element={
          activeUser && (activeUser.role === "vendor" || activeUser.role === "admin")
            ? <DashboardLayout><VendorDashboard profile={activeUser} requests={[]} categories={SEED_CATEGORIES} notifications={[]} allProfiles={[]} onLogout={handleLogout} onCreateRequest={handleCreatePickupRequest} onCancelRequest={handleCancelRequest} onUpdateProfile={handleUpdateProfile} onMarkNotificationRead={handleMarkNotificationRead} onSwitchToCustomer={() => navigate("/customer-dashboard")} /></DashboardLayout>
            : <Navigate to="/login" replace />
        } />
        <Route path="/admin-dashboard" element={
          activeUser && activeUser.role === "admin"
            ? <DashboardLayout><AdminDashboard profile={activeUser} profiles={[]} vendors={[]} requests={[]} categories={SEED_CATEGORIES} notifications={[]} onLogout={handleLogout} onAssignVendor={handleAssignVendorByAdmin} onUpdateStatusByAdmin={handleUpdateStatusByAdmin} onDeleteRequest={handleDeleteRequestByAdmin} onApproveVendor={handleApproveVendorByAdmin} onRejectVendor={handleRejectVendorByAdmin} onDeleteUser={handleDeleteUserByAdmin} /></DashboardLayout>
            : <Navigate to="/login" replace />
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
