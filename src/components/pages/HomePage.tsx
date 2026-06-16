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

export function HomePage() {
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
    <div className="bg-white font-sans">

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="hero-gradient pt-24 md:pt-28 pb-16 md:pb-20 px-4 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green-100/60 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green-200/40 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-brand-green-100 border border-brand-green-200 px-4 py-1.5 rounded-full text-xs font-bold text-brand-green-700 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green-500"></span>
              </span>
              India's ISO-Certified Scrap Collection Network
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] font-display">
              Sell Recyclables{" "}
              <span className="text-gradient-green">Online!</span>
            </h1>

            <p className="text-lg md:text-xl font-bold text-brand-green-700 mt-4">
              Schedule → We Collect → You Get Paid Instantly
            </p>

            <p className="text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
              Zero hidden charges. Direct-market rates. Certified agents weigh your scrap on{" "}
              <strong className="text-gray-700">ISO-calibrated digital scales</strong> for instant payment.
            </p>

            <div className="mt-16 max-w-2xl mx-auto text-center relative animate-fade-in-up" style={{animationDelay: '0.2s'}}>
               <div className="absolute left-1/2 -translate-x-1/2 -top-[14px] bg-white px-4 text-[#025a3c] font-black text-xl z-20 whitespace-nowrap">
                Schedule a pickup
               </div>

               <div className="rounded-full border border-brand-green-200 p-[3px]">
                 <div className="rounded-full border-4 border-brand-green-100 p-1.5">
                   <div className="bg-[#86efac] rounded-full p-2 relative shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                     <div className="bg-white rounded-full flex items-center p-1.5 h-16 shadow-inner">
                        <span className="pl-4 pr-3 text-gray-400 font-medium text-lg border-r border-gray-200">+91</span>
                        <input 
                          type="text" 
                          maxLength={10}
                          placeholder="Enter mobile number" 
                          className="flex-1 bg-transparent px-4 outline-none text-gray-800 placeholder:text-gray-400 font-semibold w-full text-lg"
                        />
                        <Link to="/login" className="w-12 h-12 bg-[#025a3c] rounded-full flex items-center justify-center text-white hover:bg-[#01412b] transition-all shadow-md shrink-0 active:scale-95">
                          <ArrowRight size={22} />
                        </Link>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="absolute left-1/2 -translate-x-1/2 -bottom-[12px] bg-white border border-yellow-400 rounded-full px-4 py-1 flex items-center gap-1.5 z-20 shadow-sm text-xs font-bold text-yellow-500 whitespace-nowrap">
                 <Star size={12} className="fill-yellow-400 text-yellow-400" /> 4.7 | 804k Users
               </div>
            </div>

            <div className="mt-8 text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
                or Download the App &gt;
              </Link>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 text-xs">
              {[
                { icon: <ShieldCheck size={13} />, text: "Verified Collectors" },
                { icon: <Coins size={13} />, text: "UPI & Cash Payment" },
                { icon: <Truck size={13} />, text: "Free Doorstep Service" },
                { icon: <Sparkles size={13} />, text: "Instant Payout" },
              ].map((pill) => (
                <div key={pill.text} className="flex items-center gap-1.5 bg-white border border-brand-green-100 px-3.5 py-2 rounded-full font-semibold text-gray-600 shadow-sm">
                  <span className="text-brand-green-600">{pill.icon}</span>
                  {pill.text}
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 card-lift">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-xl font-black font-mono ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WEIGHING ACCURACY BANNER ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-8 mb-16">
        <div className="bg-[#bbf7d0] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-sm">
          <div className="z-10 max-w-lg">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-brand-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-200 p-0.5">
              <div className="w-full h-full bg-white/20 backdrop-blur flex items-center justify-center rounded-xl border border-white/40">
                <Sparkles className="text-white" size={24} />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#025a3c] font-display leading-[1.1] mb-4">
              100% weighing <br className="hidden md:block" /> accuracy guaranteed
            </h2>
            <p className="text-[#025a3c]/80 text-lg font-medium">
              Powered by wastEdge's Smart Digital Weighing Scales
            </p>
          </div>
          
          <div className="relative w-full md:w-1/2 flex justify-center z-10 mt-12 md:mt-0">
            {/* The scale graphic */}
            <div className="relative bg-[#2d3748] rounded-3xl w-full max-w-[280px] aspect-[4/3] shadow-2xl border-b-[12px] border-[#1a202c] transform rotate-3 hover:rotate-0 transition-transform duration-500">
               {/* Pattern on top of scale */}
               <div className="absolute inset-4 rounded-2xl border border-gray-700 opacity-30" style={{ backgroundImage: 'radial-gradient(#4a5568 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
               
               {/* Display screen */}
               <div className="absolute bottom-4 right-4 bg-[#111] rounded-lg p-2.5 border-2 border-[#4a5568] flex items-center gap-3">
                 <div className="bg-yellow-500 rounded-[3px] w-5 h-5 flex items-center justify-center shadow-inner"><span className="text-[10px] font-black text-white">Δ</span></div>
                 <div className="bg-[#0f3b1b] text-[#4ade80] font-mono text-2xl font-black rounded-md px-3 py-0.5 tracking-widest border border-[#22c55e]/30 shadow-[0_0_15px_rgba(74,222,128,0.2)_inset]">
                   88.88
                 </div>
               </div>
               
               {/* Items on scale (Emojis for visual) */}
               <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-end gap-2 drop-shadow-2xl z-20">
                 <div className="text-7xl relative top-4">🍞</div>
                 <div className="text-[5.5rem] z-10 drop-shadow-xl">🚰</div>
                 <div className="text-6xl relative top-2">📰</div>
               </div>
               
               {/* Grass base glow */}
               <div className="absolute -bottom-10 -left-10 -right-10 h-16 bg-green-500/40 blur-2xl rounded-full -z-10" />
            </div>
          </div>
          
          {/* Background decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-brand-green-100 text-brand-green-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 font-display">
              Best Value in 3 Simple Steps
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              From scheduling to payment — the entire process takes under 2 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {howSteps.map((step, i) => (
              <div key={step.title} className="relative">
                {i < howSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-brand-green-200 to-brand-green-100 z-0 -translate-x-8" />
                )}
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm card-lift relative z-10">
                  <div className="w-16 h-16 bg-brand-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-brand-green-100">
                    {step.icon}
                  </div>
                  <div className="absolute top-4 right-4 w-7 h-7 bg-brand-green-600 text-white rounded-full flex items-center justify-center text-xs font-black">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 font-display">{step.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHAT WE RECYCLE ═══════ */}
      <section className="py-16 px-4 bg-brand-green-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 font-display mb-2">
            Recyclables We Pick
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Paper | Plastic | Metals | E-Waste | Appliances & More
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {recyclables.map((item) => (
              <Link
                to="/rates"
                key={item.label}
                className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl border border-brand-green-100 text-sm font-bold text-gray-700 hover:border-brand-green-400 hover:text-brand-green-700 hover:bg-brand-green-50 transition-all shadow-sm card-lift"
              >
                <span className="text-xl">{item.emoji}</span>
                {item.label}
                <ChevronRight size={14} className="text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOUSEHOLDS vs BUSINESSES ═══════ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 font-display">
              Households & Businesses Have
              <br />
              <span className="text-gradient-green">Different Needs</span> — We Cater to Both
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Households */}
            <div className="rounded-2xl p-8 border-2 border-brand-green-200 bg-brand-green-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-green-100/50 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="w-12 h-12 bg-brand-green-600 rounded-xl flex items-center justify-center mb-5">
                <HomeIcon size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 font-display mb-2">For Households</h3>
              <p className="text-gray-500 text-sm mb-6">Perfect for families & individuals with regular scrap</p>
              <ul className="space-y-3">
                {householdBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                    <div className="w-5 h-5 bg-brand-green-200 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={12} className="text-brand-green-700" />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
              <Link to="/book" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-green-600 text-white text-sm font-black rounded-xl shadow-md hover:bg-brand-green-700 transition-all">
                Book Household Pickup <ArrowRight size={14} />
              </Link>
            </div>

            {/* Businesses */}
            <div className="rounded-2xl p-8 border-2 border-gray-200 bg-gray-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-green-900/30 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="w-12 h-12 bg-brand-green-500 rounded-xl flex items-center justify-center mb-5">
                <Briefcase size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white font-display mb-2">For Businesses</h3>
              <p className="text-gray-400 text-sm mb-6">Ideal for offices, factories & commercial entities</p>
              <ul className="space-y-3">
                {businessBenefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm font-semibold text-gray-300">
                    <div className="w-5 h-5 bg-brand-green-800 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={12} className="text-brand-green-400" />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-green-500 text-white text-sm font-black rounded-xl shadow-md hover:bg-brand-green-400 transition-all">
                Contact for Business <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ GREEN HERO SPOTLIGHT ═══════ */}
      <section className="py-16 px-4 bg-gradient-to-br from-brand-green-700 to-brand-green-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black font-display">
              Also Loved by Millions of Green Heroes 💚
            </h2>
            <p className="text-brand-green-200 mt-2 text-sm">
              Contribute to making your environment vibrant and sustainable.
            </p>
          </div>

          {/* Green Hero of the Month */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-green-500/30 border border-brand-green-300/30 px-4 py-1.5 rounded-full text-xs font-black text-brand-green-100 mb-4">
              <Star size={12} className="fill-yellow-300 text-yellow-300" />
              Green Super Hero of the Month – June 2026
            </div>
            <div className="w-20 h-20 bg-brand-green-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl border-4 border-brand-green-400/30">
              🌱
            </div>
            <h3 className="text-lg font-black text-white font-display">Priya Sharma, Pune</h3>
            <p className="text-brand-green-200 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              Recycled over 450 kg of mixed scrap in a single month — earning ₹12,400 while helping reduce CO₂ by 2.1 tonnes!
            </p>
            <div className="flex justify-center gap-6 mt-5 text-center">
              {[{ v: "450 kg", l: "Recycled" }, { v: "₹12,400", l: "Earned" }, { v: "2.1T", l: "CO₂ Saved" }].map(s => (
                <div key={s.l}>
                  <div className="text-lg font-black text-white">{s.v}</div>
                  <div className="text-[11px] text-brand-green-300 font-semibold">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ MEDIA RECOGNITION ═══════ */}
      <section className="bg-gray-50 border-y border-gray-100 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">As seen in</p>
        </div>
        <div className="flex items-center overflow-hidden">
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {[...mediaLogos, ...mediaLogos].map((logo, i) => (
              <span key={i} className="text-gray-400 text-sm font-black tracking-wide uppercase shrink-0 hover:text-brand-green-600 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
