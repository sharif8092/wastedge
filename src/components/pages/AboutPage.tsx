import React from "react";
import { Link } from "react-router-dom";
import {
  Recycle, Target, Settings, ShieldCheck, TrendingUp, Leaf, Heart,
  CheckCircle, Mail, Phone, MapPin, ArrowRight, Users, Building2,
  Clock, Calendar, Truck
} from "lucide-react";

export function AboutPage() {
  const whatWeDo = [
    { icon: <Calendar size={22} className="text-brand-green-600" />, title: "Convenient Scheduling 📅", desc: "Book scrap pickups at your preferred time — anytime, anywhere." },
    { icon: <ShieldCheck size={22} className="text-brand-green-600" />, title: "Verified Collectors 🛡️", desc: "All collectors are vetted, trained, and equipped to provide professional service." },
    { icon: <TrendingUp size={22} className="text-brand-green-600" />, title: "Transparent Pricing 💰", desc: "Real-time rates based on scrap type and weight — no hidden costs." },
    { icon: <Leaf size={22} className="text-brand-green-600" />, title: "Sustainable Recycling ♻️", desc: "Reduce your carbon footprint by ensuring materials are properly recycled." },
    { icon: <Truck size={22} className="text-brand-green-600" />, title: "Door-to-Door Collection 🚛", desc: "No heavy lifting. We come to your doorstep with certified scales." },
  ];

  const coreValues = [
    { icon: "🌍", title: "Environmental Responsibility", desc: "We aim to build a circular economy by minimizing waste and maximizing reuse." },
    { icon: "🤝", title: "Trust & Reliability", desc: "Every interaction is built on transparency and professionalism." },
    { icon: "⚖️", title: "Fair Pricing", desc: "We guarantee competitive, real-time rates for every category of scrap." },
    { icon: "🚀", title: "Technological Innovation", desc: "We leverage modern tools and automation to deliver a best-in-class experience." },
  ];

  const teamStats = [
    { value: "28+", label: "Active Collectors", icon: <Users size={20} className="text-brand-green-600" /> },
    { value: "10+", label: "Cities Covered", icon: <MapPin size={20} className="text-brand-green-600" /> },
    { value: "85K+", label: "KGs Recycled", icon: <Recycle size={20} className="text-brand-green-600" /> },
    { value: "2026", label: "Founded", icon: <Building2 size={20} className="text-brand-green-600" /> },
  ];

  return (
    <div className="bg-white min-h-screen font-sans pt-24 md:pt-28">

      {/* Hero */}
      <section className="hero-gradient py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green-100/60 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto relative animate-fade-in-up">
          <div className="w-16 h-16 bg-brand-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green-200">
            <Recycle size={30} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-display">
            About <span className="text-gradient-green">wastEdge</span> ♻️
          </h1>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">
            Your trusted partner for hassle-free scrap collection and sustainable recycling solutions. 🌍
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-green-700 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {teamStats.map((stat) => (
            <div key={stat.label} className="text-white">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-2xl font-black font-mono">{stat.value}</div>
              <div className="text-brand-green-200 text-xs font-semibold mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-brand-green-100 text-brand-green-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Who We Are 👋
            </span>
            <h2 className="text-3xl font-black text-gray-900 font-display leading-tight">
              Technology-Driven Waste Management Platform
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              wastEdge is a technology-driven waste management platform that connects individuals and businesses with verified scrap collectors. Our mission is to make recycling easy, transparent, and environmentally impactful.
            </p>
            <p className="text-gray-500 mt-3 leading-relaxed">
              Whether it's your old newspapers 📰, electronics 💻, metals ⚙️, or plastics 🥤 — wastEdge ensures everything gets responsibly recycled and never ends up in landfills.
            </p>
            <Link to="/register"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-green-600 text-white font-bold text-sm rounded-xl shadow-md hover:bg-brand-green-700 transition-all">
              Start Recycling Today <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "📰", label: "Paper & Cardboard", color: "bg-yellow-50 border-yellow-100" },
              { emoji: "🥤", label: "Plastic Waste", color: "bg-blue-50 border-blue-100" },
              { emoji: "⚙️", label: "Metal Scrap", color: "bg-gray-50 border-gray-200" },
              { emoji: "💻", label: "E-Waste", color: "bg-purple-50 border-purple-100" },
            ].map((item) => (
              <div key={item.label} className={`p-5 rounded-2xl border text-center ${item.color} card-lift`}>
                <span className="text-3xl">{item.emoji}</span>
                <p className="text-sm font-bold text-gray-700 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 bg-brand-green-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-brand-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
            <Target size={26} className="text-white" />
          </div>
          <span className="inline-block bg-brand-green-200 text-brand-green-800 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Our Mission 🎯
          </span>
          <h2 className="text-3xl font-black text-gray-900 font-display">
            Simplifying Waste Disposal Through Innovation
          </h2>
          <p className="text-gray-600 mt-4 text-lg leading-relaxed max-w-xl mx-auto">
            To simplify waste disposal through innovation, ensuring fair returns and a greener planet 🌱 for future generations.
          </p>
          <blockquote className="mt-6 bg-white rounded-2xl p-5 border border-brand-green-200 text-brand-green-800 font-bold text-lg italic shadow-sm">
            "Recycling made simple. Rewards made fair." ⭐
          </blockquote>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-green-100 text-brand-green-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              What We Do 🧰
            </span>
            <h2 className="text-3xl font-black text-gray-900 font-display">
              Seamless Experience for Everyone
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeDo.map((item) => (
              <div key={item.title} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl card-lift">
                <div className="w-11 h-11 bg-brand-green-100 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-black text-gray-900 text-sm font-display">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-green-800 text-brand-green-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Our Core Values ❤️
            </span>
            <h2 className="text-3xl font-black text-white font-display">
              What Drives Us Every Day
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coreValues.map((val) => (
              <div key={val.title} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex items-start gap-4 card-lift">
                <div className="w-12 h-12 bg-brand-green-900/50 border border-brand-green-800 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {val.icon}
                </div>
                <div>
                  <h3 className="font-black text-white text-sm font-display">{val.title}</h3>
                  <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-brand-green-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-gray-900 font-display mb-3">
            Get in Touch 📞
          </h2>
          <p className="text-gray-500 mb-8">Have questions, feedback, or need assistance? We're here to help.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <Mail size={20} />, title: "Email Us", detail: "info@wastedge.in", href: "mailto:info@wastedge.in" },
              { icon: <Phone size={20} />, title: "Call Us", detail: "+91 98103 29454", href: "tel:+919810329454" },
              { icon: <MapPin size={20} />, title: "Our Office", detail: "Okhla, New Delhi – 110020", href: "#" },
            ].map((c) => (
              <a key={c.title} href={c.href}
                className="bg-white border border-brand-green-100 rounded-2xl p-5 text-center card-lift shadow-sm hover:border-brand-green-300 transition-all">
                <div className="w-10 h-10 bg-brand-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-brand-green-600">
                  {c.icon}
                </div>
                <h4 className="font-bold text-gray-800 text-sm">{c.title}</h4>
                <p className="text-brand-green-700 text-xs font-semibold mt-1">{c.detail}</p>
              </a>
            ))}
          </div>
          <p className="mt-10 text-gray-500 text-sm">
            wastEdge ♻️ – Making waste management simple, rewarding, and planet-friendly.{" "}
            <strong className="text-brand-green-700">Join us in building a cleaner tomorrow — one pickup at a time! ✨</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
