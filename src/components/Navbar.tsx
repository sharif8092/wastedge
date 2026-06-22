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

  const isHome = location.pathname === "/";

  const headerBg = scrolled
    ? isHome
      ? "bg-[#050505]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
      : "bg-white/95 backdrop-blur-xl shadow-md shadow-gray-100"
    : isHome
      ? "bg-transparent border-b border-transparent"
      : "bg-white border-b border-gray-100";

  const textColor = isHome ? "text-white" : "text-gray-900";
  const brandAccent = isHome ? "text-emerald-400" : "text-brand-green-600";
  const mutedText = isHome ? "text-gray-400" : "text-gray-500";
  
  const getLinkClasses = (to: string) => {
    if (isActive(to)) {
      return isHome ? "text-emerald-400 bg-emerald-400/10" : "text-brand-green-700 bg-brand-green-50";
    }
    return isHome 
      ? "text-gray-300 hover:text-white hover:bg-white/10" 
      : "text-gray-600 hover:text-brand-green-700 hover:bg-brand-green-50/60";
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      {/* Live price ticker at the absolute top (always green) */}
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
          <Link to="/" className="flex items-center gap-2.5 select-none group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${isHome ? 'bg-gradient-to-br from-emerald-500 to-teal-400 shadow-emerald-500/20' : 'bg-gradient-to-br from-brand-green-600 to-brand-green-500 shadow-brand-green-200'}`}>
              <Recycle size={18} className="text-white animate-spin-slow" />
            </div>
            <div className="leading-none">
              <span className={`font-extrabold text-lg font-display tracking-tight ${textColor}`}>
                wastEdge
                <span className={brandAccent}>Solution</span>
              </span>
              <p className={`text-[9px] font-mono uppercase tracking-widest font-bold mt-0.5 ${mutedText}`}>
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
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${getLinkClasses(link.to)}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-5">
            <div className={`text-sm font-bold flex items-center gap-2 ${mutedText}`}>
              <Phone size={16} className={brandAccent} />
              +91 98103 29454
            </div>

            {activeUser ? (
              <button
                onClick={onNavigateDashboard}
                className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all hover:scale-105 ${isHome ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-brand-green-600 text-white hover:bg-brand-green-700 shadow-md shadow-brand-green-200'}`}
              >
                Dashboard
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${isHome ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/book"
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all hover:scale-105 ${isHome ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-brand-green-600 text-white hover:bg-brand-green-700 shadow-md shadow-brand-green-200'}`}
                >
                  Sell Scrap
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${isHome ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 border-b shadow-2xl animate-slide-down ${isHome ? 'bg-[#0a0a0a] border-white/10 shadow-black/50' : 'bg-white border-gray-100 shadow-gray-200'}`}>
          <nav className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${getLinkClasses(link.to)}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className={`my-2 h-px ${isHome ? 'bg-white/10' : 'bg-gray-100'}`}></div>
            
            {activeUser ? (
              <button
                onClick={onNavigateDashboard}
                className={`w-full px-4 py-3 text-center text-sm font-black rounded-xl transition-colors ${isHome ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400' : 'bg-brand-green-600 text-white hover:bg-brand-green-700'}`}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-3 rounded-xl text-sm font-bold text-center transition-colors ${isHome ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/book"
                  className={`px-4 py-3 rounded-xl text-sm font-black text-center transition-colors ${isHome ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400' : 'bg-brand-green-600 text-white hover:bg-brand-green-700'}`}
                >
                  Sell Scrap Now
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
