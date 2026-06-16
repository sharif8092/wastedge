import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Recycle, Truck, Wallet, ShieldCheck, ArrowRight, Briefcase,
  Home as HomeIcon, CheckCircle, Clock, TrendingUp, Coins, Sparkles,
  Search, User, Phone, Camera, X, Plus, Minus, Trash2, ShoppingBag,
  AlertCircle, Info, Building2, Leaf, Star, ChevronRight
} from "lucide-react";
import { Profile, PickupRequest } from "../../types";
import { SEED_CATEGORIES, INDIAN_STATES, SCRAP_OBJECTS } from "../../data";

function getCategoryEmoji(catId: string): string {
  switch (catId) {
    case "cat-1": return "🥤";
    case "cat-2": return "📰";
    case "cat-3": return "⚙️";
    case "cat-4": return "💻";
    case "cat-5": return "🏠";
    case "cat-6": return "💼";
    case "cat-7": return "🏭";
    case "cat-8": return "🧱";
    default: return "♻️";
  }
}

interface HomePageProps {
  activeUser: Profile | null;
  db: { profiles: Profile[]; requests: PickupRequest[]; vendors: any[] };
  onInstantDirectBooking: (reqData: any) => void;
  onRegisterCustomerDirect: (name: string, email: string, phone: string) => Profile;
}

export function BookPage({ activeUser, db, onInstantDirectBooking, onRegisterCustomerDirect }: HomePageProps) {
  const [bookCategory, setBookCategory] = useState<string>("cat-3");
  const [basketItems, setBasketItems] = useState<{ id: string; weight: number }[]>([
    { id: "copper_wire", weight: 25 }
  ]);
  const [bookAddress, setBookAddress] = useState<string>("");
  const [bookState, setBookState] = useState<string>("Maharashtra");
  const [bookCity, setBookCity] = useState<string>("Mumbai");
  const [bookPincode, setBookPincode] = useState<string>("");
  const [bookDescription, setBookDescription] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showAuthOverlay, setShowAuthOverlay] = useState<boolean>(false);
  const [showOptionalPhotoStep, setShowOptionalPhotoStep] = useState<boolean>(false);
  const [bookedReceipt, setBookedReceipt] = useState<any>(null);
  const [postAuthImages, setPostAuthImages] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [authFormName, setAuthFormName] = useState<string>("");
  const [authFormEmail, setAuthFormEmail] = useState<string>("guest-" + Math.floor(1000 + Math.random() * 9000) + "@wastedge.in");
  const [authFormPhone, setAuthFormPhone] = useState<string>("");
  const [authFormError, setAuthFormError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleBasketItem = (itemId: string) => {
    const exists = basketItems.find(item => item.id === itemId);
    if (exists) {
      setBasketItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      const itemObj = SCRAP_OBJECTS.find(o => o.id === itemId);
      const defaultWeight = itemObj?.unit === "kg" ? 15 : 1;
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

  const handleProceedBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (basketItems.length === 0) { alert("Please select at least one item."); return; }
    if (!bookAddress.trim()) errors.address = "Address is required";
    if (!bookPincode.trim() || bookPincode.length !== 6 || isNaN(Number(bookPincode))) {
      errors.pincode = "Enter a valid 6-digit PIN code";
    }
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});
    if (activeUser) {
      setShowOptionalPhotoStep(true);
    } else {
      setShowAuthOverlay(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFormError("");
    if (!authFormName.trim()) { setAuthFormError("Please enter your name."); return; }
    if (!authFormPhone.trim() || authFormPhone.length !== 10 || isNaN(Number(authFormPhone))) {
      setAuthFormError("Enter a valid 10-digit mobile number."); return;
    }
    const newProfile = onRegisterCustomerDirect(authFormName, authFormEmail, authFormPhone);
    if (newProfile) {
      setShowAuthOverlay(false);
      setShowOptionalPhotoStep(true);
    } else {
      setAuthFormError("Failed to authorize. Try another email.");
    }
  };

  const handleFinalBookingSubmit = () => {
    if (!activeUser) return;
    const basketDesc = basketItems.map(item => {
      const obj = SCRAP_OBJECTS.find(o => o.id === item.id);
      return obj ? `${item.weight}${obj.unit} of ${obj.name}` : "";
    }).filter(Boolean).join(", ");
    const requestPayload = {
      category_id: bookCategory,
      description: bookDescription || `Multi-item Basket: ${basketDesc}`,
      address: bookAddress, city: bookCity, state: bookState, pincode: bookPincode,
      image_urls: postAuthImages, status: "pending" as const
    };
    onInstantDirectBooking(requestPayload);
    const firstObj = basketItems.length > 0 ? SCRAP_OBJECTS.find(o => o.id === basketItems[0].id) : null;
    setBookedReceipt({
      id: `req-${Math.floor(100 + Math.random() * 900)}`,
      itemName: basketItems.length === 1 && firstObj ? firstObj.name : `${basketItems.length} items`,
      weight: basketItems.reduce((sum, item) => sum + item.weight, 0),
      unit: basketItems.length === 1 && firstObj ? firstObj.unit : "Mixed",
      payout: calculatedPayout,
      addressStr: `${bookAddress}, ${bookCity}, ${bookState} - ${bookPincode}`,
      imagesCount: postAuthImages.length,
      items: basketItems.map(item => {
        const obj = SCRAP_OBJECTS.find(o => o.id === item.id) || SCRAP_OBJECTS[0];
        return { name: obj.name, weight: item.weight, unit: obj.unit, rate: obj.rate };
      })
    });
    setShowOptionalPhotoStep(false);
    setBookAddress(""); setBookPincode(""); setBookDescription(""); setPostAuthImages([]);
  };

  const appendUploadedFiles = (files: FileList) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (fileArray.length + postAuthImages.length > 5) { alert("Max 5 images allowed."); return; }
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") setPostAuthImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const mediaLogos = [
    "The Hindu", "NDTV", "Times of India", "Economic Times", "India Today",
    "Hindustan Times", "LiveMint", "Financial Express", "YourStory", "Inc42",
  ];

  const howSteps = [
    { icon: <Clock size={28} className="text-brand-green-600" />, title: "Schedule Pickup", desc: "Book your slot online in 60 seconds — anytime, anywhere, free of charge." },
    { icon: <Truck size={28} className="text-brand-green-600" />, title: "Our Crew Collects", desc: "Trained & verified collectors arrive at your doorstep with ISO-calibrated weighing scales." },
    { icon: <Wallet size={28} className="text-brand-green-600" />, title: "Get Paid Instantly", desc: "Receive cash or UPI payment on the spot before our collector leaves your door." },
  ];

  const recyclables = [
    { emoji: "📰", label: "Paper" },
    { emoji: "🥤", label: "Plastic" },
    { emoji: "⚙️", label: "Metals" },
    { emoji: "💻", label: "E-Waste" },
    { emoji: "🏠", label: "Appliances" },
    { emoji: "🏭", label: "Industrial" },
    { emoji: "🚗", label: "Vehicles" },
    { emoji: "🏗️", label: "Construction" },
  ];

  const householdBenefits = [
    "On-Demand Doorstep Pickups",
    "Accurate Digital Weighing",
    "Safety (Trained & Verified Staff)",
    "Instant Cash / UPI Payment",
    "Free Pickup Service",
  ];

  const businessBenefits = [
    "Formal Payments & Documentation",
    "Sustainability Reports",
    "Competitive Prices",
    "Bulk Collection Capacity",
    "GST Invoice Available",
  ];

  const stats = [
    { label: "Recycled Volume", value: "85,420+", unit: "kg", color: "text-brand-green-700", icon: "♻️" },
    { label: "Settled Payouts", value: "₹18.4L", unit: "paid out", color: "text-brand-green-600", icon: "💰" },
    { label: "Dispatch Response", value: "< 2 hrs", unit: "avg arrival", color: "text-brand-orange-500", icon: "⚡" },
    { label: "CO₂ Reduced", value: "22.4T", unit: "certified", color: "text-brand-green-700", icon: "🌱" },
  ];

  return (
    <div className="bg-white font-sans pt-24 md:pt-28 min-h-screen">



      {/* ═══════ BOOKING FORM ═══════ */}
      <section id="booking" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-green-100 text-brand-green-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Instant Estimate + Booking
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 font-display">
              Schedule Your Pickup
            </h2>
            <p className="text-gray-500 mt-2">Select items, add your address, and confirm — done in 2 minutes.</p>
          </div>

          {bookedReceipt ? (
            /* Booking Receipt */
            <div className="max-w-lg mx-auto bg-white border border-brand-green-100 rounded-3xl p-8 text-center shadow-lg animate-fade-in">
              <div className="w-16 h-16 bg-brand-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-brand-green-600" />
              </div>
              <span className="inline-block bg-brand-green-100 text-brand-green-700 text-xs font-black px-3 py-1 rounded-full mb-3">
                Pickup Scheduled ✓
              </span>
              <h3 className="text-xl font-black text-gray-900 font-display">Doorstep Ticket Confirmed!</h3>
              <p className="text-gray-500 text-sm mt-1">Our system is locating a verified collector near you.</p>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mt-6 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Ticket ID</span>
                  <span className="font-black text-gray-900 font-mono">{bookedReceipt.id}</span>
                </div>
                {bookedReceipt.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm border-t border-dashed border-gray-200 pt-2">
                    <span className="text-gray-600 truncate max-w-[200px]">{item.name}</span>
                    <span className="font-mono text-gray-700 text-xs">{item.weight}{item.unit} × ₹{item.rate}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm border-t border-dashed border-gray-200 pt-2">
                  <span className="text-gray-500 font-semibold">Estimated Payout</span>
                  <span className="font-black text-brand-green-600 text-base font-mono">₹{bookedReceipt.payout.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-xs text-gray-400 border-t border-dashed border-gray-200 pt-2 font-mono">{bookedReceipt.addressStr}</div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-xs font-bold">
                <div className="bg-brand-green-100 text-brand-green-700 rounded-xl p-2">✓ Booked</div>
                <div className="bg-gray-100 text-gray-400 rounded-xl p-2">⏳ Dispatch</div>
                <div className="bg-gray-100 text-gray-400 rounded-xl p-2">⚖️ Weigh & Pay</div>
              </div>

              <button
                onClick={() => setBookedReceipt(null)}
                className="mt-6 w-full py-3 bg-brand-green-600 text-white font-black text-sm rounded-xl hover:bg-brand-green-700 transition-all"
              >
                Book Another Pickup
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Category + Items */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                <h3 className="font-black text-gray-900 text-lg mb-1 font-display">Step 1: Choose Scrap Category</h3>
                <p className="text-gray-400 text-xs mb-5">Select the type of scrap you want to sell</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SEED_CATEGORIES.map(cat => {
                    const isSelected = bookCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setBookCategory(cat.id)}
                        className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? "bg-brand-green-50 border-brand-green-400 ring-2 ring-brand-green-100 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:border-brand-green-200 hover:bg-brand-green-50/40"
                        }`}
                      >
                        <span className="text-2xl">{getCategoryEmoji(cat.id)}</span>
                        <span className={`text-[11px] font-black leading-tight ${isSelected ? "text-brand-green-700" : "text-gray-600"}`}>
                          {cat.category_name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Items grid */}
                <div className="mt-7">
                  <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-3">
                    Step 2: Add items to your pickup basket
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SCRAP_OBJECTS.filter(obj => obj.category_id === bookCategory).map(obj => {
                      const basketItem = basketItems.find(item => item.id === obj.id);
                      const isSelectedObj = !!basketItem;
                      return (
                        <div
                          key={obj.id}
                          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                            isSelectedObj
                              ? "bg-brand-green-50 border-brand-green-300 shadow-sm"
                              : "bg-white border-gray-200 hover:border-brand-green-200"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                              isSelectedObj ? "bg-brand-green-100" : "bg-gray-100"
                            }`}>
                              {getCategoryEmoji(obj.category_id)}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-gray-800 block truncate">{obj.name}</span>
                              <span className="text-[11px] text-brand-green-600 font-mono font-bold">
                                ₹{obj.rate}/{obj.unit}
                                {isSelectedObj && basketItem && (
                                  <span className="text-gray-400 font-sans ml-1.5">→ ₹{obj.rate * basketItem.weight}</span>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {isSelectedObj && basketItem ? (
                              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                <button type="button" onClick={() => handleUpdateBasketItemWeight(obj.id, basketItem.weight - (obj.unit === "kg" ? 5 : 1))}
                                  className="p-1 text-gray-400 hover:text-brand-green-600 rounded transition active:scale-90">
                                  <Minus size={11} />
                                </button>
                                <div className="flex items-center gap-0.5 px-1 min-w-[42px] justify-center text-[11px] font-black text-gray-800 font-mono">
                                  <span>{basketItem.weight}</span>
                                  <span className="text-[8px] text-gray-400">{obj.unit}</span>
                                </div>
                                <button type="button" onClick={() => handleUpdateBasketItemWeight(obj.id, basketItem.weight + (obj.unit === "kg" ? 5 : 1))}
                                  className="p-1 text-gray-400 hover:text-brand-green-600 rounded transition active:scale-90">
                                  <Plus size={11} />
                                </button>
                                <button type="button" onClick={() => handleToggleBasketItem(obj.id)}
                                  className="p-1 text-gray-300 hover:text-red-400 transition ml-1">
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            ) : (
                              <button type="button" onClick={() => handleToggleBasketItem(obj.id)}
                                className="px-3 py-1.5 bg-brand-green-600 hover:bg-brand-green-700 text-white text-[10px] font-black rounded-lg transition cursor-pointer flex items-center gap-1">
                                <Plus size={10} /> Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Basket summary */}
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                      <ShoppingBag size={13} className="text-brand-green-600" />
                      Active Basket ({basketItems.length} items)
                    </span>
                  </div>
                  {basketItems.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center py-4">No items added yet. Tap "Add" above.</p>
                  ) : (
                    <div className="space-y-2">
                      {basketItems.map(item => {
                        const obj = SCRAP_OBJECTS.find(o => o.id === item.id);
                        if (!obj) return null;
                        return (
                          <div key={item.id} className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2">
                              <span>{getCategoryEmoji(obj.category_id)}</span>
                              <div>
                                <span className="font-bold text-gray-700 block">{obj.name}</span>
                                <span className="text-gray-400 font-mono">{item.weight}{obj.unit} × ₹{obj.rate}</span>
                              </div>
                            </div>
                            <span className="font-black text-brand-green-600 font-mono">₹{(obj.rate * item.weight).toLocaleString("en-IN")}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Address form */}
                <form id="booking-form" onSubmit={handleProceedBooking} className="mt-7 space-y-4">
                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                      Step 3: Your Pickup Address
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Street Address</label>
                        <input type="text" placeholder="Flat no, Building, Area..." value={bookAddress}
                          onChange={e => setBookAddress(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 transition-all" />
                        {formErrors.address && <p className="text-[11px] text-red-500 font-bold mt-1">⚠️ {formErrors.address}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">PIN Code</label>
                        <input type="text" maxLength={6} placeholder="6-digit PIN" value={bookPincode}
                          onChange={e => setBookPincode(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-800 placeholder:text-gray-400 transition-all" />
                        {formErrors.pincode && <p className="text-[11px] text-red-500 font-bold mt-1">⚠️ {formErrors.pincode}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">City</label>
                        <input type="text" value={bookCity} onChange={e => setBookCity(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">State</label>
                        <select value={bookState} onChange={e => setBookState(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 cursor-pointer">
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Notes (Optional)</label>
                      <textarea rows={2} value={bookDescription} onChange={e => setBookDescription(e.target.value)}
                        placeholder="E.g. 'Old newspaper stacked near the door, dry and packed...'"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400" />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl shadow-lg shadow-brand-green-100 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    🚀 Schedule Doorstep Pickup
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    No payment required upfront. You get paid when we collect.
                  </p>
                </form>
              </div>

              {/* Right: Payout Estimator */}
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
                <div className="bg-white rounded-2xl border-2 border-brand-green-200 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-green-500 rounded-l-2xl" />
                  <span className="inline-block bg-brand-green-100 text-brand-green-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ml-1">
                    Live Payout Estimator
                  </span>
                  <h3 className="text-lg font-black text-gray-900 font-display ml-1">Your Basket Value</h3>

                  <div className="mt-5 bg-gray-50 rounded-xl border border-gray-100 p-3 space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                    {basketItems.length === 0 ? (
                      <p className="text-center text-xs text-gray-400 py-4 italic">Add items from the left to see estimate</p>
                    ) : basketItems.map(item => {
                      const obj = SCRAP_OBJECTS.find(o => o.id === item.id);
                      if (!obj) return null;
                      return (
                        <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-gray-100">
                          <div>
                            <span className="font-bold text-gray-800 block">{obj.name}</span>
                            <span className="text-gray-400 font-mono">{item.weight} {obj.unit} × ₹{obj.rate}</span>
                          </div>
                          <span className="font-black text-brand-green-600 font-mono">₹{(obj.rate * item.weight).toLocaleString("en-IN")}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 bg-gradient-to-br from-brand-green-50 to-brand-green-100 border border-brand-green-200 rounded-xl p-5 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Estimated Cash Payout</p>
                    <div className="flex items-baseline justify-center gap-1 mt-2">
                      <span className="text-brand-green-600 text-xl font-bold">₹</span>
                      <span className="text-3xl font-black text-gray-900 font-mono">{calculatedPayout.toLocaleString("en-IN")}</span>
                      <span className="text-brand-green-600 text-sm font-bold ml-1">INR</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5">Settled instantly before collector leaves</p>
                  </div>

                  <a href="#booking-form"
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer">
                    Proceed to Schedule
                    <ArrowRight size={14} />
                  </a>
                </div>

                {/* How it works mini */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider flex items-center gap-1.5 mb-3">
                    <Info size={11} className="text-brand-green-500" /> How It Works
                  </p>
                  <div className="space-y-3">
                    {["Certified collection dispatched in under 2 hours.", "Payment on the spot — cash or UPI, before we leave.", "Zero charges for pickup, weighing, or assessment."].map((text, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="w-5 h-5 bg-brand-green-100 text-brand-green-700 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</span>
                        <p>{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AUTH OVERLAY */}
      {showAuthOverlay && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative animate-zoom-in">
            <button onClick={() => setShowAuthOverlay(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
              <X size={16} />
            </button>
            <div className="w-10 h-10 bg-brand-green-100 rounded-xl flex items-center justify-center mb-4">
              <Recycle size={20} className="text-brand-green-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 font-display">Let's Secure Your Booking</h3>
            <p className="text-sm text-gray-500 mt-1">We need your contact to dispatch our local collector.</p>

            {authFormError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold mt-4 flex items-center gap-2">
                <AlertCircle size={14} /> {authFormError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input type="text" placeholder="e.g. Aarav Sharma" value={authFormName} onChange={e => setAuthFormName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input type="text" maxLength={10} placeholder="10-digit number" value={authFormPhone} onChange={e => setAuthFormPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-gray-800 placeholder:text-gray-400" />
                </div>
              </div>
              <button type="submit"
                className="w-full py-3.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2">
                Continue & Schedule Pickup <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO UPLOAD MODAL */}
      {showOptionalPhotoStep && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative animate-zoom-in">
            <button onClick={() => setShowOptionalPhotoStep(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full transition">
              <X size={16} />
            </button>
            <span className="inline-block bg-brand-green-100 text-brand-green-700 text-[10px] font-black px-3 py-1 rounded-full mb-3">
              Optional Step
            </span>
            <h3 className="text-xl font-black text-gray-900 font-display">Add Photos of Your Scrap</h3>
            <p className="text-sm text-gray-500 mt-1">Helps collectors bring the right vehicle. You can skip this.</p>

            <div
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files) appendUploadedFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mt-5 flex flex-col items-center ${
                isDragOver ? "border-brand-green-400 bg-brand-green-50" : "border-gray-200 bg-gray-50 hover:border-brand-green-300 hover:bg-brand-green-50/40"
              }`}
            >
              <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={e => { if (e.target.files) appendUploadedFiles(e.target.files); }} className="hidden" />
              <Camera size={32} className="text-gray-300 mb-2" />
              <span className="text-sm font-bold text-gray-600">Drag & drop or click to upload</span>
              <span className="text-xs text-gray-400 mt-1">Up to 5 images • Helps size our pickup truck</span>
            </div>

            {postAuthImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {postAuthImages.map((b64, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-square border border-gray-200">
                    <img src={b64} alt="attachment" className="w-full h-full object-cover" />
                    <button onClick={e => { e.stopPropagation(); setPostAuthImages(prev => prev.filter((_, i) => i !== idx)); }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => { setPostAuthImages([]); handleFinalBookingSubmit(); }}
                className="py-3.5 border-2 border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                Skip & Schedule
              </button>
              <button onClick={handleFinalBookingSubmit}
                className="py-3.5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md">
                {postAuthImages.length > 0 ? `Schedule with ${postAuthImages.length} Photo${postAuthImages.length > 1 ? "s" : ""}` : "Schedule Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
