import React from "react";
import { Link } from "react-router-dom";
import {
  Recycle, Truck, Wallet, ShieldCheck, ArrowRight,
  TrendingUp, Sparkles, Star, ChevronRight, CheckCircle, Clock
} from "lucide-react";
import { SCRAP_OBJECTS } from "../../data";

export function HomePage() {
  const stats = [
    { label: "Recycled Volume", value: "85,420+", unit: "kg", color: "text-emerald-400", icon: "♻️" },
    { label: "Settled Payouts", value: "₹18.4L", unit: "paid out", color: "text-emerald-500", icon: "💰" },
    { label: "Dispatch Response", value: "< 2 hrs", unit: "avg arrival", color: "text-emerald-300", icon: "⚡" },
    { label: "CO₂ Reduced", value: "22.4T", unit: "certified", color: "text-emerald-400", icon: "🌱" },
  ];

  const steps = [
    { num: "01", title: "Schedule Pickup", desc: "Select scrap items & choose a convenient slot on our app." },
    { num: "02", title: "Smart Weighing", desc: "Our verified executive weighs your scrap using ISO digital scales." },
    { num: "03", title: "Instant Payout", desc: "Receive your payment via UPI or Cash before we even leave." }
  ];

  return (
    <div className="bg-[#050505] font-sans text-gray-100 min-h-screen selection:bg-emerald-500/30">
      
      {/* ═══════ HERO SECTION (DARK MODE) ═══════ */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-teal-600/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/50 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-400 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Next-Gen Tech-Enabled Scrap Collection
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[5rem] font-black text-white leading-[1.05] tracking-tight font-display">
              Recycling, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 drop-shadow-sm">
                Re-engineered.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto font-medium">
              Turn your household scrap into instant value. Experience <span className="text-gray-200">100% transparent pricing</span>, ISO-calibrated digital weighing, and lightning-fast doorstep pickups.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/book" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] shadow-lg group">
                Schedule a Pickup <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/rates" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:border-white/20">
                <TrendingUp size={18} className="text-emerald-400" /> Live Scrap Rates
              </Link>
            </div>

            {/* Trust Info */}
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Free Pickup</div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Instant UPI</div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> Verified Crew</div>
            </div>
          </div>
        </div>
      </section>



      {/* ═══════ HOW IT WORKS (TECH TIMELINE) ═══════ */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-4">Seamless <span className="text-emerald-400">Process</span></h2>
            <p className="text-gray-400">Three simple steps to digitize your scrap disposal.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-y-1/2 pointer-events-none"></div>
            
            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-[#111] border border-white/5 rounded-3xl p-8 hover:bg-[#151515] hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-500 text-gray-950 rounded-xl font-black font-mono flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] transform group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-white mt-4 mb-2">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SMART WEIGHING SECTION ═══════ */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-950/40 to-[#0a0a0a] rounded-[2.5rem] border border-emerald-900/30 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            
            <div className="z-10 max-w-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white font-display leading-[1.1] mb-6">
                Precision you can <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">trust.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Forget the old analog scales. Our collection fleet is equipped with <strong className="text-gray-200">IoT-enabled Digital Scales</strong> calibrated to ISO standards. You see exactly what we see. 100% accuracy, zero tampering.
              </p>
              <ul className="space-y-4">
                {["Bluetooth connected scales", "Automated app-sync for weight", "Government certified accuracy"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-emerald-400" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative w-full md:w-[45%] flex justify-center z-10">
              {/* Glassmorphic Tech Scale UI representation */}
              <div className="w-full max-w-sm rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-2xl shadow-emerald-900/20 transform hover:-translate-y-2 transition-transform duration-500">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">SYNCED</div>
                </div>
                
                <div className="bg-[#050505] rounded-2xl border border-white/5 p-6 mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-center">
                    <div className="text-gray-500 text-xs font-bold tracking-widest mb-2">LIVE WEIGHT</div>
                    <div className="text-5xl font-black text-white font-mono flex items-baseline justify-center gap-2">
                      84.50 <span className="text-xl text-emerald-500">KG</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400">Material</span>
                    <span className="text-white font-medium">Copper Wire (Cu)</span>
                  </div>
                  <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-emerald-500/20">
                    <span className="text-gray-400">Total Value</span>
                    <span className="text-emerald-400 font-bold font-mono">₹42,672.50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA / STATS FOOTER ═══════ */}
      <section className="py-24 px-4 bg-emerald-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#0f0f0f] rounded-2xl p-6 text-center border border-white/5 hover:border-emerald-500/20 transition-colors">
                <div className={`text-2xl font-black font-mono mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-6">Ready to clear the clutter?</h2>
            <Link to="/book" className="inline-flex items-center gap-2 bg-white text-gray-950 font-black px-8 py-4 rounded-2xl hover:bg-gray-200 transition-colors">
              Book a Pickup Now <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
