import React, { useState, useRef, useEffect } from "react";
import { 
  Recycle, 
  Truck, 
  Wallet, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Cpu, 
  Home as HomeIcon, 
  Briefcase, 
  Settings, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Calculator,
  TrendingUp,
  Coins,
  Camera,
  Search,
  User,
  Lock,
  Upload,
  CheckCircle,
  X,
  Sparkles,
  Info,
  Clock,
  ExternalLink,
  Plus,
  Minus,
  Trash2,
  ShoppingBag
} from "lucide-react";
import { Profile, Category, PickupRequest } from "../types";
import { SEED_CATEGORIES, INDIAN_STATES } from "../data";

interface ScrapObjectRate {
  id: string;
  name: string;
  rate: number;
  unit: "kg" | "pc";
  category_id: string;
  market_trend: "up" | "down" | "stable";
  popular_label: string;
  trend_value: string;
}

// Global live scrap references
const SCRAP_OBJECTS: ScrapObjectRate[] = [
  // Paper Waste
  { id: "newspapers", name: "Daily Newspapers (Raddi)", rate: 18, unit: "kg", category_id: "cat-2", market_trend: "up", popular_label: "Bulk News", trend_value: "+4.2%" },
  { id: "carton", name: "Cardboard Packaging Boxes", rate: 14, unit: "kg", category_id: "cat-2", market_trend: "stable", popular_label: "Carton", trend_value: "0.0%" },
  { id: "office_records", name: "Office Records & Files", rate: 16, unit: "kg", category_id: "cat-2", market_trend: "up", popular_label: "White Paper", trend_value: "+1.5%" },
  { id: "textbooks", name: "School Textbooks & Books", rate: 12, unit: "kg", category_id: "cat-2", market_trend: "down", popular_label: "Books", trend_value: "-2.1%" },

  // Plastic Waste
  { id: "pet_bottles", name: "PET Water & Beverage Bottles", rate: 16, unit: "kg", category_id: "cat-1", market_trend: "up", popular_label: "PET Clear", trend_value: "+8.3%" },
  { id: "plastic_crates", name: "Heavy Plastic Crates/Tubs", rate: 21, unit: "kg", category_id: "cat-1", market_trend: "stable", popular_label: "HDPE", trend_value: "0.0%" },
  { id: "plastic_jars", name: "Household Containers & Jars", rate: 12, unit: "kg", category_id: "cat-1", market_trend: "down", popular_label: "Mixed PVC", trend_value: "-1.0%" },

  // Metal Scrap
  { id: "copper_wire", name: "Pure Unsheathed Copper Wire", rate: 460, unit: "kg", category_id: "cat-3", market_trend: "up", popular_label: "Copper Red", trend_value: "+12.1%" },
  { id: "brass_utensils", name: "Brass Utensils & Castings", rate: 345, unit: "kg", category_id: "cat-3", market_trend: "stable", popular_label: "Brass Honey", trend_value: "0.0%" },
  { id: "iron_beams", name: "Heavy Iron Roding Steel", rate: 32, unit: "kg", category_id: "cat-3", market_trend: "up", popular_label: "Heavy Iron", trend_value: "+4.8%" },
  { id: "aluminum_wheels", name: "Aluminum Scraps & Alloy", rate: 125, unit: "kg", category_id: "cat-3", market_trend: "up", popular_label: "Alloy", trend_value: "+3.5%" },
  { id: "steel_sinks", name: "Stainless Steel Utensils", rate: 42, unit: "kg", category_id: "cat-3", market_trend: "down", popular_label: "Steel 34", trend_value: "-0.5%" },

  // E-Waste
  { id: "smartphones_dead", name: "Dead Smartphones", rate: 90, unit: "pc", category_id: "cat-4", market_trend: "stable", popular_label: "Mobiles", trend_value: "0.0%" },
  { id: "appliances_ac", name: "Old Split Air Conditioner", rate: 1600, unit: "pc", category_id: "cat-4", market_trend: "up", popular_label: "Split AC", trend_value: "+7.4%" },
  { id: "desktops_dead", name: "Dead Workstation Towers", rate: 290, unit: "pc", category_id: "cat-4", market_trend: "up", popular_label: "CPU Tower", trend_value: "+5.1%" },
  { id: "wiring_cables", name: "Insulated Copper cables", rate: 70, unit: "kg", category_id: "cat-4", market_trend: "stable", popular_label: "Cables", trend_value: "0.0%" },

  // Household Scrap
  { id: "battery_car", name: "Lead-Acid Car Batteries", rate: 480, unit: "pc", category_id: "cat-5", market_trend: "up", popular_label: "Lead Battery", trend_value: "+6.0%" },
  { id: "geyser_old", name: "Old Metal Water Geyser", rate: 380, unit: "pc", category_id: "cat-5", market_trend: "up", popular_label: "Geysers", trend_value: "+2.2%" },
  { id: "mattress_old", name: "Old Bed Foam Mattress", rate: 180, unit: "pc", category_id: "cat-5", market_trend: "stable", popular_label: "Bedding", trend_value: "0.0%" },
  
  // Industrial Scrap
  { id: "machinery_motor", name: "Dead Electric Motors", rate: 110, unit: "kg", category_id: "cat-7", market_trend: "up", popular_label: "Motors", trend_value: "+8.5%" },
  { id: "iron_shavings", name: "Industrial Metallic Shavings", rate: 28, unit: "kg", category_id: "cat-7", market_trend: "stable", popular_label: "Shavings", trend_value: "0.0%" }
];

interface LandingProps {
  onNavigate: (page: string, params?: any) => void;
  onSetInitialRoleOnRegister: (role: "customer" | "vendor") => void;
  activeUser: Profile | null;
  db: { profiles: Profile[]; requests: PickupRequest[]; vendors: any[] };
  onInstantDirectBooking: (reqData: any) => void;
  onQuickLogin: (email: string) => void;
  onRegisterCustomerDirect: (name: string, email: string, phone: string) => Profile;
}

export function LandingPage({ 
  onNavigate, 
  onSetInitialRoleOnRegister, 
  activeUser, 
  db,
  onInstantDirectBooking,
  onQuickLogin,
  onRegisterCustomerDirect
}: LandingProps) {
  
  // Active App Interface Views: 'home' (Sell Hub & interactive calculations), 'rates' (Dynamic grid directory)
  const [appSection, setAppSection] = useState<"home" | "rates">("home");

  // Filter & search states in 'rates' directory catalog
  const [ratesFilterCat, setRatesFilterCat] = useState<string>("all");
  const [ratesSearchQuery, setRatesSearchQuery] = useState<string>("");

  // Simplified Booking Flow States
  const [bookCategory, setBookCategory] = useState<string>("cat-3"); // default Metal Scrap
  const [basketItems, setBasketItems] = useState<{ id: string; weight: number }[]>([
    { id: "copper_wire", weight: 25 }
  ]);
  
  const [bookAddress, setBookAddress] = useState<string>("");
  const [bookState, setBookState] = useState<string>("Maharashtra");
  const [bookCity, setBookCity] = useState<string>("Mumbai Metro");
  const [bookPincode, setBookPincode] = useState<string>("");
  const [bookDescription, setBookDescription] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Streamlined Auth step Overlay (Triggered prior to post-auth step 3)
  const [showAuthOverlay, setShowAuthOverlay] = useState<boolean>(false);
  
  // Auth Form details
  const [authFormName, setAuthFormName] = useState<string>("");
  const [authFormEmail, setAuthFormEmail] = useState<string>("guest-" + Math.floor(1000 + Math.random() * 9000) + "@wastedge.in");
  const [authFormPhone, setAuthFormPhone] = useState<string>("");
  const [authFormError, setAuthFormError] = useState<string>("");

  // Optional Post-Auth Image Step Modal State
  const [showOptionalPhotoStep, setShowOptionalPhotoStep] = useState<boolean>(false);
  const [postAuthImages, setPostAuthImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hidden Sandbox Security Console state for debugging
  const [isConsoleUnlocked, setIsConsoleUnlocked] = useState<boolean>(false);
  const [consolePin, setConsolePin] = useState<string>("");
  const [logoClicks, setLogoClicks] = useState<number>(0);

  const handleLogoSecretClick = () => {
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 4) {
      setLogoClicks(0);
      const pin = prompt("Enter Sandbox Developer PIN (e.g. 1234):");
      if (pin === "1234" || pin === "admin123" || pin === "admin") {
        setIsConsoleUnlocked(true);
        onQuickLogin("admin@wastedge.in");
      } else if (pin !== null) {
        alert("Access Denied: Invalid Security Passcode.");
      }
    } else {
      setLogoClicks(nextClicks);
    }
  };

  // Booking result receipt
  const [bookedReceipt, setBookedReceipt] = useState<any>(null);

  // Auto pick related material when category shifts
  const handleCategorySelection = (catId: string) => {
    setBookCategory(catId);
  };

  const handleToggleBasketItem = (itemId: string) => {
    const exists = basketItems.find(item => item.id === itemId);
    if (exists) {
      setBasketItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      const itemObj = SCRAP_OBJECTS.find(o => o.id === itemId);
      const defaultWeight = itemObj?.unit === "kg" ? 15 : 5;
      setBasketItems(prev => [...prev, { id: itemId, weight: defaultWeight }]);
    }
  };

  const handleUpdateBasketItemWeight = (itemId: string, newWeight: number) => {
    setBasketItems(prev => prev.map(item => {
      if (item.id === itemId) return { ...item, weight: Math.max(1, newWeight) };
      return item;
    }));
  };

  const calculatedPayout = basketItems.reduce((acc, item) => {
    const obj = SCRAP_OBJECTS.find(o => o.id === item.id);
    return acc + (obj ? obj.rate * item.weight : 0);
  }, 0);

  // Streamlined Booking flow initiation
  const handleProceedBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (basketItems.length === 0) {
      alert("Please select at least one item into your pickup request first.");
      return;
    }

    if (!bookAddress.trim()) errors.address = "Address is mandatory for doorside pickup";
    if (!bookPincode.trim() || bookPincode.length !== 6 || isNaN(Number(bookPincode))) {
      errors.pincode = "Enter a valid 6-digit PIN code";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // Perform check for login baad do booking k time pe
    if (activeUser) {
      // User is logged in, skip auth overlay and slide open Optional Photo step immediately
      setShowOptionalPhotoStep(true);
    } else {
      // Trigger authentication first
      setShowAuthOverlay(true);
    }
  };

  // Triggers guest register/login and immediately shifts to the optional image step
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFormError("");

    if (!authFormName.trim()) {
      setAuthFormError("Please enter your name.");
      return;
    }
    if (!authFormPhone.trim() || authFormPhone.length !== 10 || isNaN(Number(authFormPhone))) {
      setAuthFormError("Enter a valid 10-digit mobile number.");
      return;
    }

    // Direct guest registration
    const newProfile = onRegisterCustomerDirect(authFormName, authFormEmail, authFormPhone);
    if (newProfile) {
      setShowAuthOverlay(false);
      setShowOptionalPhotoStep(true);
    } else {
      setAuthFormError("Failed to authorize. Try another email.");
    }
  };

  // Finalizes booking request with optional images
  const handleFinalBookingSubmit = () => {
    const finalUser = activeUser;
    if (!finalUser) return;

    const basketDesc = basketItems.map(item => {
      const obj = SCRAP_OBJECTS.find(o => o.id === item.id);
      return obj ? `${item.weight}${obj.unit} of ${obj.name}` : "";
    }).filter(Boolean).join(", ");

    const dynamicDescription = `Multi-item Basket: ${basketDesc}`;

    const requestPayload = {
      category_id: bookCategory,
      description: bookDescription || dynamicDescription,
      address: bookAddress,
      city: bookCity,
      state: bookState,
      pincode: bookPincode,
      image_urls: postAuthImages,
      status: "pending" as const
    };

    onInstantDirectBooking(requestPayload);

    const firstObj = basketItems.length > 0 ? SCRAP_OBJECTS.find(o => o.id === basketItems[0].id) : null;

    // Save metadata for local Receipt View
    setBookedReceipt({
      id: `req-${Math.floor(100 + Math.random() * 900)}`,
      itemName: basketItems.length === 1 && firstObj ? firstObj.name : `${basketItems.length} items basket`,
      weight: basketItems.reduce((sum, item) => sum + item.weight, 0),
      unit: basketItems.length === 1 && firstObj ? firstObj.unit : "Mixed",
      payout: calculatedPayout,
      addressStr: `${bookAddress}, ${bookCity}, ${bookState} - ${bookPincode}`,
      imagesCount: postAuthImages.length,
      isMultiple: basketItems.length > 1,
      items: basketItems.map(item => {
        const obj = SCRAP_OBJECTS.find(o => o.id === item.id) || SCRAP_OBJECTS[0];
        return { name: obj.name, weight: item.weight, unit: obj.unit, rate: obj.rate };
      })
    });

    // Reset modals & wizard inputs
    setShowOptionalPhotoStep(false);
    setBookAddress("");
    setBookPincode("");
    setBookDescription("");
    setPostAuthImages([]);
  };

  // Drag over drop handlers for optional image attachments
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      appendUploadedFiles(e.dataTransfer.files);
    }
  };

  const appendUploadedFiles = (files: FileList) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (fileArray.length + postAuthImages.length > 5) {
      alert("Max 5 images are allowed.");
      return;
    }

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPostAuthImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen relative overflow-x-hidden font-sans flex flex-col justify-between">
      
      {/* Decorative cosmic neon glow effects inside the dark app canvas */}
      <div className="absolute top-[-250px] left-[50%] transform -translate-x-[50%] w-[600px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-100px] w-[350px] h-[350px] bg-emerald-650/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* HEADER BAR */}
      <header className="border-b border-white/5 bg-slate-950/75 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg shadow-slate-950/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo Brand Segment */}
          <div 
            onClick={handleLogoSecretClick}
            className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform duration-200 min-w-0"
            title="Double-click or multiple-click to verify console"
          >
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-1.5 sm:p-2 rounded-xl text-white shadow-md shadow-emerald-500/15 flex items-center justify-center shrink-0">
              <Recycle size={15} className="animate-spin-slow sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-white text-[13px] sm:text-base tracking-tight font-display flex items-center gap-1 sm:gap-2 leading-none">
                wastEdge 
                <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/10 tracking-wider font-mono">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live
                </span>
              </span>
              <p className="text-[7.5px] text-slate-500 font-mono tracking-wider sm:tracking-widest uppercase mt-0.5 font-bold truncate">Certified Hub</p>
            </div>
          </div>

          {/* Header navigation removed to maintain absolute minimalist cleanliness */}

          {/* Quick Stats & Secure Workspace Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Realtime Connection Status Node */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-900/50 border border-slate-805 px-3 py-1.5 rounded-xl text-[9.5px] font-semibold text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 font-bold font-mono">28</span>
                <span>Active Collectors</span>
              </div>
              <span className="text-slate-800">|</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Locality:</span> 
                <span className="text-white font-mono font-bold">Mumbai Metro</span>
              </div>
            </div>

            {activeUser ? (
              <button
                type="button"
                onClick={() => {
                  if (activeUser.role === "admin") {
                    onNavigate("admin-dashboard");
                  } else if (activeUser.role === "vendor") {
                    onNavigate("vendor-dashboard");
                  } else {
                    onNavigate("customer-dashboard");
                  }
                }}
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10 shrink-0"
              >
                <User size={10} className="text-emerald-100 sm:w-[11px] sm:h-[11px]" />
                <span>Console</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-[9.5px] sm:text-[11px] text-slate-350 hover:text-white font-extrabold transition-all duration-200 rounded-lg hover:bg-slate-900/40"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSetInitialRoleOnRegister("customer");
                    onNavigate("register");
                  }}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-95 text-white font-black text-[9.5px] sm:text-[10px] uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/15 border border-emerald-500/20"
                >
                  Sell
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="bg-slate-950/45 border-b border-white/5 py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-2 sm:gap-3">
          <span className="text-[8px] sm:text-[9.5px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/15 py-1 px-2 rounded-lg border border-emerald-500/15 shrink-0 flex items-center gap-1 sm:gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <TrendingUp size={10} className="hidden sm:inline" />
            <span>Live Price</span>
          </span>
          
          {/* Horizontal animated scroll-like ticker container */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5 text-[10px] sm:text-[11px] tracking-wide select-none flex-1 items-center">
            {SCRAP_OBJECTS.filter(obj => obj.market_trend !== "down" || obj.rate > 50).map(obj => (
              <div 
                key={obj.id} 
                onClick={() => {
                  setBookCategory(obj.category_id);
                  handleToggleBasketItem(obj.id);
                  setAppSection("home");
                }}
                className="bg-slate-900 hover:bg-slate-850 cursor-pointer border border-slate-805/60 px-2.5 py-1 rounded-lg flex items-center gap-2 transition shrink-0 hover:border-slate-700 active:scale-95"
              >
                <span className="font-extrabold text-slate-350">{obj.popular_label}</span>
                <span className="font-mono text-emerald-400 font-bold">₹{obj.rate}/{obj.unit}</span>
                <span className="text-[8px] sm:text-[9px] text-emerald-500 font-bold font-mono px-1 py-0.2 bg-emerald-500/10 rounded">
                  {obj.trend_value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM HIGH-IMPACT HERO SECTION */}
      <section id="hero-section" className="relative px-4 py-16 md:py-24 text-center overflow-hidden flex flex-col items-center border-b border-white/5 bg-radial-gradient from-slate-900/40 via-transparent to-transparent">
        {/* Abstract background neon concentric mesh overlays */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse duration-5000"></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[200px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center w-full">
          {/* Top Pill Tag */}
          <div className="flex justify-center mb-8 animate-fade-in w-full">
            <div className="inline-flex items-center justify-center text-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] md:text-[11px] font-extrabold text-emerald-400 uppercase tracking-[0.15em] font-mono shadow-md backdrop-blur-md mx-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-450"></span>
              </span>
              <span className="flex items-center gap-1.5 justify-center">
                <Sparkles size={11} className="text-emerald-450" />
                India's ISO-Calibrated Recycle Network
              </span>
            </div>
          </div>

          {/* Majestic Hero Display Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6.5xl font-black tracking-tight text-white leading-[1.1] font-display max-w-3xl mx-auto">
            Turn Household Scrap Into <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent font-sans">
              Instant Physical Payouts
            </span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-350 max-w-2xl mx-auto mt-5 sm:mt-6 leading-relaxed font-sans font-medium px-4 text-center">
            Zero rigging. Direct-market rates. Book an instant door-to-door dispatch slot. Our certified agents weigh scrap on <strong className="text-emerald-400 font-semibold font-mono">ISO-calibrated digital screens</strong> for immediate digital liquid asset settlement.
          </p>

          {/* PRIMARY MOBILE-FIRST CTA BUTTON WITH DYNAMIC HALO GLOW & TACTILE RESPONSIVE FEEDBACK */}
          <div className="w-full max-w-none sm:max-w-md mt-8 sm:mt-10 px-4 relative group mx-auto flex flex-col items-center justify-center">
            {/* Passive Breathing Ambient Glow (High visual pop on both mobile and desktop without needing hover) */}
            <div className="absolute inset-x-4 inset-y-0 bg-emerald-500/20 rounded-2xl blur-xl group-hover:bg-emerald-500/30 transition-all duration-300 animate-pulse"></div>
            
            <a 
              href="#booking-section" 
              className="relative flex items-center justify-center gap-3 w-full py-4.5 sm:py-5 px-6 sm:px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-[13px] uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all duration-200 text-center cursor-pointer font-sans select-none min-h-[56px] border border-emerald-400/10"
            >
              <Recycle size={15} className="text-slate-950 animate-spin-slow group-hover:rotate-180 transition-transform duration-700 shrink-0" />
              <span className="truncate">Book Doorstep Collection Slot</span>
              <ArrowRight size={14} className="text-slate-950 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
            </a>
            
            <p className="relative z-10 text-[9.5px] sm:text-[10px] text-slate-500 font-mono mt-3.5 uppercase tracking-wider select-none">
              ✦ Average collection agent arrives in under 2 hours
            </p>
          </div>

          {/* Smart Quick Navigation Row - Relocated from Header for a pristine minimalist header aesthetic */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-8 sm:mt-12 text-[10px] uppercase font-extrabold tracking-wider font-mono">
            <a 
              href="#how-it-works" 
              className="px-3.5 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-805/80 text-slate-400 hover:text-emerald-450 transition-all rounded-xl flex items-center gap-1.5 shadow-lg shadow-black/10 active:scale-95 hover:border-slate-700"
            >
              ⚡ How it Works
            </a>
            <a 
              href="#categories" 
              className="px-3.5 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-805/80 text-slate-400 hover:text-emerald-450 transition-all rounded-xl flex items-center gap-1.5 shadow-lg shadow-black/10 active:scale-95 hover:border-slate-700"
            >
              🏷️ Scrap Index
            </a>
            <a 
              href="#booking-section" 
              className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/15 text-emerald-400 hover:text-emerald-300 transition-all rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/20 active:scale-95"
            >
              🔥 Instant Estimate
            </a>
          </div>

          {/* Quick core advantages widgets */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 text-[10px] sm:text-[11px] font-semibold text-slate-400 font-sans">
            <div className="flex items-center gap-1.5 bg-slate-950/40 border border-slate-805/60 px-3 py-2 rounded-xl backdrop-blur-xs select-none">
              <ShieldCheck size={13} className="text-emerald-405 shrink-0" />
              <span>Certified Calibration</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/40 border border-slate-805/60 px-3 py-2 rounded-xl backdrop-blur-xs select-none">
              <Coins size={13} className="text-emerald-405 shrink-0" />
              <span>UPI & Doorstep Cash</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/40 border border-slate-805/60 px-3 py-2 rounded-xl backdrop-blur-xs select-none">
              <Truck size={13} className="text-emerald-450 shrink-0" />
              <span>Free Doorway Service</span>
            </div>
          </div>

          {/* Micro stats dashboard counter nodes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto mt-8 sm:mt-14 w-full px-2">
            
            <div className="bg-slate-950/30 border border-slate-805 p-4 rounded-2xl text-center backdrop-blur-xs hover:border-emerald-500/20 hover:bg-slate-950/50 transition-all duration-300 select-none">
              <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest font-mono font-black block">RECYCLED VOLUME</span>
              <span className="text-lg md:text-2xl font-black text-white font-mono mt-1 block">85,420+ kg</span>
              <span className="text-[9.5px] text-emerald-505 font-bold block mt-1">✦ Live Registry</span>
            </div>

            <div className="bg-slate-950/30 border border-slate-805 p-4 rounded-2xl text-center backdrop-blur-xs hover:border-emerald-500/20 hover:bg-slate-950/50 transition-all duration-300 select-none">
              <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest font-mono font-black block">SETTLED PAYOUTS</span>
              <span className="text-lg md:text-2xl font-black text-emerald-400 font-mono mt-1 block">₹18.4 Lakhs</span>
              <span className="text-[9.5px] text-slate-400 font-semibold block mt-1">Direct Settlement</span>
            </div>

            <div className="bg-slate-950/30 border border-slate-805 p-4 rounded-2xl text-center backdrop-blur-xs hover:border-emerald-500/20 hover:bg-slate-950/50 transition-all duration-300 select-none">
              <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest font-mono font-black block">DISPATCH RESPONSE</span>
              <span className="text-lg md:text-2xl font-black text-white font-mono mt-1 block">&lt; 2 Hours</span>
              <span className="text-[9.5px] text-emerald-450 font-semibold block mt-1">Immediate Assignment</span>
            </div>

            <div className="bg-slate-950/30 border border-slate-805 p-4 rounded-2xl text-center backdrop-blur-xs hover:border-emerald-500/20 hover:bg-slate-950/50 transition-all duration-300 select-none">
              <span className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest font-mono font-black block">CARBON ABSTAINED</span>
              <span className="text-lg md:text-2xl font-black text-teal-400 font-mono mt-1 block">22.4 Tonnes</span>
              <span className="text-[9.5px] text-teal-450 font-semibold block mt-1">Certified Impact</span>
            </div>

          </div>
        </div>
      </section>

      {/* DUAL ACTION VIEW NAVIGATION */}
      <div className="max-w-md mx-auto w-full px-4 mt-6">
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex shadow-2xl">
          <button 
            type="button"
            onClick={() => { setAppSection("home"); setBookedReceipt(null); }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              appSection === "home" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            <Recycle size={14} /> Sell scrap now
          </button>
          
          <button 
            type="button"
            onClick={() => { setAppSection("rates"); setBookedReceipt(null); }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
              appSection === "rates" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp size={14} /> Live Prices (₹)
          </button>
        </div>
      </div>

      {/* MAIN VIEW CONTROLLER */}
      <main className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">

        {/* 1. SECTOR INDEX: COMPLETED BOOKING RECEIPT SHOWCASE */}
        {bookedReceipt && (
          <div className="max-w-lg mx-auto bg-slate-950 border border-slate-800 rounded-[32px] p-6 text-center shadow-2xl relative animate-fade-in border-emerald-500/30 mb-8 overflow-hidden font-sans">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600"></div>
            
            <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
              <CheckCircle size={24} />
            </div>

            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
              Recycling Spot Registered
            </span>

            <h3 className="text-lg font-black text-white mt-3 font-display">Doorstep Ticket Pending Assignment</h3>
            <p className="text-xs text-slate-400 mt-1">Our system is locating verified scales near your location.</p>

            {/* Custom styled voucher coupon panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-6 text-left space-y-3.5 relative">
              
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-800">
                <span className="text-xs text-slate-400 font-bold">Ticket reference</span>
                <span className="text-xs font-extrabold text-white font-mono">{bookedReceipt.id}</span>
              </div>

              {bookedReceipt.isMultiple && bookedReceipt.items && bookedReceipt.items.length > 0 ? (
                <div className="pb-2 border-b border-dashed border-slate-800 space-y-1 text-xs">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block mb-1">Basket Contents</span>
                  {bookedReceipt.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-slate-300 font-medium truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono text-slate-400">{item.weight}{item.unit} × ₹{item.rate}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-800">
                  <span className="text-xs text-slate-400 font-bold">Selected Item</span>
                  <span className="text-xs font-extrabold text-slate-100">{bookedReceipt.itemName}</span>
                </div>
              )}

              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-800">
                <span className="text-xs text-slate-400 font-bold">Quantity Factor</span>
                <span className="text-xs font-black text-emerald-400 font-mono">
                  {bookedReceipt.isMultiple ? `${bookedReceipt.weight} Units (Total)` : `${bookedReceipt.weight} ${bookedReceipt.unit}`}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-dashed border-slate-800">
                <span className="text-xs text-slate-400 font-bold">Estimated Payout Earnings</span>
                <span className="text-sm font-black text-emerald-400 font-mono">₹{bookedReceipt.payout.toLocaleString("en-IN")} INR</span>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-wider font-black text-slate-500 block mb-1">Pickup Address Coordinates</span>
                <p className="text-xs text-slate-350 leading-relaxed font-mono">{bookedReceipt.addressStr}</p>
              </div>

              {bookedReceipt.imagesCount > 0 ? (
                <div className="pt-2 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10 flex items-center gap-2 mt-2">
                  <Camera size={14} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-bold">Attached {bookedReceipt.imagesCount} verification snapshots successfully!</span>
                </div>
              ) : (
                <p className="text-[9.5px] text-slate-500 mt-2 italic">No photos attached. Ready for normal manual screening.</p>
              )}
            </div>

            {/* Custom Tracking progress meters */}
            <div className="mt-6 p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-left ">
              <span className="text-[9px] text-slate-400 uppercase font-black block tracking-widest mb-3">Live Dispatch Sequence</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold tracking-wider">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">✓ Slot booked</div>
                <div className="p-1 rounded bg-slate-850 text-slate-400 border border-slate-800">⚡ Dispatch pool</div>
                <div className="p-1 rounded bg-slate-850 text-slate-400 border border-slate-800">⏱ Weight scale</div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3.5">
              <button 
                onClick={() => onNavigate("customer-dashboard")}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Go to personal customer dashboard
              </button>
              <button 
                onClick={() => setBookedReceipt(null)}
                className="text-xs text-slate-450 hover:text-emerald-400 transition"
              >
                Book another door-to-door request
              </button>
            </div>
          </div>
        )}

        {/* VIEW A: HOMEPAGE APP CONSOLE (Default View for Sell) */}
        {appSection === "home" && !bookedReceipt && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Frame: Premium App Calculator Stage */}
            <div id="categories" className="lg:col-span-7 bg-slate-950 rounded-[32px] border border-slate-800 p-6 md:p-8 shadow-2xl relative scroll-mt-24">
              
              {/* Card Header tag */}
              <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-slate-800 mb-6 font-sans gap-3 text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start">
                  <h3 className="font-extrabold text-white text-base md:text-lg">Step 1: Choose Scrap Category</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Glassmorphic interactive categories below.</p>
                </div>
                <Sparkles className="text-emerald-500 w-5 h-5 shrink-0 animate-pulse" />
              </div>

              {/* Glassmorphic category slider cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SEED_CATEGORIES.map(cat => {
                  const isSelected = bookCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelection(cat.id)}
                      className={`p-3.5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                        isSelected 
                          ? "bg-slate-800 border-emerald-500 text-white shadow-xl ring-2 ring-emerald-500/20" 
                          : "bg-slate-900 hover:bg-slate-850/80 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="text-2xl mb-1.5 filter drop-shadow-sm">{getCategoryEmoji(cat.id)}</span>
                      <span className="text-[11px] font-black tracking-tight leading-tight block truncate w-full">{cat.category_name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub Object Picker Grid */}
              <div className="mt-8">
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-3 text-center sm:text-left">
                  Step 2: Add raw materials to your pickup request
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SCRAP_OBJECTS.filter(obj => obj.category_id === bookCategory).map(obj => {
                    const basketItem = basketItems.find(item => item.id === obj.id);
                    const isSelectedObj = !!basketItem;

                    return (
                      <div
                        key={obj.id}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 group relative ${
                          isSelectedObj 
                            ? "bg-emerald-950/20 border-emerald-500/70 shadow-md shadow-emerald-500/5 text-white ring-1 ring-emerald-500/10" 
                            : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-colors ${
                            isSelectedObj ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-950 text-slate-500"
                          }`}>
                            {getCategoryEmoji(obj.category_id)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-black block leading-tight text-white truncate">{obj.name}</span>
                            <span className="font-mono text-[10px] text-emerald-400 font-bold block mt-1">
                              ₹{obj.rate}/{obj.unit} 
                              {isSelectedObj && basketItem && (
                                <span className="text-slate-450 font-sans font-medium ml-2 text-[9px]">
                                  Subtotal: <strong className="text-emerald-400 font-mono font-bold">₹{obj.rate * basketItem.weight}</strong>
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1">
                          {isSelectedObj && basketItem ? (
                            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-0.5 shadow-xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateBasketItemWeight(obj.id, basketItem.weight - (obj.unit === "kg" ? 5 : 1))}
                                className="p-1 text-slate-400 hover:text-white rounded-lg transition active:scale-90 hover:bg-slate-900"
                              >
                                <Minus size={11} />
                              </button>
                              <div className="flex items-center gap-0.5 px-1 bg-transparent min-w-[42px] justify-center text-[10.5px] font-black text-white font-mono">
                                <span>{basketItem.weight}</span>
                                <span className="text-[8px] text-slate-500 uppercase">{obj.unit}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUpdateBasketItemWeight(obj.id, basketItem.weight + (obj.unit === "kg" ? 5 : 1))}
                                className="p-1 text-slate-400 hover:text-white rounded-lg transition active:scale-90 hover:bg-slate-900"
                              >
                                <Plus size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleBasketItem(obj.id)}
                                className="p-1 text-slate-550 hover:text-red-400 transition"
                                title="Remove item"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleBasketItem(obj.id)}
                              className="px-2.5 py-1.5 bg-slate-955 hover:bg-emerald-600 border border-slate-800 hover:border-transparent text-emerald-450 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1 active:scale-95"
                            >
                              <Plus size={10} />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scrap Inventory Basket Review Node */}
              <div className="mt-8 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-left font-sans animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="block text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                      🧺 Active Pickup Basket ({basketItems.length})
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Review and modify weight aggregates below</p>
                  </div>
                  <ShoppingBag className="text-emerald-400 w-4 h-4" />
                </div>

                {basketItems.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-slate-805 rounded-2xl bg-slate-950/20">
                    <p className="text-slate-500 text-xs font-bold font-sans">No items added to pickup yet</p>
                    <p className="text-slate-600 text-[10px] mt-1 font-sans">Select any material categories under Step 2 above to insert them</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {basketItems.map(item => {
                      const obj = SCRAP_OBJECTS.find(o => o.id === item.id);
                      if (!obj) return null;
                      return (
                        <div key={item.id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-805">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6.5 h-6.5 rounded bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                              {getCategoryEmoji(obj.category_id)}
                            </span>
                            <div>
                              <span className="text-xs font-black text-slate-200 block leading-none">{obj.name}</span>
                              <span className="text-[10px] text-slate-505 font-bold block mt-1.5">
                                Rate: ₹{obj.rate}/{obj.unit} • Subtotal: <strong className="text-emerald-455">₹{obj.rate * item.weight}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateBasketItemWeight(item.id, item.weight - (obj.unit === "kg" ? 5 : 1))}
                                className="p-1.5 text-slate-450 hover:text-white rounded transition active:scale-95"
                              >
                                <Minus size={11} />
                              </button>
                              <div className="flex items-center gap-0.5 px-1 bg-transparent min-w-[50px] justify-center text-xs font-mono font-bold text-white">
                                <span>{item.weight}</span>
                                <span className="text-[9px] text-slate-500 font-mono uppercase font-black">{obj.unit}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUpdateBasketItemWeight(item.id, item.weight + (obj.unit === "kg" ? 5 : 1))}
                                className="p-1.5 text-slate-450 hover:text-white rounded transition active:scale-95"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleBasketItem(item.id)}
                              className="p-2 bg-slate-900 text-slate-550 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 rounded-lg transition-all"
                              title="Delete item"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Elegant inline mobile valuation ticket for multiple select basket to save scrolling down */}
                    <div className="lg:hidden mt-4 bg-emerald-950/15 border border-emerald-500/15 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs transition">
                      <div>
                        <span className="text-[8.5px] text-slate-400 uppercase font-black block tracking-wider">Basket Valuation Total</span>
                        <span className="text-[10px] text-slate-455 font-bold block mt-0.5">{basketItems.length} categories registered</span>
                      </div>
                      <span className="font-mono text-emerald-450 font-black text-sm bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-805">
                        ₹{calculatedPayout.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking destination (Address has been streamlined with image upload removed into optional post-auth step) */}
              <form id="booking-section" onSubmit={handleProceedBooking} className="mt-8 space-y-4 scroll-mt-24">
                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3 text-center sm:text-left">
                    Step 3: Tell Us Your Area Coordinates
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-left font-sans">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Doorside Address</label>
                      <input 
                        type="text" 
                        placeholder="Flat no, Building street, area..."
                        value={bookAddress}
                        onChange={(e) => setBookAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4.5 py-3 text-xs focus:border-emerald-500 focus:outline-hidden text-slate-100 placeholder:text-slate-500"
                      />
                      {formErrors.address && <p className="text-[10px] text-red-400 font-bold mt-1">⚠️ {formErrors.address}</p>}
                    </div>

                    <div className="text-left font-sans">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">6-Digit Pin code</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="e.g. 400001"
                        value={bookPincode}
                        onChange={(e) => setBookPincode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4.5 py-3 text-xs focus:border-emerald-500 focus:outline-hidden text-slate-100 placeholder:text-slate-500 font-mono"
                      />
                      {formErrors.pincode && <p className="text-[10px] text-red-400 font-bold mt-1">⚠️ {formErrors.pincode}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="text-left font-sans">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">City / Metropolitan Area</label>
                      <input 
                        type="text" 
                        value={bookCity}
                        onChange={(e) => setBookCity(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4.5 py-3 text-xs focus:border-emerald-500 text-white focus:outline-hidden"
                      />
                    </div>

                    <div className="text-left font-sans">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Regional State</label>
                      <select 
                        value={bookState}
                        onChange={(e) => setBookState(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4 py-3 text-xs focus:border-emerald-500 text-white cursor-pointer focus:outline-hidden"
                      >
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="text-left font-sans mt-4">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Pickup descriptions / notes (Optional)</label>
                    <textarea 
                      rows={2}
                      value={bookDescription}
                      onChange={(e) => setBookDescription(e.target.value)}
                      placeholder="Explain anything to your collector, e.g. 'Old newspaper stack, dry and packed'..."
                      className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4 py-3 text-xs focus:border-emerald-500 text-white focus:outline-hidden placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Submits booking trigger */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-555 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-700/10 cursor-pointer transition flex items-center justify-center gap-2 font-display duration-200 active:scale-95"
                  >
                    🚀 Schedule Doorside Pickup Slot
                    <ArrowRight size={14} />
                  </button>
                  <p className="text-center text-[10px] text-slate-500 mt-2.5 font-medium">
                    No credentials or payment required to use calculator. Accounts verified on next step during instant booking.
                  </p>
                </div>

              </form>

            </div>

            {/* Right Frame: Simulated Live Earnings Estimator Node */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Dynamic Earnings Ledger */}
              <div className="bg-slate-950 border-2 border-emerald-550/20 rounded-[32px] p-6 text-left relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 bg-emerald-500 w-1.5 h-full"></div>
                
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-black tracking-widest font-mono uppercase inline-block">
                  Live Exchange rate ledger
                </span>
                
                <h3 className="text-lg font-black text-white tracking-tight mt-3 font-display">Simulated Valuation</h3>
                
                <div className="space-y-4 mt-6 animate-fade-in">
                  <div className="max-h-52 overflow-y-auto pr-1 space-y-2 no-scrollbar bg-slate-900/50 p-2.5 rounded-xl border border-slate-805">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block px-1 py-0.5">Basket Breakdown</span>
                    {basketItems.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic px-1 py-4 text-center">Your basket is empty. Tap raw material cards on the left to add items.</p>
                    ) : (
                      basketItems.map(item => {
                        const obj = SCRAP_OBJECTS.find(o => o.id === item.id);
                        if (!obj) return null;
                        return (
                          <div key={item.id} className="p-2 rounded-lg bg-slate-950 flex justify-between items-center text-[11px] border border-slate-800 hover:border-slate-705 transition-all">
                            <div className="truncate max-w-[170px]">
                              <span className="font-bold text-slate-200 block truncate leading-tight">{obj.name}</span>
                              <span className="text-[9.5px] text-slate-500 font-mono block mt-0.5">{item.weight} {obj.unit} × ₹{obj.rate}/unit</span>
                            </div>
                            <span className="font-extrabold text-emerald-400 font-mono">₹{(obj.rate * item.weight).toLocaleString("en-IN")}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-emerald-950/70 to-slate-950 border border-emerald-500/20 p-6 rounded-2xl text-center relative overflow-hidden">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">
                      Total estimated cash payout
                    </span>
                    
                    <div className="flex items-baseline justify-center gap-1 font-mono mt-3 text-white">
                      <span className="text-base text-emerald-400 font-bold">₹</span>
                      <span className="text-3xl md:text-3xl font-black">{calculatedPayout.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-emerald-450 ml-1.5 font-bold font-sans">INR</span>
                    </div>

                    <p className="text-[10px] text-slate-500 mt-2 font-mono">
                      Cumulative weight payout settled instantly
                    </p>
                  </div>
                </div>

                <div className="mt-5 p-3.5 rounded-xl bg-slate-900 border border-slate-805 text-[11px] text-slate-450 leading-relaxed block">
                  <span className="font-black text-white flex items-center gap-1 mb-1 font-display">
                    <ShieldCheck size={13} className="text-emerald-500" /> Digital Calibration Scales
                  </span>
                  Our dispatched collectors carry verified calibration instruments checkable on smart devices for 100% fair-weigh integrity.
                </div>
              </div>

              {/* Informative Help Box */}
              <div id="how-it-works" className="bg-slate-955 border border-slate-800 rounded-3xl p-5 text-left text-xs font-sans scroll-mt-24">
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Info size={11} className="text-emerald-400" /> Doorstep Operation Features
                </span>
                <div className="space-y-3 mt-3">
                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="p-1 rounded bg-slate-850 text-emerald-400 shrink-0 font-bold border border-slate-800 text-[10px]">1</span>
                    <p className="leading-normal">Certified logistics dispatch is organized in less than 2 hours.</p>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="p-1 rounded bg-slate-850 text-emerald-400 shrink-0 font-bold border border-slate-800 text-[10px]">2</span>
                    <p className="leading-normal">Payment settled immediately on the spot using direct digital UPI transaction or Cash.</p>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="p-1 rounded bg-slate-850 text-emerald-400 shrink-0 font-bold border border-slate-800 text-[10px]">3</span>
                    <p className="leading-normal">Zero Operational visit, scale, or appraisal charges whatsoever.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW B: SCRAP LIVE PRICE DIRECTORY GRID */}
        {appSection === "rates" && !bookedReceipt && (
          <div className="bg-slate-950 rounded-[32px] border border-slate-850 p-6 md:p-8 shadow-2xl text-left animate-fade-in font-sans">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-805 mb-6">
              <div>
                <h3 className="font-black text-white text-lg md:text-xl font-display">Indian National Scrap Price directory</h3>
                <p className="text-xs text-slate-450 mt-1">Live raw materials value chart tracked hourly with industrial yard trends.</p>
              </div>

              {/* Filter Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search materials (e.g. Copper, Newspaper)..."
                  value={ratesSearchQuery}
                  onChange={(e) => setRatesSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Filter segments */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button 
                onClick={() => setRatesFilterCat("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  ratesFilterCat === "all" ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-250 border border-slate-800"
                }`}
              >
                All Raw Materials
              </button>
              {SEED_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setRatesFilterCat(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 border ${
                    ratesFilterCat === cat.id ? "bg-emerald-600 text-white border-transparent" : "bg-slate-900 text-slate-400 hover:text-white border-slate-800"
                  }`}
                >
                  <span>{getCategoryEmoji(cat.id)}</span>
                  <span>{cat.category_name}</span>
                </button>
              ))}
            </div>

            {/* Price list database */}
            {SCRAP_OBJECTS.filter(obj => {
              const matchCat = ratesFilterCat === "all" || obj.category_id === ratesFilterCat;
              const matchSearch = obj.name.toLowerCase().includes(ratesSearchQuery.toLowerCase()) || 
                                  obj.popular_label.toLowerCase().includes(ratesSearchQuery.toLowerCase());
              return matchCat && matchSearch;
            }).length === 0 ? (
              <div className="py-20 text-center">
                <AlertCircle className="mx-auto w-10 h-10 text-slate-600 mb-2" />
                <h4 className="font-bold text-slate-400 text-sm">No items match your query input</h4>
                <p className="text-xs text-slate-500 mt-1">Refine your terms or choose another sector chips categorization filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SCRAP_OBJECTS.filter(obj => {
                  const matchCat = ratesFilterCat === "all" || obj.category_id === ratesFilterCat;
                  const matchSearch = obj.name.toLowerCase().includes(ratesSearchQuery.toLowerCase()) || 
                                      obj.popular_label.toLowerCase().includes(ratesSearchQuery.toLowerCase());
                  return matchCat && matchSearch;
                }).map(obj => (
                  <div key={obj.id} className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/20 rounded-2xl p-4.5 flex flex-col justify-between transition-all group duration-200">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[8px] font-black tracking-widest text-slate-500 uppercase font-mono">
                          {SEED_CATEGORIES.find(c => c.id === obj.category_id)?.category_name || "MEMBER"}
                        </span>
                        
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-black font-mono tracking-wider ${
                          obj.market_trend === "up" ? "bg-emerald-500/10 text-emerald-400" :
                          obj.market_trend === "down" ? "bg-red-500/10 text-red-400" : "bg-slate-800 text-slate-400"
                        }`}>
                          {obj.market_trend === "up" ? `▲ ${obj.trend_value}` :
                           obj.market_trend === "down" ? `▼ ${obj.trend_value}` : `● stable`}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-white text-sm leading-tight">{obj.name}</h4>
                    </div>

                    <div className="pt-4 border-t border-slate-800/85 mt-4 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-mono font-black">Indexed Rate</span>
                        <span className="font-black text-slate-100 text-base font-mono">
                          ₹{obj.rate}<span className="text-[11px] text-slate-450 font-normal">/{obj.unit}</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setBookCategory(obj.category_id);
                          handleToggleBasketItem(obj.id);
                          setAppSection("home");
                        }}
                        className="py-1.5 px-3 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5"
                      >
                        Trade
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* STREAMLINED AUTHENTICATION STEP OVERLAY MODAL ("login baad do booking k time pe") */}
      {showAuthOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] max-w-md w-full p-6 md:p-8 shadow-2xl relative text-left animate-slide-up">
            
            <button 
              type="button"
              onClick={() => setShowAuthOverlay(false)}
              className="absolute top-4 right-4 p-2 text-slate-450 hover:text-white hover:bg-slate-800 rounded-full transition"
            >
              <X size={16} />
            </button>

            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-black tracking-widest font-mono uppercase inline-block">
              Verify connection
            </span>

            <h3 className="text-lg font-black text-white mt-3 font-display">Let's Secure Your Booking Spot</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              We need a valid Indian contact matching your doorside address to dispatch our local certified collector.
            </p>

            {authFormError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-bold mt-4 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{authFormError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 mt-5">
              
              <div className="font-sans">
                <label className="block text-[10px] font-black uppercase text-slate-450 tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="e.g. Aarav Sharma"
                    value={authFormName}
                    onChange={(e) => setAuthFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-805 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="font-sans">
                <label className="block text-[10px] font-black uppercase text-slate-450 tracking-wider mb-1.5">Active Phone (for collection update calls)</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    maxLength={10}
                    placeholder="10-Digit Mobile Number"
                    value={authFormPhone}
                    onChange={(e) => setAuthFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-805 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="font-sans">
                <label className="block text-[10px] font-black uppercase text-slate-455 tracking-wider mb-1">Email (Autogenerated / Editable)</label>
                <input 
                  type="email" 
                  value={authFormEmail}
                  onChange={(e) => setAuthFormEmail(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-805 rounded-xl px-4 py-2.5 text-xs text-slate-450 focus:outline-hidden font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-550 text-white rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer transition flex items-center justify-center gap-2 mt-6"
              >
                🔐 Register Spot & Proceed to Optional Photos
                <ArrowRight size={13} />
              </button>
            </form>

            {/* PASSWORD PROTECTED ADMIN OVERRIDE CONSOLE */}
            {isConsoleUnlocked && (
              <div className="border-t border-slate-805 mt-6 pt-5 bg-slate-950/40 p-3.5 rounded-2xl border border-dashed border-slate-805">
                <div className="text-center">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-emerald-400 font-mono tracking-widest">
                      ⚡ Sandbox Quick Overrides
                    </span>
                    <button 
                      onClick={() => setIsConsoleUnlocked(false)}
                      className="text-[9px] font-bold text-red-400 hover:underline"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 mt-2.5 text-[10px]">
                    <button 
                      type="button"
                      onClick={() => {
                        onQuickLogin("customer@wastedge.in");
                        setShowAuthOverlay(false);
                        setShowOptionalPhotoStep(true);
                      }}
                      className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 rounded-xl font-black text-center"
                    >
                      Quick Aarav Custom
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        onQuickLogin("admin@wastedge.in");
                        setShowAuthOverlay(false);
                        setShowOptionalPhotoStep(true);
                      }}
                      className="p-2.5 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-400 rounded-xl font-black text-center"
                    >
                      Quick Admin
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* OPTIONAL STEP AFTER AUTHENTICATION: ENHANCED IMAGE UPLOADER */}
      {showOptionalPhotoStep && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] max-w-lg w-full p-6 md:p-8 shadow-2xl relative text-left animate-zoom-in">
            
            <button 
              type="button"
              onClick={() => setShowOptionalPhotoStep(false)}
              className="absolute top-4 right-4 p-2 text-slate-450 hover:text-white rounded-full transition"
            >
              <X size={16} />
            </button>

            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-black tracking-widest font-mono uppercase inline-block">
              Highly Recommended Step (Optional)
            </span>

            <h3 className="text-lg font-black text-white mt-3 font-display">Optional Verification Snaps</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Attaching photos of your scrap stack is entirely optional. It helps collectors allocate the correct pickup truck size.
            </p>

            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6.5 text-center cursor-pointer transition flex flex-col items-center justify-center mt-6 ${
                isDragOver ? "border-emerald-500 bg-emerald-500/5 text-white" : "border-slate-800 bg-slate-950/50 hover:bg-slate-950 text-slate-400"
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={(e) => { if (e.target.files) appendUploadedFiles(e.target.files); }}
                className="hidden"
              />
              <Camera className="text-slate-400 w-8 h-8 mb-2" />
              <span className="text-xs font-black text-slate-300 block">Drag and drop file or browse snaps</span>
              <span className="text-[10px] text-slate-500 mt-1 max-w-xs block leading-relaxed">
                Matches sizes for lorry, container or small pickup vans instantly. You can easily skip this.
              </span>
            </div>

            {postAuthImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {postAuthImages.map((b64, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-800">
                    <img src={b64} alt="Attachment stack picker" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPostAuthImages(prev => prev.filter((_, i) => i !== idx)); }}
                      className="absolute top-1.5 right-1.5 bg-red-650/90 text-white rounded-full p-1 hover:bg-red-700 text-[8px]"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { setPostAuthImages([]); handleFinalBookingSubmit(); }}
                className="py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition cursor-pointer text-center"
              >
                Skip Upload & Schedule 
              </button>

              <button
                type="button"
                onClick={handleFinalBookingSubmit}
                className="py-3.5 bg-emerald-600 hover:bg-emerald-550 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition cursor-pointer text-center shadow-lg shadow-emerald-500/10"
              >
                {postAuthImages.length > 0 ? `Schedule with ${postAuthImages.length} photo` : "Schedule Directly"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TRUST APP FOOTER */}
      <footer className="bg-slate-950 text-slate-450 border-t border-slate-850 py-12 px-6 text-left mt-20 font-sans text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-5 space-y-3">
            <span className="text-lg font-black text-white font-display flex items-center gap-1.5">
              wastEdge<span className="text-emerald-500 font-black text-xl">.</span>
            </span>
            <span className="block text-[11px] text-slate-400 font-bold">National Environmental Scrap Exchange Network</span>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">
              Our standard logistics software optimizes garbage or scrap pickup times, supports standard scales calibration, and ensures certified regional recycling compliance.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="block text-[10px] font-black text-white uppercase tracking-wider mb-2">Category Portals</span>
            <button onClick={() => { handleCategorySelection("cat-3"); setAppSection("home"); }} className="block text-slate-400 hover:text-white cursor-pointer hover:underline">⚙️ Copper & Steel Scrap</button>
            <button onClick={() => { handleCategorySelection("cat-4"); setAppSection("home"); }} className="block text-slate-400 hover:text-white cursor-pointer hover:underline">💻 Redundant Electronics</button>
            <button onClick={() => { handleCategorySelection("cat-2"); setAppSection("home"); }} className="block text-slate-400 hover:text-white cursor-pointer hover:underline">📰 Recyclable Paper Board</button>
            <button onClick={() => { handleCategorySelection("cat-1"); setAppSection("home"); }} className="block text-slate-400 hover:text-white cursor-pointer hover:underline">🥤 Transparent Polymers</button>
          </div>

          <div className="md:col-span-4 space-y-3">
            <span className="block text-[10px] uppercase font-black tracking-widest text-white mb-2">Security Compliance Standards</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every doorside service agent is background verified and carries government-issued weigh-scale calibrations. System operations run with zero environmental spillovers.
            </p>
            <div className="space-y-1 text-[10.5px] text-slate-400">
              <span className="block text-emerald-400 font-mono">✦ ISO 9500-D Certified Weighments</span>
              <span className="block text-emerald-400 font-mono">✦ Green-Trace Recycling Audits</span>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-550 text-[10.5px] font-mono">
          <p 
            onClick={handleLogoSecretClick}
            className="cursor-pointer active:text-emerald-400 select-none hover:text-slate-400 transition"
            title="Developer Mode Activation Trigger"
          >
            © {new Date().getFullYear()} wastEdge Solution India Ltd. Securely Sandboxed.
          </p>
          <div className="flex gap-4">
            <span>Verified Scales ISO 9001</span>
            <span>|</span>
            <span>Zero Spill Recyclers</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

function getCategoryEmoji(catId: string): string {
  switch (catId) {
    case "cat-1": return "🥤"; // Plastic
    case "cat-2": return "📰"; // Paper
    case "cat-3": return "⚙️"; // Metal
    case "cat-4": return "💻"; // E-Waste
    case "cat-5": return "🛏️"; // Household
    case "cat-6": return "💼"; // Office
    case "cat-7": return "🏭"; // Industrial
    case "cat-8": return "🧱"; // Construction
    default: return "♻️";
  }
}
