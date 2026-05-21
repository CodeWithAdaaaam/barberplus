import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom"; // À importer en haut
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Check, Scissors, Smile, Sparkles, Box, CheckCircle2, UserPlus,  Plus
} from "lucide-react";
import { supabase } from "../lib/supabase"; 

interface Service {
  id: string;
  title: string;
  price: number;
  duration: number;
  category: string;
}

interface Barber {
  id: string;
  full_name: string;
  avatar_url: string;
  specialties: string[];
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

const CATEGORIES = [
  { id: 'COIFFURE', label: 'COIFFURE', icon: <Scissors size={24} /> },
  { id: 'BARBE', label: 'BARBE', icon: <Smile size={24} /> },
  { id: 'SOINS', label: 'SOINS', icon: <Sparkles size={24} /> },
  { id: 'PACKS', label: 'PACKS', icon: <Box size={24} /> },
];

const stepVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [dbBarbers, setDbBarbers] = useState<Barber[]>([]);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchParams] = useSearchParams();
  useEffect(() => {
  const serviceIdFromUrl = searchParams.get('serviceId');
  
  if (serviceIdFromUrl && dbServices.length > 0) {
    const preSelectedService = dbServices.find(s => s.id === serviceIdFromUrl);
    
    if (preSelectedService) {
      // 1. On sélectionne le service
      setBookingData(prev => ({
        ...prev,
        serviceIds: [serviceIdFromUrl] 
      }));
      
      // 2. On définit la catégorie pour l'affichage
      setSelectedCategory(preSelectedService.category);
      
      // 3. On saute directement à l'étape 2 (Liste des services / Barbier)
      setStep(2);
    }
  }
}, [searchParams, dbServices]);

  const [bookingData, setBookingData] = useState({
    serviceIds: [] as string[], 
    barberId: 'any',
    date: null as string | null,
    time: null as string | null,
    firstName: "",
    phone: "",
  });


  // 1. CHARGEMENT DES SERVICES ET BARBIERS
  useEffect(() => {
    async function loadInitialData() {
      const { data: srv } = await supabase.from('Service').select('*');
      const { data: brb } = await supabase.from('Barber').select('*');
      if (srv) setDbServices(srv);
      if (brb) setDbBarbers(brb);
      setLoading(false);
    }
    loadInitialData();
  }, []);

  // 2. CHARGEMENT DES RÉSERVATIONS DU JOUR CHOISI (Pour calculer les disponibilités)
  useEffect(() => {
    if (bookingData.date) {
        async function fetchDayBookings() {
            const { data } = await supabase
                .from('Booking')
                .select('*')
                .gte('startTime', `${bookingData.date}T00:00:00`)
                .lte('startTime', `${bookingData.date}T23:59:59`);
            if (data) setExistingBookings(data);
        }
        fetchDayBookings();
    }
  }, [bookingData.date]);

  const selectedServices = dbServices.filter(s => bookingData.serviceIds.includes(s.id));
  const selectedBarber = dbBarbers.find(b => b.id === bookingData.barberId);
  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + Number(s.duration), 0);

  // 3. CALCUL DE LA SÉQUENCE (Offset de temps pour chaque service)
  const serviceSegments = useMemo(() => {
    let currentOffset = 0;
    return selectedServices.map(s => {
      const segment = {
        category: s.category,
        duration: Number(s.duration),
        startOffset: currentOffset,
        endOffset: currentOffset + Number(s.duration)
      };
      currentOffset += Number(s.duration);
      return segment;
    });
  }, [selectedServices]);

  // 4. LOGIQUE DE DISPONIBILITÉ EN CHAÎNE
  const availableTimeSlots = useMemo(() => {
    if (!bookingData.date || selectedServices.length === 0) return [];

    const todayStr = new Date().toLocaleDateString('en-CA');
    const now = new Date();

    return TIME_SLOTS.filter(slot => {
      const [slotH, slotM] = slot.split(':').map(Number);
      
      // Filtre A : Heure passée
      if (bookingData.date === todayStr) {
        if (slotH < now.getHours() || (slotH === now.getHours() && slotM <= now.getMinutes() + 15)) return false;
      }

      // Filtre B : Disponibilité de la chaîne de prestataires
      return serviceSegments.every(segment => {
        const segmentStartMin = slotH * 60 + slotM + segment.startOffset;
        const segmentEndMin = slotH * 60 + slotM + segment.endOffset;

        // Nombre total d'experts pour cette spécialité
        const totalExperts = dbBarbers.filter(b => b.specialties?.includes(segment.category)).length;

        // Nombre d'experts occupés durant ce segment précis
        const busyExperts = existingBookings.filter(b => {
            const isSameSpec = b.required_specialties?.includes(segment.category);
            if (!isSameSpec) return false;

            const bDate = new Date(b.startTime);
            const bStartMin = bDate.getHours() * 60 + bDate.getMinutes();
            const bEndMin = bStartMin + Number(b.duration);

            // Vérification du chevauchement (Overlap)
            return Math.max(segmentStartMin, bStartMin) < Math.min(segmentEndMin, bEndMin);
        }).length;

        return busyExperts < totalExperts;
      });
    });
  }, [bookingData.date, existingBookings, serviceSegments, dbBarbers, selectedServices]);

  const toggleService = (id: string) => {
    setBookingData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter(sid => sid !== id)
        : [...prev.serviceIds, id]
    }));
  };

  const updateData = (updates: Partial<typeof bookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const confirmBooking = async () => {
    if (!bookingData.firstName.trim() || !bookingData.phone.trim()) return;
    setIsSubmitting(true);
    
    try {
      // Fix du décalage : ISO local manuel
      const startTimeISO = `${bookingData.date}T${bookingData.time}:00`;
      const requiredSpecs = Array.from(new Set(selectedServices.map(s => s.category)));

      const { error } = await supabase.from('Booking').insert([{
        clientName: bookingData.firstName,
        clientPhone: bookingData.phone,
        serviceId: bookingData.serviceIds[0],
        barberId: bookingData.barberId === 'any' ? null : bookingData.barberId,
        startTime: startTimeISO,
        duration: totalDuration,
        totalPrice: totalPrice,
        required_specialties: requiredSpecs,
        note: `Chaîne: ${selectedServices.map(s => s.title).join(' -> ')}`
      }]);

      if (error) throw error;
      setStep(5);
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  };

  const getWhatsAppLink = useCallback(() => {
    const servicesText = selectedServices.map(s => s.title).join(' + ');
    const text = `Bonjour Barber Plus Hay Riad, je confirme mon RDV le ${bookingData.date} à ${bookingData.time} pour : ${servicesText}. Total: ${totalPrice} MAD.`;
    return `https://wa.me/212600000000?text=${encodeURIComponent(text)}`;
  }, [selectedServices, bookingData, totalPrice]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-gold font-black tracking-widest animate-pulse uppercase">Barber Plus...</div>;

  return (
    <div className="pt-32 min-h-screen bg-black text-white px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* ÉTAPE 1 : CATÉGORIES */}
          {step === 1 && (
            <motion.div key="step1" {...stepVariants} className="text-center">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 italic">
                QUELLE <span className="text-gold not-italic">PRESTATION ?</span>
              </h1>
              <div className="w-16 h-0.5 bg-gold mx-auto mb-12" />
              
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {CATEGORIES.map((cat) => {
                  const hasSelected = dbServices.some(s => s.category === cat.id && bookingData.serviceIds.includes(s.id));
                  return (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setStep(2); }}
                      className={`group relative bg-zinc-900/40 border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:bg-zinc-900 ${hasSelected ? 'border-gold/50 bg-zinc-900' : 'border-zinc-800'}`}>
                      {hasSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-black">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-500 border border-zinc-700 shadow-xl">
                        {cat.icon}
                      </div>
                      <span className="text-sm font-black tracking-[0.2em] group-hover:text-gold transition-colors italic uppercase">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {bookingData.serviceIds.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex flex-col items-center gap-4">
                   <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest italic">{bookingData.serviceIds.length} service(s) • {totalPrice} MAD</p>
                   <button onClick={() => setStep(3)} className="bg-white text-black px-12 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gold transition-colors shadow-xl">
                      Passer au calendrier
                   </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ÉTAPE 2 : SERVICES */}
          {step === 2 && (
            <motion.div key="step2" {...stepVariants}>
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gold mb-10 uppercase text-[10px] font-black tracking-[0.3em]">
                <ChevronLeft size={16} /> Retour aux catégories
              </button>
              
              <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                  {selectedCategory} <span className="text-gold">CHOIX</span>
                </h2>
              </div>
              
              <div className="grid gap-3 mb-12">
                
              {dbServices.filter(s => s.category === selectedCategory).map((s) => {
  const active = bookingData.serviceIds.includes(s.id);
  
  // LOGIQUE DE MISE EN AVANT : On détecte le service "plus choisi"
  const isMostPopular = s.title.toLowerCase().includes('plus choisi');

  return (
    <button 
      key={s.id} 
      onClick={() => toggleService(s.id)}
      className={`flex justify-between items-center p-6 border rounded-2xl transition-all group relative ${
        active ? 'border-gold bg-gold/10 ring-1 ring-gold/30' : 'border-zinc-800 bg-zinc-900/30'
      } ${isMostPopular ? 'border-gold/50 shadow-[0_0_20px_rgba(201,168,76,0.15)]' : ''}`}
    >
      
      {/* BADGE "LE PLUS CHOISI" S'AFFICHE SI LE TITRE CONTIENT LE MOT */}
      {isMostPopular && (
        <div className="absolute -top-2.5 left-6 bg-gold text-black text-[7px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-xl animate-pulse">
          ★ Recommandé / Le plus choisi
        </div>
      )}

      <div className="text-left flex items-center gap-5">
         <div className={`w-6 h-6 border rounded-md flex items-center justify-center transition-all ${active ? 'bg-gold border-gold' : 'border-zinc-700'}`}>
            {active && <Check size={14} className="text-black stroke-[4]" />}
         </div>
         <div>
            {/* On utilise font-display pour les titres de services aussi */}
            <h3 className="text-lg font-display font-semibold uppercase tracking-tight text-white group-hover:text-gold transition-colors">
               {s.title.replace('(Le plus choisi)', '')} 
            </h3>
            <p className="text-zinc-500 text-[9px] mt-1 tracking-widest uppercase font-bold">
               {s.duration} MINUTES D'EXPERTISE
            </p>
         </div>
      </div>
      <div className="text-xl font-display font-bold text-gold italic">{s.price} MAD</div>
    </button>
  );
})}
              </div>

              <h2 className="text-2xl font-black mb-6 uppercase tracking-widest italic border-l-2 border-gold pl-3">Expert souhaité</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-20">
                  <button onClick={() => updateData({ barberId: 'any' })}
                      className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${bookingData.barberId === 'any' ? 'border-gold bg-gold/5' : 'border-zinc-800 bg-zinc-900/30 opacity-40 hover:opacity-100'}`}>
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gold"><UserPlus size={20}/></div>
                      <span className="text-[9px] font-black text-white uppercase text-center leading-tight">Premier<br/>Libre</span>
                  </button>
                  {dbBarbers.map(b => (
                      <button key={b.id} onClick={() => updateData({ barberId: b.id })}
                          className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${bookingData.barberId === b.id ? 'border-gold bg-gold/5' : 'border-zinc-800 bg-zinc-900/30 opacity-40 hover:opacity-100'}`}>
                          <img src={b.avatar_url} className="w-10 h-10 rounded-full object-cover border border-zinc-800" alt={b.full_name} />
                          <span className="text-[9px] font-black text-white uppercase text-center leading-tight">{b.full_name}</span>
                      </button>
                  ))}
              </div>

              <div className="sticky bottom-6 z-10 flex justify-between items-center bg-zinc-900/95 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Total Panier</p>
                  <p className="text-3xl font-black text-gold italic leading-none mt-1">{totalPrice} MAD</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="bg-zinc-800 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-zinc-700 transition-all">
                    <Plus size={14}/> Autre
                  </button>
                  <button onClick={() => setStep(3)} disabled={bookingData.serviceIds.length === 0} 
                    className="bg-gold text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-10 hover:scale-105 transition-all shadow-lg shadow-gold/20">
                    Planifier
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 3 : CALENDRIER AVEC FILTRE CHAÎNE */}
          {step === 3 && (
            <motion.div key="step3" {...stepVariants}>
                <button onClick={() => setStep(2)} className="text-gold flex items-center gap-2 mb-8 uppercase text-[10px] font-black tracking-widest"><ChevronLeft size={16}/> Retour</button>
                <div className="grid md:grid-cols-2 gap-10 bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800">
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="text-gold"><ChevronLeft/></button>
                            <span className="text-white font-black uppercase tracking-widest text-xs">{currentMonth.toLocaleString('fr-FR', {month: 'long', year: 'numeric'})}</span>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="text-gold"><ChevronRight/></button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-600 uppercase mb-4">
                            {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {Array.from({length: (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 6) % 7}).map((_, i) => <div key={i}/>)}
                            {Array.from({length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()}).map((_, i) => {
                                const d = i + 1;
                                const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                                const isPast = dateObj.getTime() < new Date().setHours(0,0,0,0);
                                const dateStr = dateObj.toLocaleDateString('en-CA');
                                const isSel = bookingData.date === dateStr;
                                return (
                                    <button key={d} onClick={() => updateData({date: dateStr})} disabled={isPast}
                                        className={`p-3 rounded-xl text-xs font-black transition-all ${isSel ? 'bg-gold text-black shadow-lg shadow-gold/20' : isPast ? 'opacity-5 cursor-not-allowed' : 'text-white hover:bg-zinc-800'}`}>
                                        {d}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    {/* Heures filtrées par enchaînement */}
                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 border-b border-zinc-800 pb-3">Disponibilités réelles</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {availableTimeSlots.length > 0 ? (
                                availableTimeSlots.map(t => (
                                    <button key={t} onClick={() => updateData({ time: t })}
                                        className={`p-4 text-[10px] font-black border rounded-2xl transition-all ${bookingData.time === t ? 'bg-gold border-gold text-black shadow-lg shadow-gold/20' : 'border-zinc-800 text-zinc-500 hover:border-gold hover:text-white'}`}>
                                        {t}
                                    </button>
                                ))
                            ) : (
                              <p className="col-span-3 text-zinc-600 text-[10px] text-center uppercase tracking-widest py-10">Complet ou passé</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-12 flex justify-end">
                  <button onClick={() => setStep(4)} disabled={!bookingData.date || !bookingData.time} className="bg-gold text-black px-14 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-gold/30 hover:scale-105 transition-all">Suivant</button>
                </div>
            </motion.div>
          )}

          {/* ÉTAPE 4 : FINALISATION AVEC ORDRE DE CHAÎNE */}
          {step === 4 && (
            <motion.div key="step4" {...stepVariants}>
                <button onClick={() => setStep(3)} className="text-gold flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-[0.3em]"><ChevronLeft size={16}/> Retour</button>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <h3 className="text-3xl font-black uppercase italic text-gold border-l-4 border-gold pl-6">Finalisation</h3>
                        <div className="space-y-4">
                          <input type="text" placeholder="NOM COMPLET" value={bookingData.firstName} onChange={e => updateData({firstName: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-3xl text-white outline-none focus:border-gold transition-all font-bold placeholder:text-zinc-700"/>
                          <input type="tel" placeholder="TÉLÉPHONE" value={bookingData.phone} onChange={e => updateData({phone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-3xl text-white outline-none focus:border-gold transition-all font-bold placeholder:text-zinc-700"/>
                        </div>
                    </div>
                    <div className="bg-zinc-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                        <h3 className="text-gold text-[10px] font-black uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">Ordre des Prestations</h3>
                        <div className="space-y-4">
                            {selectedServices.map((s, idx) => (
                                <div key={s.id} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-gold text-black text-[10px] flex items-center justify-center font-black">{idx + 1}</div>
                                    <div className="flex-1 flex justify-between">
                                        <span className="text-white font-bold uppercase text-xs">{s.title}</span>
                                        <span className="text-zinc-500 italic text-xs">{s.duration} min</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-zinc-800 flex justify-between items-center">
                            <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">Expert: {bookingData.barberId === 'any' ? "Premier Libre" : selectedBarber?.full_name}</span>
                            <span className="text-white font-black text-3xl italic">{totalPrice} MAD</span>
                        </div>
                        <div className="bg-white/5 text-gold p-4 rounded-xl mt-8 text-center font-black uppercase text-[10px] tracking-widest italic border border-white/5">
                            Le {bookingData.date ? formatDateLabel(bookingData.date) : ''} à {bookingData.time}
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                  <button onClick={confirmBooking} disabled={isSubmitting} className="bg-gold text-black px-8 py-6 rounded-3xl font-black uppercase text-sm tracking-widest w-full hover:scale-[1.02] transition-all shadow-2xl shadow-gold/40">
                      {isSubmitting ? "TRANSMISSION..." : "RÉSERVER MA SÉANCE"}
                  </button>
                </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" {...stepVariants} className="text-center py-24">
                <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-10 text-gold border border-gold/20 shadow-2xl shadow-gold/20">
                    <CheckCircle2 size={64} />
                </div>
                <h2 className="text-5xl font-black text-white uppercase italic mb-6">RDV VALIDÉ !</h2>
                <p className="text-zinc-500 mb-16 max-w-sm mx-auto uppercase text-[10px] font-bold tracking-[0.3em] leading-loose">Merci {bookingData.firstName}, votre séance est planifiée. Merci de confirmer sur WhatsApp.</p>
                <a href={getWhatsAppLink()} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white px-14 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest inline-flex items-center gap-4 shadow-2xl hover:scale-105 transition-all">
                    Finaliser sur WhatsApp
                </a>
                <div className="mt-16">
                   <Link to="/" className="text-zinc-800 hover:text-gold transition-colors font-black uppercase text-[9px] tracking-[0.6em]">Retour au site</Link>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booking;