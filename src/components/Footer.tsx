import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import BPLogo from "./BPLogo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-bp-bg border-t border-bp-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-16 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Logo Column */}
          <div className="flex flex-col items-center md:items-start">
            <BPLogo size="lg" />
            <p className="mt-6 text-bp-muted text-sm text-center md:text-left leading-relaxed">
              Votre barbier de confiance à Hay Riad, Rabat. Une expérience de coiffure masculine premium.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/barberplus"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-bp-border flex items-center justify-center text-bp-muted hover:text-gold hover:border-gold transition-colors duration-200"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-medium uppercase tracking-[0.08em] text-bp-muted mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Accueil" },
                { to: "/services", label: "Services" },
                { to: "/galerie", label: "Galerie" },
                { to: "/booking", label: "Rendez-Vous" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-bp-muted hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-medium uppercase tracking-[0.08em] text-bp-muted mb-6">
              NOUS TROUVER
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-bp-muted">
                  Hay Riad, Rabat, Maroc
                </span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <a
                  href="tel:+212661217511"
                  className="text-sm text-bp-muted hover:text-gold transition-colors"
                >
                  +212 661-217511
                </a>
              </div>
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <Clock size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-bp-muted">
                  Lun – Dim : 9h – 22h
                  <br />
                  <span className="text-xs">Ouvert 7j/7</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-bp-border mt-12 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-bp-tertiary">
              © 2026 Barber Plus. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-xs text-bp-tertiary">
              <span className="hover:text-bp-muted cursor-pointer transition-colors">
                Politique de confidentialité
              </span>
              <span>·</span>
              <span className="hover:text-bp-muted cursor-pointer transition-colors">
                Conditions d&apos;utilisation
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
