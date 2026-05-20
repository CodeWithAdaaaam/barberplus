import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Scissors, Sparkles, Crown, FlaskConical, 
  Heart, Smile, Clock, ArrowRight, Box 
} from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import { initScrollReveal } from "@/hooks/useScrollReveal";

// Attribution automatique des icônes par catégorie
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
        .order('price', { ascending: false }); // Les packs de luxe en premier

      if (error) throw error;
      if (data) setDbServices(data);
    } catch (err) {
      console.error("Erreur chargement services:", err);
    } finally {
      setLoading(false);
    }
  }

  // Grouper les services par catégorie pour l'affichage
  const categories = ["PACKS", "COIFFURE", "BARBE", "SOINS"];

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-gold font-black tracking-[0.5em] animate-pulse uppercase">Barber Plus...</div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] bg-black min-h-screen">
      {/* 1. Header Prestige */}
      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center">
          <p data-reveal className="text-[10px] uppercase tracking-[0.5em] text-gold mb-4 font-black">
            L'EXCELLENCE À HAY RIAD
          </p>
          <h1 data-reveal className="font-display text-5xl md:text-7xl text-white mb-6 uppercase tracking-tighter" style={{ transitionDelay: "0.1s" }}>
            Services <span className="text-gold italic">&</span> Tarifs
          </h1>
          <div className="w-20 h-1 bg-gold mx-auto mb-8 shadow-[0_0_15px_rgba(201,168,76,0.5)]" />
          <p data-reveal className="text-lg text-zinc-500 max-w-[600px] mx-auto italic" style={{ transitionDelay: "0.2s" }}>
            Une expérience de soin sur-mesure combinant techniques ancestrales et précision moderne.
          </p>
        </div>
      </section>

      {/* 2. Grid des Services par Catégorie */}
      {categories.map((catName) => {
        const servicesInCat = dbServices.filter(s => s.category === catName);
        if (servicesInCat.length === 0) return null;

        return (
          <section key={catName} className="pb-16 md:pb-24 max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-black text-white mb-10 tracking-[0.3em] uppercase italic border-l-4 border-gold pl-6">
              {catName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesInCat.map((service) => (
                <div
                  key={service.id}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 transition-all duration-500 hover:border-gold/50 group relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    {categoryIcons[service.category] || categoryIcons.DEFAULT}
                  </div>
                  
                  <h3 className="font-display text-2xl text-white mb-2 uppercase tracking-tight leading-none">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-6">
                    <Clock size={12} className="text-gold" />
                    <span>{service.duration} MINUTES</span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="font-display text-3xl text-gold italic">{service.price} MAD</span>
                    <Link
                      to="/booking"
                      className="text-[10px] font-black bg-gold text-black px-6 py-2.5 rounded-full hover:bg-white transition-all duration-300 uppercase tracking-widest shadow-lg shadow-gold/10"
                    >
                      Réserver
                    </Link>
                  </div>
                  
                  {/* Filigrane décoratif en fond de carte */}
                  <div className="absolute -bottom-4 -right-4 opacity-[0.02] text-white font-black text-7xl uppercase italic pointer-events-none">
                    {service.category}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* 3. Pricing Table (Detailed List) */}
      <section className="py-24 bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-3 font-bold">Catalogue complet</p>
            <h2 className="font-display text-4xl text-white uppercase italic">
              Grille <span className="text-gold">Tarifaire</span>
            </h2>
          </div>

          <div className="bg-black/50 rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl">
            {dbServices.map((service, index) => (
              <div
                key={service.id}
                className={`grid grid-cols-[1fr_auto_auto] gap-6 px-8 py-6 items-center group hover:bg-gold/5 transition-colors ${
                  index !== dbServices.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-wide group-hover:text-gold transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-[10px] text-zinc-600 uppercase mt-1 tracking-widest">
                    {service.category} • {service.duration} MIN
                  </p>
                </div>
                <span className="font-display text-xl text-gold italic pr-4">{service.price} MAD</span>
                <Link
                  to="/booking"
                  className="text-[9px] font-black border border-zinc-800 text-zinc-400 px-4 py-2 rounded-lg hover:border-gold hover:text-gold transition-all duration-300 uppercase tracking-widest"
                >
                  Book
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA Final */}
      <section className="py-32">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center bg-zinc-900/50 p-16 rounded-[3rem] border border-gold/10 shadow-[0_0_50px_rgba(201,168,76,0.05)]">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6 uppercase tracking-tighter">
            VOTRE FAUTEUIL <span className="text-gold">VOUS ATTEND</span>
          </h2>
          <p className="text-zinc-500 mb-10 uppercase text-xs tracking-[0.2em] leading-relaxed">
            Prenez rendez-vous dès maintenant pour une séance d'exception <br /> dans notre salon de Hay Riad.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-4 bg-gold text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 hover:scale-105 shadow-2xl shadow-gold/20"
          >
            Réserver Maintenant
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;