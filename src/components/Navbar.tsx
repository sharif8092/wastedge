import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Recycle, Menu, X, Phone, TrendingUp } from "lucide-react";
import { SCRAP_OBJECTS } from "../data";
interface NavbarProps {
  activeUser: { full_name: string; role: string } | null;
  onNavigateDashboard: () => void;
}

export function Navbar({ activeUser, onNavigateDashboard }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/rates", label: "Scrap Rates" },
    { to: "/terms", label: "Terms" },
  ];

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md shadow-gray-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      {/* Live price ticker at the absolute top */}
      <div className="bg-brand-green-700 py-1.5 overflow-hidden">
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/20 px-2 py-0.5 rounded text-white text-[10px] font-black uppercase tracking-widest shrink-0 flex items-center gap-1">
            <TrendingUp size={10} />
            Live Prices
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex animate-marquee gap-6 whitespace-nowrap">
              {[...SCRAP_OBJECTS, ...SCRAP_OBJECTS].map((obj, i) => (
                <span key={i} className="text-white text-[10px] font-semibold inline-flex items-center gap-1.5 shrink-0">
                  <span className="text-brand-green-200 font-black">{obj.popular_label}</span>
                  <span className="font-mono font-bold">₹{obj.rate}/{obj.unit}</span>
                  <span className={`text-[9px] font-bold ${obj.market_trend === "up" ? "text-green-200" : obj.market_trend === "down" ? "text-red-200" : "text-gray-300"}`}>
                    {obj.market_trend === "up" ? "▲" : obj.market_trend === "down" ? "▼" : "●"} {obj.trend_value}
                  </span>
                  <span className="text-white/30 ml-1.5">|</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 select-none group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-brand-green-600 to-brand-green-500 rounded-xl flex items-center justify-center shadow-md shadow-brand-green-200 group-hover:scale-105 transition-transform">
              <Recycle size={18} className="text-white animate-spin-slow" />
            </div>
            <div className="leading-none">
              <span className="font-extrabold text-gray-900 text-lg font-display tracking-tight">
                wastEdge
                <span className="text-brand-green-600">Solution</span>
              </span>
              <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest font-bold mt-0.5">
                Recycling Made Simple
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-brand-green-700 bg-brand-green-50"
                    : "text-gray-600 hover:text-brand-green-700 hover:bg-brand-green-50/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919810329454"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-green-700 font-semibold transition-colors"
            >
              <Phone size={14} />
              <span>+91 98103 29454</span>
            </a>
            {activeUser ? (
              <button
                onClick={onNavigateDashboard}
                className="px-5 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand-green-200 transition-all active:scale-95 cursor-pointer"
              >
                My Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-brand-green-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-brand-green-600 hover:bg-brand-green-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand-green-200 transition-all active:scale-95"
                >
                  Sell Scrap
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? "text-brand-green-700 bg-brand-green-50"
                    : "text-gray-600 hover:text-brand-green-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {activeUser ? (
                <button
                  onClick={onNavigateDashboard}
                  className="w-full py-3 bg-brand-green-600 text-white text-sm font-bold rounded-xl transition-all"
                >
                  My Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-center py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center py-3 bg-brand-green-600 text-white text-sm font-bold rounded-xl shadow-md"
                  >
                    Sell Scrap
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
