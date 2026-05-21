import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, Sparkles, Crown, Smile, Clock, ArrowRight, Box, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase"; 
import { initScrollReveal } from "@/hooks/useScrollReveal";

const categoryIcons: Record<string, React.ReactNode> = {
  COIFFURE: <Scissors size={24} />,
  BARBE: <Smile size={24} />,
  SOINS: <Sparkles size={24} />,
  PACKS: <Box size={24} />,
  DEFAULT: <Crown size={24} />,
};

const ServicesPage: React.FC = () => {
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initScrollReveal();
    window.scrollTo(0, 0);
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const { data, error } = await supabase
        .from('Service')
        .select('*')
        .order('price', { ascending: false });

      if (error) throw error;
      if (data) setDbServices(data);
    } catch (err) {
      console.error("Erreur services:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- LOGIQUE SÉLECTION SIGNATURE (FORCÉE) ---
  const popularServices = [
    // 1. LA PRIORITÉ ABSOLUE : Coupe + Barbe Signature
    dbServices.find(s => s.title.includes("Coupe + Barbe Signature")),
    // 2. LE PACK PRESTIGE (Celui à 800 ou 1300 MAD)
    dbServices.find(s => s.category === "PACKS" && s.price >= 800),
    // 3. LE SOIN TECHNIQUE (Lissage ou Botox)
    dbServices.find(s => s.title.includes("Lissage") || s.title.includes("Botox"))
  ].filter(Boolean); // On nettoie les résultats si un service n'existe pas en base

  const handleQuickBook = (serviceId: string) => {
    navigate(`/booking?serviceId=${serviceId}`);
  };

  const categories = ["PACKS", "COIFFURE", "BARBE", "SOINS"];

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="text-gold font-display text-4xl animate-pulse italic uppercase tracking-widest">Barber Plus...</div>
    </div>
  );

  return (
    <div className="pt-[72px] bg-black min-h-screen font-sans overflow-x-hidden">
      
      {/* 1. HERO HEADER */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.6em] text-gold mb-6 font-bold"
          >
            L'Excellence au cœur de Hay Riad
          </motion.p>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="font-display text-7xl md:text-9xl text-white mb-8 uppercase tracking-tighter italic"
          >
            Menu <span className="text-gold not-italic">Prestige</span>
          </motion.h1>
          <div className="w-24 h-[1px] bg-gold/50 mx-auto mb-10 shadow-[0_0_20px_rgba(201,168,76,0.3)]" />
          <p className="text-lg text-zinc-500 max-w-[650px] mx-auto leading-relaxed italic font-light">
            Chaque prestation est une œuvre de précision, une parenthèse de luxe dédiée à l'esthétique masculine.
          </p>
        </div>
      </section>

      {/* 2. SECTION SIGNATURE (DORÉE) */}
      <section className="pb-32 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 mb-20 border-b border-white/5 pb-10">
          <Trophy className="text-gold" size={40} strokeWidth={1} />
          <div>
            <h2 className="text-4xl font-display text-white uppercase italic tracking-tight">Expériences <span className="text-gold">Signatures</span></h2>
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] mt-2 font-bold">Le sommet de notre savoir-faire</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {popularServices.map((s, index) => {
            // Style spécial pour "Coupe + Barbe Signature"
            const isPhare = s.title.includes("Coupe + Barbe Signature");
            
            return (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -15 }}
                className={`relative p-12 rounded-[3.5rem] flex flex-col items-center text-center transition-all duration-700 shadow-2xl ${
                  isPhare 
                  ? 'bg-gradient-to-b from-zinc-900 to-black border border-gold/40 ring-1 ring-gold/20' 
                  : 'bg-zinc-900/40 border border-white/5'
                }`}
              >
                {isPhare && (
                  <div className="absolute -top-3 bg-gold text-black text-[8px] font-black px-6 py-1.5 rounded-full uppercase tracking-[0.3em] shadow-2xl">
                    Plus Choisi
                  </div>
                )}
                
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-gold mb-10 shadow-2xl transition-transform duration-500 group-hover:scale-110 ${isPhare ? 'bg-gold/10' : 'bg-white/5'}`}>
                  {isPhare ? <Star size={40} fill="currentColor" /> : <Crown size={40} />}
                </div>

                <h3 className="text-3xl font-display text-white mb-6 leading-[1.1] uppercase px-2 tracking-tight">
                  {s.title.replace('(Le plus choisi)', '')}
                </h3>
                
                <div className="mb-10">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-2">{s.duration} MINUTES D'EXPERTISE</span>
                  <p className="text-gold font-display text-5xl italic tracking-tighter">{s.price} <small className="text-xs not-italic">MAD</small></p>
                </div>
                
                <div className="w-full pt-10 border-t border-white/10">
                  <button 
                    onClick={() => handleQuickBook(s.id)}
                    className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all duration-500 shadow-xl active:scale-95 ${
                      isPhare 
                      ? 'bg-gold text-black hover:bg-white' 
                      : 'bg-white/5 text-white hover:bg-gold hover:text-black border border-white/10'
                    }`}
                  >
                    Réserver cet instant
                  </button>
                </div>

                {/* Filigrane discret */}
                <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-white font-black text-8xl uppercase italic pointer-events-none select-none">
                  BP
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. CATALOGUE PAR CATÉGORIE */}
      {categories.map((catName) => {
        const servicesInCat = dbServices.filter(s => s.category === catName);
        if (servicesInCat.length === 0) return null;

        return (
          <section key={catName} className="pb-28 max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-8 mb-16">
               <h2 className="text-2xl font-black text-white tracking-[0.4em] uppercase italic border-b-2 border-gold pb-4">{catName}</h2>
               <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesInCat.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  className="bg-zinc-900/20 border border-white/5 rounded-3xl p-10 transition-all duration-500 hover:border-gold/30 group relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-gold mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    {categoryIcons[service.category] || categoryIcons.DEFAULT}
                  </div>
                  <h3 className="font-display text-2xl text-white mb-2 uppercase tracking-tight leading-tight">{service.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-8">
                    <Clock size={12} className="text-gold" />
                    <span>{service.duration} MIN</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <span className="font-display text-3xl text-gold italic">{service.price} MAD</span>
                    <button 
                      onClick={() => handleQuickBook(service.id)}
                      className="text-[9px] font-black bg-gold/5 text-gold px-6 py-3 rounded-full hover:bg-gold hover:text-black transition-all duration-300 uppercase tracking-widest border border-gold/20"
                    >
                      Prendre Rang
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}

      {/* 4. CTA FINAL HAY RIAD */}
      <section className="py-40 relative">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full max-w-lg mx-auto" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-6xl md:text-7xl text-white mb-10 uppercase tracking-tighter leading-none">Votre Fauteuil <br /> <span className="text-gold italic">à Hay Riad</span></h2>
          <p className="text-zinc-500 mb-12 uppercase text-[11px] tracking-[0.5em] font-black italic">Avenue Annakhil • Service Conciergerie</p>
          <button
            onClick={() => navigate('/booking')}
            className="inline-flex items-center gap-6 bg-gold text-black px-16 py-7 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all duration-700 hover:scale-105 shadow-[0_20px_50px_rgba(201,168,76,0.3)]"
          >
            Réserver ma séance
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;