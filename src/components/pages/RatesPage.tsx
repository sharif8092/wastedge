import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, TrendingDown, Minus, ArrowRight, Info } from "lucide-react";

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
    <div className="bg-white min-h-screen font-sans pt-24 md:pt-28">
      {/* Hero */}
      <section className="hero-gradient py-16 px-4 text-center border-b border-brand-green-100">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-brand-green-100 border border-brand-green-200 px-4 py-1.5 rounded-full text-xs font-bold text-brand-green-700 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green-500"></span>
            </span>
            Prices Updated Hourly
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-display">
            Live <span className="text-gradient-green">Scrap Rates</span>
          </h1>
          <p className="text-gray-500 mt-3 leading-relaxed">
            Transparent, real-time market rates across all scrap categories.<br />
            No hidden fees. What you see is what you get paid.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Search + filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search e.g. Copper, Newspaper, AC..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Info size={13} className="text-brand-green-600" />
            <span>Rates shown are for <strong>Delhi NCR</strong>. Slight variations may apply in other cities.</span>
          </div>
        </div>

        {/* Category tabs */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-7">
            {RATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeCat === cat.id
                    ? "bg-brand-green-600 text-white shadow-md shadow-brand-green-200"
                    : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-brand-green-300 hover:text-brand-green-700"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Rates grid */}
        {displayRates.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-4xl">🔍</span>
            <h3 className="font-bold text-gray-700 mt-3">No items found</h3>
            <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayRates.map(item => (
              <div key={item.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-brand-green-200 hover:shadow-md transition-all group card-lift">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg">{catEmoji[item.category]}</span>
                  {item.popular && (
                    <span className="text-[9px] bg-brand-green-100 text-brand-green-700 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      🚀 Popular
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 text-sm leading-snug mt-2">{item.name}</h3>
                {item.note && (
                  <p className="text-[10px] text-brand-orange-500 font-semibold mt-1 italic">
                    * {item.note}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Rate</p>
                    <p className="font-black text-gray-900 text-lg font-mono">
                      ₹{item.rate.toLocaleString("en-IN")}
                      <span className="text-gray-400 text-xs font-normal">/{item.unit}</span>
                    </p>
                  </div>
                  <Link to="/register"
                    className="px-3 py-2 bg-brand-green-50 group-hover:bg-brand-green-600 border border-brand-green-200 group-hover:border-transparent text-brand-green-700 group-hover:text-white text-xs font-black rounded-xl transition-all flex items-center gap-1">
                    Sell <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-brand-green-50 border border-brand-green-100 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed">
          <p className="font-bold text-brand-green-700 mb-1">📌 Rate Disclaimer</p>
          <p>
            Prices listed are indicative market rates and may vary based on condition, quantity, and local market conditions.
            Final rates are confirmed at the time of weighing by our certified collector.
            Payment is made instantly on the spot before the collector leaves your premises.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-gray-50 text-center">
        <h2 className="text-2xl font-black text-gray-900 font-display">Ready to Sell Your Scrap?</h2>
        <p className="text-gray-500 mt-2 text-sm mb-6">Book a free doorstep pickup and get paid instantly.</p>
        <Link to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green-600 hover:bg-brand-green-700 text-white font-black text-sm rounded-xl shadow-lg shadow-brand-green-200 transition-all active:scale-95">
          Schedule My Pickup <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
