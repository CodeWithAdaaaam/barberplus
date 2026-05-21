import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Send, Clock,} from "lucide-react";
import { initScrollReveal } from "@/hooks/useScrollReveal";

const Contact: React.FC = () => {
  useEffect(() => {
    initScrollReveal();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-[100px] bg-black min-h-screen font-sans overflow-x-hidden">
      
      {/* 1. HEADER SECTION */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.6em] text-gold mb-4 font-black"
          >
            ENTRER EN CONTACT
          </motion.p>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-6xl md:text-8xl text-white uppercase tracking-tighter italic"
          >
            Barber Plus 
          </motion.h1>
          <div className="w-24 h-[1px] bg-gold/50 mx-auto mt-8 shadow-[0_0_15px_rgba(201,168,76,0.3)]" />
        </div>
      </section>

      {/* 2. CONTENT SECTION (INFO + FORM) */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* CÔTÉ GAUCHE : INFOS DE LUXE */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-display text-white uppercase italic mb-8 border-l-4 border-gold pl-6">
                Coordonnées <span className="text-gold"></span>
              </h2>
              <p className="text-zinc-500 leading-relaxed max-w-md">
                Notre conciergerie est à votre disposition pour toute demande particulière concernant nos rituels de soin à Hay Riad.
              </p>
            </div>

            <div className="space-y-8">
              {/* LIEN GOOGLE MAPS CLIQUABLE */}
              <a 
                href="https://maps.app.goo.gl/XUsXgKFzFaq86Cvs9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-6 group cursor-pointer"
              >
                <div className="bg-gold p-4 text-black group-hover:bg-white transition-colors duration-500 shadow-xl shadow-gold/10">
                  <MapPin size={28}/>
                </div>
                <div>
                  <h4 className="text-lg font-display tracking-wider mb-1 text-white group-hover:text-gold transition-colors">LOCALISATION</h4>
                  <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    City Center ,<br/>
                    Hay Riad, Rabat — <span className="text-gold italic underline underline-offset-4">Ouvrir l'itinéraire</span>
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-6 group">
                <a 
  href="tel:+212661217511" 
  className="flex items-start gap-6 group cursor-pointer"
>
  <div className="bg-zinc-900 border border-zinc-800 p-4 text-gold group-hover:border-gold group-hover:bg-gold group-hover:text-black transition-all duration-500 shadow-xl shadow-gold/5">
    <Phone size={28}/>
  </div>
  <div>
    <h4 className="text-lg font-display tracking-wider mb-1 text-white group-hover:text-gold transition-colors uppercase italic font-bold">LIGNE DIRECTE</h4>
    <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors">
      +212 661-217511 — <span className="text-gold italic underline underline-offset-4 font-medium">Appeler le salon</span>
    </p>
  </div>
</a>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="bg-zinc-900 border border-zinc-800 p-4 text-gold group-hover:border-gold transition-all duration-500">
                  <Clock size={28}/>
                </div>
                <div>
                  <h4 className="text-lg font-display tracking-wider mb-1 text-white">HORAIRES D'EXCELLENCE</h4>
                  <p className="text-zinc-500 leading-relaxed">Lundi — Dimanche : 09:00 - 22:00</p>
                  
                </div>
              </div>
            </div>
          </div>

          {/* CÔTÉ DROIT : FORMULAIRE DE LUXE */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gold/5 blur-3xl rounded-full opacity-50" />
            <form className="relative bg-zinc-900/50 border border-zinc-800 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-6 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Votre Nom</label>
                  <input type="text" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all font-bold placeholder:text-zinc-800" placeholder="NOM COMPLET" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Téléphone</label>
                  <input type="tel" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all font-bold placeholder:text-zinc-800" placeholder="06..." />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Sujet de votre demande</label>
                <input type="text" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold transition-all font-bold placeholder:text-zinc-800" placeholder="EX: RÉSERVATION PRIVÉE" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Message</label>
                <textarea rows={4} className="w-full bg-black border border-zinc-800 p-5 rounded-3xl text-white outline-none focus:border-gold transition-all font-bold placeholder:text-zinc-800" placeholder="COMMENT POUVONS-NOUS VOUS SUBERLIMEZ ?"></textarea>
              </div>

              <button className="w-full bg-gold text-black py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all duration-700 shadow-xl shadow-gold/20 flex items-center justify-center gap-4 group">
                Envoyer au Salon
                <Send size={16} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 3. MINI MAP PREVIEW (Optionnel) */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="h-64 md:h-96 w-full rounded-[3rem] overflow-hidden grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 border border-zinc-800">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4769.46237634848!2d-6.8643379!3d33.9695303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76d8f3f52efb9%3A0x12452fa2ea21d4a8!2sBarber%20Plus!5e1!3m2!1sfr!2sma!4v1779382313179!5m2!1sfr!2sma" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;