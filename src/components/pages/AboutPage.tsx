import React from "react";
import { Link } from "react-router-dom";
import {
  Recycle, Target, Settings, ShieldCheck, TrendingUp, Leaf, Heart,
  CheckCircle, Mail, Phone, MapPin, ArrowRight, Users, Building2,
  Clock, Calendar, Truck, Globe, Zap, Scale, Cpu, FileText, Smartphone
} from "lucide-react";

export function AboutPage() {
  const teamStats = [
    { value: "28+", label: "Active Collectors", icon: <Users size={20} className="text-emerald-400" /> },
    { value: "10+", label: "Cities Covered", icon: <MapPin size={20} className="text-emerald-400" /> },
    { value: "85K+", label: "KGs Recycled", icon: <Recycle size={20} className="text-emerald-400" /> },
    { value: "2026", label: "Founded", icon: <Building2 size={20} className="text-emerald-400" /> },
  ];

  const categories = [
    { icon: <FileText size={28} />, label: "Paper & Cardboard" },
    { icon: <Recycle size={28} />, label: "Plastic Waste" },
    { icon: <Settings size={28} />, label: "Metal Scrap" },
    { icon: <Cpu size={28} />, label: "E-Waste" },
  ];

  const coreValues = [
    { icon: <Globe size={24} />, title: "Environmental Responsibility", desc: "Building a circular economy by minimizing waste and maximizing reuse." },
    { icon: <ShieldCheck size={24} />, title: "Trust & Reliability", desc: "Every interaction is built on transparency and absolute professionalism." },
    { icon: <Scale size={24} />, title: "Fair Pricing", desc: "We guarantee competitive, real-time rates for every category of scrap." },
    { icon: <Zap size={24} />, title: "Technological Innovation", desc: "Leveraging modern tools and automation for a best-in-class experience." },
  ];

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-gray-100 selection:bg-emerald-500/30">

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 text-center overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-emerald-600/10 rounded-full -translate-y-1/2 blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="max-w-3xl mx-auto relative animate-fade-in-up z-10">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <img src="/logo.svg" alt="wastEdge Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white font-display tracking-tight leading-tight mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-sm">wastEdge</span>
          </h1>
          <p className="text-gray-400 mt-4 text-lg md:text-xl leading-relaxed font-medium">
            Your trusted partner for hassle-free scrap collection and sustainable recycling solutions.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white/[0.02] border-b border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-900/10 to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          {teamStats.map((stat) => (
            <div key={stat.label} className="p-6 bg-[#0a0a0a] rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all hover:-translate-y-1">
              <div className="flex justify-center mb-3 bg-emerald-500/5 w-12 h-12 mx-auto rounded-xl items-center">{stat.icon}</div>
              <div className="text-3xl font-black font-mono text-white mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/50 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-400 mb-6">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white font-display leading-[1.15]">
              Technology-Driven <br/> Waste Management
            </h2>
            <div className="mt-8 space-y-6">
              <p className="text-gray-400 leading-relaxed text-lg">
                wastEdge is a modern platform that connects individuals and businesses with verified scrap collectors. Our mission is to make recycling effortless, highly transparent, and environmentally impactful.
              </p>
              <p className="text-gray-400 leading-relaxed text-lg">
                Whether it's your old newspapers, obsolete electronics, heavy metals, or plastics — we ensure everything is processed responsibly and kept out of landfills.
              </p>
            </div>
            
            <Link to="/book"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold rounded-xl transition-all">
              Start Recycling Today <ArrowRight size={16} className="text-emerald-400" />
            </Link>
          </div>
          
          {/* Glass Category Grid */}
          <div className="grid grid-cols-2 gap-4">
            {categories.map((item, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 text-center hover:bg-[#111] hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="inline-flex p-4 rounded-2xl bg-white/5 text-gray-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors mb-4">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white font-display mb-4">Our Core <span className="text-emerald-400">Values</span></h2>
            <p className="text-gray-400">The principles that drive everything we do.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div key={idx} className="p-8 bg-[#111] border border-white/5 rounded-3xl hover:border-emerald-500/30 transition-colors relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                <div className="text-emerald-400 mb-6 bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
