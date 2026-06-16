import React from "react";
import { Link } from "react-router-dom";
import { Recycle, Phone, MapPin, Mail, ArrowRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { emoji: "📰", label: "Paper & Cardboard", to: "/rates" },
    { emoji: "🥤", label: "Plastic Waste", to: "/rates" },
    { emoji: "⚙️", label: "Metal Scrap", to: "/rates" },
    { emoji: "💻", label: "E-Waste & Electronics", to: "/rates" },
    { emoji: "🏠", label: "Household Appliances", to: "/rates" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-brand-green-700 to-brand-green-600 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white font-display">
            Let's fix the environment together. 🌱
          </h2>
          <p className="text-brand-green-100 mt-2 text-sm">
            Schedule your first pickup today. Customer Support Available 8:30AM – 7:30PM
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand-green-700 font-black text-sm rounded-xl shadow-lg hover:bg-brand-green-50 transition-all active:scale-95"
            >
              <Recycle size={16} />
              Schedule a Pickup
              <ArrowRight size={14} />
            </Link>
            <a
              href="tel:+918800000000"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/40 text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-all"
            >
              <Phone size={16} />
              Call Us Now
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-green-600 rounded-xl flex items-center justify-center">
              <Recycle size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-white text-lg font-display">
              wastEdge<span className="text-brand-green-400">Solution</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            India's trusted platform for doorstep scrap collection. Fair prices. Certified collectors. Instant payment.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-gray-400">
              <MapPin size={13} className="mt-0.5 shrink-0 text-brand-green-500" />
              <span>Okhla Industrial Estate, Phase 1, New Delhi – 110020</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Phone size={13} className="shrink-0 text-brand-green-500" />
              <span>+91 88000 00000</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail size={13} className="shrink-0 text-brand-green-500" />
              <span>info@wastedge.in</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/rates", label: "Scrap Rates" },
            { to: "/terms", label: "Terms of Service" },
            { to: "/register", label: "Sell Scrap" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block text-sm text-gray-400 hover:text-brand-green-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">What We Pick</h4>
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-green-400 transition-colors"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>

        {/* Compliance */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Compliance & Safety</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <p>✦ ISO 9001 Certified Weighments</p>
            <p>✦ Government-Verified Collectors</p>
            <p>✦ Green-Trace Recycling Audits</p>
            <p>✦ Zero Environmental Spillover</p>
          </div>
          <div className="mt-4 p-3 bg-brand-green-900/30 border border-brand-green-800/40 rounded-xl">
            <p className="text-[11px] text-brand-green-400 font-semibold leading-relaxed">
              🌿 Every kg recycled reduces CO₂ emissions and keeps landfills cleaner for future generations.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {currentYear} wastEdge Solution India Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/terms" className="hover:text-brand-green-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand-green-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
