import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu lors du changement de page
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Bloquer le scroll du site quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const isActive = (path: string) => {
    return path === "/" ? location.pathname === "/" : location.pathname === path;
  };

  return (
    <>
      {/* 1. BARRE DE NAVIGATION PRINCIPALE (Doit être au-dessus de tout) */}
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-500 flex items-center h-[80px] md:h-[90px] ${
          scrolled || mobileOpen ? "bg-[#050505] border-b border-gold/10 shadow-2xl" : "bg-transparent"
        }`}
        style={{ zIndex: 1001 }}
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo cliquable */}
          <Link to="/" className="relative z-[1002] hover:opacity-80 transition-opacity">
            <BPLogo size="sm" />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-300 ${
                  isActive(link.to) ? "text-gold underline underline-offset-8" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/booking"
              className="bg-gold text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-gold/20"
            >
              Prendre RDV
            </Link>
          </div>

          {/* Bouton Hamburger Mobile (z-index très haut pour rester cliquable) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gold p-2 relative z-[1002] active:scale-90 transition-transform"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </nav>

      {/* 2. MENU DÉROULANT MOBILE COMPLET */}
      <div
        className={`fixed inset-0 transition-all duration-500 ease-in-out md:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{ zIndex: 1000 }} // Juste en dessous de la barre de nav
      >
        {/* Fond d'obscurcissement (clic pour fermer) */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md" 
          onClick={() => setMobileOpen(false)} 
        />

        {/* Contenu du Menu */}
        <div
          className={`absolute top-0 left-0 right-0 bg-[#0A0A0A] border-b border-gold/20 pt-[100px] pb-12 px-8 transform transition-transform duration-500 ease-out shadow-[0_30px_60px_rgba(0,0,0,0.8)] ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Filigrane décoratif */}
          <div className="absolute top-32 right-6 opacity-[0.03] text-white font-display text-9xl italic pointer-events-none">
            BP
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)} // Fermeture explicite au clic
                className={`py-5 text-3xl font-display uppercase italic tracking-tighter border-b border-white/5 flex justify-between items-center transition-colors active:text-gold ${
                  isActive(link.to) ? "text-gold" : "text-white"
                }`}
              >
                {link.label}
                {isActive(link.to) && <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_12px_#C9A84C]" />}
              </Link>
            ))}
            
            <div className="mt-10 space-y-6">
              {/* Bouton de réservation mobile */}
              <Link
                to="/booking"
                onClick={() => setMobileOpen(false)}
                className="block w-full bg-gold text-black py-5 rounded-2xl text-center font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-transform"
              >
                Réserver ma séance
              </Link>
              
              {/* Téléphone cliquable */}
              <a 
                href="tel:+212661217511" 
                className="flex items-center justify-center gap-3 text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase py-2 active:text-gold transition-colors"
              >
                <Phone size={14} className="text-gold" /> +212 661-217511
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;