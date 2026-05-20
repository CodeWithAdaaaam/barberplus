import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BPLogo from "./BPLogo";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/galerie", label: "Galerie" },
  { to: "/contact", label: "Contact" },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bp-bg/95 backdrop-blur-xl border-b border-bp-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <BPLogo size="sm" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? "text-gold"
                    : "text-white/80 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/booking"
              className="bg-gold text-bp-bg px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-gold-light transition-colors duration-200"
            >
              Réserver
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-bp-overlay"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-[72px] left-0 right-0 bg-bp-bg border-b border-bp-border transform transition-transform duration-300 ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-6 py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`py-4 text-lg font-medium border-b border-bp-border/50 transition-colors ${
                  isActive(link.to)
                    ? "text-gold"
                    : "text-white/80 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/booking"
              className="mt-4 bg-gold text-bp-bg px-6 py-3.5 rounded-md text-center font-semibold hover:bg-gold-light transition-colors"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
