import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, TrendingDown, Minus, ArrowRight, Info, CheckCircle } from "lucide-react";

interface RateItem {
  id: string;
  name: string;
  rate: number;
  unit: "kg" | "unit";
  category: string;
  note?: string;
  popular?: boolean;
}

const RATE_CATEGORIES = [
  { id: "normal", label: "Normal Recyclables", emoji: "♻️" },
  { id: "appliances_large", label: "Large Appliances", emoji: "🏠" },
  { id: "appliances_small", label: "Small Appliances", emoji: "⚡" },
  { id: "it_ewaste", label: "IT & E-Waste", emoji: "💻" },
  { id: "vehicles", label: "Vehicle Scrap", emoji: "🚗" },
];

const ALL_RATES: RateItem[] = [
  // Normal Recyclables
  { id: "newspaper", name: "Newspaper", rate: 15, unit: "kg", category: "normal", popular: true },
  { id: "office_paper", name: "Office Paper (A3/A4)", rate: 14, unit: "kg", category: "normal", popular: true },
  { id: "books", name: "Books", rate: 12, unit: "kg", category: "normal", popular: true },
  { id: "cardboard", name: "Cardboard", rate: 8, unit: "kg", category: "normal" },
  { id: "plastic", name: "Plastic", rate: 8, unit: "kg", category: "normal", popular: true },
  { id: "iron", name: "Iron", rate: 25, unit: "kg", category: "normal" },
  { id: "steel", name: "Steel", rate: 42, unit: "kg", category: "normal" },
  { id: "aluminium_can", name: "Aluminium Can", rate: 40, unit: "kg", category: "normal" },
  { id: "aluminium", name: "Aluminium", rate: 112, unit: "kg", category: "normal" },
  { id: "brass", name: "Brass", rate: 325, unit: "kg", category: "normal" },
  { id: "copper", name: "Copper", rate: 505, unit: "kg", category: "normal" },
  { id: "glass", name: "Glass", rate: 2, unit: "kg", category: "normal", note: "Picked only with other items" },
  { id: "clothes", name: "Clothes", rate: 5, unit: "kg", category: "normal", note: "Picked only with other items" },

  // Large Appliances
  { id: "ac_2ton", name: "Window/Split AC (2 Ton)", rate: 5600, unit: "unit", category: "appliances_large" },
  { id: "ac_1_5ton", name: "Window/Split AC (1.5 Ton)", rate: 4500, unit: "unit", category: "appliances_large", popular: true },
  { id: "ac_1ton", name: "Window/Split AC (1 Ton)", rate: 3500, unit: "unit", category: "appliances_large" },
  { id: "fridge_sidebyside", name: "Side by Side Fridge", rate: 2700, unit: "unit", category: "appliances_large" },
  { id: "fridge_double", name: "Double Door Fridge", rate: 1350, unit: "unit", category: "appliances_large", popular: true },
  { id: "fridge_single", name: "Single Door Fridge", rate: 1100, unit: "unit", category: "appliances_large" },
  { id: "washing_front", name: "Fully Automatic Washing Machine (Front Load)", rate: 1350, unit: "unit", category: "appliances_large" },
  { id: "washing_top", name: "Fully Automatic Washing Machine (Top Load)", rate: 1000, unit: "unit", category: "appliances_large" },
  { id: "washing_semi", name: "Semi Automatic Washing Machine", rate: 800, unit: "unit", category: "appliances_large" },
  { id: "microwave", name: "Microwave", rate: 350, unit: "unit", category: "appliances_large" },

  // Small Appliances
  { id: "motor_fan", name: "Metal Appliances Medium (Motor/Ceiling Fan)", rate: 35, unit: "kg", category: "appliances_small" },
  { id: "metal_light", name: "Metal Appliances Light (DVD/VCR/Iron/Chimney)", rate: 20, unit: "kg", category: "appliances_small" },
  { id: "iron_cooler", name: "Iron Cooler with Motor", rate: 24, unit: "kg", category: "appliances_small" },
  { id: "plastic_appliances", name: "Plastic Appliances (Cooler/Mixer/Induction)", rate: 15, unit: "kg", category: "appliances_small" },
  { id: "geyser", name: "Geyser", rate: 20, unit: "kg", category: "appliances_small" },
  { id: "stabiliser", name: "Metal Appliances Heavy (Stabiliser/Inverter)", rate: 40, unit: "kg", category: "appliances_small" },
  { id: "ups", name: "UPS", rate: 180, unit: "unit", category: "appliances_small" },
  { id: "gym", name: "Gym Equipment", rate: 20, unit: "kg", category: "appliances_small" },
  { id: "battery_inverter", name: "Battery (Used with Inverters)", rate: 81, unit: "kg", category: "appliances_small", popular: true },

  // IT & E-Waste
  { id: "laptop", name: "Laptop", rate: 500, unit: "unit", category: "it_ewaste", popular: true },
  { id: "computer_cpu", name: "Computer CPU", rate: 400, unit: "unit", category: "it_ewaste" },
  { id: "printer", name: "Printer/Scanner/LCD TV/LED TV", rate: 20, unit: "kg", category: "it_ewaste" },
  { id: "crt_monitor", name: "CRT Monitor", rate: 150, unit: "unit", category: "it_ewaste" },
  { id: "crt_tv", name: "CRT TV", rate: 200, unit: "unit", category: "it_ewaste" },
  { id: "tablet", name: "Tablet", rate: 40, unit: "unit", category: "it_ewaste" },

  // Vehicles
  { id: "scooty", name: "Scooty / Scooter", rate: 1800, unit: "unit", category: "vehicles" },
  { id: "bike", name: "Bike", rate: 2500, unit: "unit", category: "vehicles", popular: true },
  { id: "car", name: "Car", rate: 20000, unit: "unit", category: "vehicles" },
];

export function RatesPage() {
  const [activeCat, setActiveCat] = useState("normal");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRates = ALL_RATES.filter(r => {
    const matchCat = activeCat === "all" || r.category === activeCat;
    const matchSearch = !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const displayRates = searchQuery
    ? ALL_RATES.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : filteredRates;

  const catEmoji: Record<string, string> = {
    normal: "♻️", appliances_large: "🏠", appliances_small: "⚡",
    it_ewaste: "💻", vehicles: "🚗",
  };

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-gray-100 selection:bg-emerald-500/30">
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-emerald-600/10 rounded-full -translate-y-1/2 blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="max-w-2xl mx-auto relative animate-fade-in-up z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white font-display tracking-tight leading-tight">
            Live Scrap <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-sm">Rates</span>
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Transparent, real-time pricing for all categories of scrap. No hidden fees.
          </p>

          <div className="mt-8 relative max-w-md mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
            </div>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium shadow-lg"
              placeholder="Search for newspaper, AC, laptop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Category Tabs */}
        {!searchQuery && (
          <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 pb-2">
            <button
              onClick={() => setActiveCat("all")}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${
                activeCat === "all"
                  ? "bg-emerald-500 text-gray-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              All Rates
            </button>
            {RATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
                  activeCat === cat.id
                    ? "bg-emerald-500 text-gray-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white font-display">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : activeCat === "all" ? "All Current Rates" : RATE_CATEGORIES.find(c => c.id === activeCat)?.label}
            <span className="text-gray-500 font-medium ml-2 text-sm">({displayRates.length} items)</span>
          </h2>
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span className="flex items-center gap-1"><TrendingUp size={14} className="text-emerald-400" /> High Demand</span>
            <span className="flex items-center gap-1"><Minus size={14} className="text-gray-400" /> Stable</span>
          </div>
        </div>

        {/* Rates Grid */}
        {displayRates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayRates.map((item) => (
              <div key={item.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 hover:bg-[#111] transition-all relative group overflow-hidden">
                {item.popular && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-gray-950 text-[10px] font-black px-2 py-1 rounded-bl-xl tracking-wider uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    Popular
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl opacity-80">{catEmoji[item.category] || "📦"}</span>
                    <h3 className="font-bold text-white leading-tight">{item.name}</h3>
                  </div>
                </div>

                <div className="flex items-end gap-1 mt-4">
                  <span className="text-2xl font-black text-emerald-400 font-mono leading-none">₹{item.rate}</span>
                  <span className="text-gray-500 text-sm font-semibold mb-0.5">/ {item.unit}</span>
                </div>

                {item.note && (
                  <div className="mt-4 flex items-start gap-1.5 text-xs text-amber-500/80 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>{item.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#0a0a0a] border border-white/5 rounded-2xl">
            <div className="text-4xl mb-4 opacity-50">🔍</div>
            <h3 className="text-lg font-bold text-white mb-2">No items found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              We couldn't find any scrap items matching your search. Try different keywords or browse categories.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCat("all"); }}
              className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-emerald-950/40 to-[#050505] border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none mix-blend-screen" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white font-display mb-2">Ready to sell your scrap?</h3>
            <p className="text-emerald-400/80 max-w-md text-sm leading-relaxed">
              Our rates are updated regularly based on market conditions. Schedule a pickup today to lock in the current prices.
            </p>
          </div>
          <Link
            to="/book"
            className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-gray-950 font-black text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:scale-105 transition-all"
          >
            Schedule a Pickup
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
