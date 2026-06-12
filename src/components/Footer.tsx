import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Logo from './BPLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-6 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Grille Principale 4 Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Colonne 1 : Logo & Identité */}
          <div className="space-y-6">
            <Logo size="md" />
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs italic font-light">
              L'excellence de la haute coiffure masculine à Hay Riad. <br/>
              Une signature de style, une précision absolue.
            </p>
          </div>

          {/* Colonne 2 : Navigation Rapide */}
          <div>
            <h4 className="font-display text-white text-xl uppercase italic mb-8 tracking-wider">Navigation</h4>
            <ul className="space-y-4 text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">
              <li><Link to="/" className="hover:text-gold transition-colors duration-300">Accueil</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors duration-300">Services & Tarifs</Link></li>
              <li><Link to="/galerie" className="hover:text-gold transition-colors duration-300">La Galerie</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors duration-300">Nous Contacter</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Contact & Localisation Directe (MISE À JOUR) */}
          <div>
            <h4 className="font-display text-white text-xl uppercase italic mb-8 tracking-wider">Le Salon</h4>
            <div className="space-y-6">
              {/* NOUVEAU LIEN GOOGLE MAPS PRÉCIS */}
              <a 
                href="https://www.google.com/maps/place/33%C2%B057'11.8%22N+6%C2%B052'51.3%22W/@33.9532726,-6.8809415,63m/data=!3m1!1e3!4m4!3m3!8m2!3d33.953282!4d-6.88092!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <MapPin size={20} className="text-gold shrink-0 group-hover:scale-110 transition-transform duration-500"/> 
                <span className="text-zinc-500 text-sm group-hover:text-white transition-colors leading-relaxed">
                  City Center numéro B4<br/> Hay Riad, Rabat
                </span>
              </a>

              {/* LIEN TÉLÉPHONE DIRECT */}
              <a 
                href="tel:+212661217511" 
                className="flex items-center gap-4 group"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500">
                   <Phone size={14} />
                </div>
                <span className="text-zinc-500 text-sm font-bold group-hover:text-white transition-colors italic tracking-tight">
                  +212 661-217511
                </span>
              </a>
            </div>
          </div>

          {/* Colonne 4 : Réseaux Sociaux Prestige */}
          <div>
            <h4 className="font-display text-white text-xl uppercase italic mb-8 tracking-wider">Social</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/barber.plus.rabat/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl border border-white/5 bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:border-gold/50 hover:text-gold transition-all duration-500 group">
                <FaInstagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://wa.me/212661217511" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl border border-white/5 bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:border-green-500/50 hover:text-green-500 transition-all duration-500 group"
              >
                <FaWhatsapp size={22} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] mt-6 font-bold">
              Disponible sur rendez-vous uniquement
            </p>
          </div>

        </div>

        {/* --- BARRE DE SIGNATURE FINALE --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-10 mt-10">
          
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-medium">
            © 2026 Barber Plus Hay Riad. Tous droits réservés.
          </p>
          
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-medium">
            Créé par{" "}
            <a 
              href="https://ae-agency.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold hover:text-white transition-all duration-300 italic underline underline-offset-8 decoration-gold/30 hover:decoration-white font-bold"
            >
              Coding with Adam
            </a>
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
