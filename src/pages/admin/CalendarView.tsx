import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { format, parseISO, differenceInMinutes, addDays, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const PIXELS_PER_HOUR = 120; 

interface Barber {
  id: string;
  full_name: string;
  display_order: number;
}

interface Service {
  id: string;
  title: string;
  price: number;
  duration: number;
  category?: string;
}

interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  barberId: string;
  startTime: string;
  duration: number;
  totalPrice: number;
  Service?: { title: string; price: number; duration: number };
  Barber?: { full_name: string };
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [settings] = useState({ start_hour: 9, end_hour: 21 }); 
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    clientName: '', clientPhone: '', serviceId: '', barberId: '', startTime: ''
  });

  const loadData = async () => {
    const start = startOfDay(currentDate).toISOString();
    const end = endOfDay(currentDate).toISOString();

    const [resBarbers, resServices, resBookings] = await Promise.all([
      supabase.from('Barber').select('*').order('display_order', { ascending: true }),
      supabase.from('Service').select('*'),
      supabase.from('Booking')
        .select('*, Service(title, price, duration), Barber(full_name)')
        .gte('startTime', start)
        .lte('startTime', end)
    ]);

    if (resBarbers.data) setBarbers(resBarbers.data);
    if (resServices.data) setServices(resServices.data);
    if (resBookings.data) setAppointments(resBookings.data);
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, [currentDate]);

  const getTop = (startTime: string) => {
    const date = parseISO(startTime);
    const dayStart = new Date(date);
    dayStart.setHours(settings.start_hour, 0, 0, 0);
    return (differenceInMinutes(date, dayStart) / 60) * PIXELS_PER_HOUR;
  };

  const getHeight = (duration: number) => {
    return (duration / 60) * PIXELS_PER_HOUR;
  };

  const getCurrentTimeTop = () => {
    const dayStart = new Date(now);
    dayStart.setHours(settings.start_hour, 0, 0, 0);
    const diff = differenceInMinutes(now, dayStart);
    if (diff < 0 || diff > (settings.end_hour - settings.start_hour) * 60) return null;
    return (diff / 60) * PIXELS_PER_HOUR;
  };

  const handlePrevDay = () => setCurrentDate(prev => addDays(prev, -1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  const openNewModal = () => {
    setEditingAppt(null);
    setFormData({
      clientName: '', clientPhone: '',
      serviceId: services[0]?.id || '',
      barberId: barbers[0]?.id || '',
      startTime: format(new Date(), 'HH:mm')
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const fullStartTime = `${dateStr}T${formData.startTime}:00`;
    const selectedService = services.find(s => s.id === formData.serviceId);

    const payload = {
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      barberId: formData.barberId,
      serviceId: formData.serviceId,
      startTime: fullStartTime,
      duration: selectedService?.duration || 30,
      totalPrice: selectedService?.price || 0
    };

    const { error } = editingAppt 
      ? await supabase.from('Booking').update(payload).eq('id', editingAppt.id)
      : await supabase.from('Booking').insert([payload]);

    if (!error) {
      setIsModalOpen(false);
      loadData();
    }
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-gold font-display text-2xl animate-pulse">CHARGEMENT DE L'AGENDA...</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white font-sans">
      
      {/* HEADER DATE */}
      <div className="bg-zinc-900/30 border-b border-white/5 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-3 text-gold mb-2">
            <CalendarIcon size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Agenda de la Maison</span>
          </div>
          <h1 className="text-5xl font-display uppercase italic tracking-tighter">
            {format(currentDate, 'EEEE d MMMM', { locale: fr })}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-black border border-zinc-800 rounded-2xl p-1">
            <button onClick={handlePrevDay} className="p-3 hover:text-gold transition-colors"><ChevronLeft size={24}/></button>
            <button onClick={handleToday} className="px-6 text-[10px] font-black uppercase tracking-widest border-x border-zinc-800 hover:bg-zinc-900 transition-colors">Aujourd'hui</button>
            <button onClick={handleNextDay} className="p-3 hover:text-gold transition-colors"><ChevronRight size={24}/></button>
          </div>
          <button onClick={openNewModal} className="bg-gold text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-gold/20 hover:scale-105 transition-all">
            Nouveau RDV
          </button>
        </div>
      </div>

      {/* CALENDRIER */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="w-20 border-r border-white/5 bg-black z-20 flex-shrink-0">
          <div className="h-16 border-b border-white/5" />
          <div className="relative h-full overflow-hidden">
            {Array.from({ length: settings.end_hour - settings.start_hour }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-start text-[10px] font-black text-zinc-600 tracking-tighter" style={{ height: `${PIXELS_PER_HOUR}px`, paddingTop: '10px' }}>
                  {(settings.start_hour + i).toString().padStart(2, '0')}:00
                </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto bg-zinc-950/50 relative" ref={scrollContainerRef}>
          <div className="sticky top-0 z-30 flex border-b border-white/5 bg-black/90 backdrop-blur-md">
            {barbers.map(barber => (
              <div key={barber.id} className="min-w-[250px] flex-1 py-5 px-4 text-center border-r border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">{barber.full_name}</span>
              </div>
            ))}
          </div>

          <div className="relative flex" style={{ height: `${(settings.end_hour - settings.start_hour) * PIXELS_PER_HOUR}px` }}>
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: (settings.end_hour - settings.start_hour) * 2 }).map((_, i) => (
                <div key={i} className={`border-b ${i % 2 === 0 ? 'border-white/5' : 'border-white/[0.02]'}`} style={{ height: `${PIXELS_PER_HOUR / 2}px` }} />
              ))}
            </div>

            {getCurrentTimeTop() !== null && (
              <div className="absolute left-0 right-0 z-40 flex items-center pointer-events-none" style={{ top: `${getCurrentTimeTop()}px` }}>
                <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
                <div className="flex-1 h-[1px] bg-red-500/50" />
              </div>
            )}

            {barbers.map(barber => (
              <div key={barber.id} className="min-w-[250px] flex-1 border-r border-white/5 relative">
                {appointments
                  .filter(appt => appt.barberId === barber.id)
                  .map(appt => (
                    <motion.div
                      key={appt.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => { 
                        setEditingAppt(appt); 
                        setFormData({
                            clientName: appt.clientName, 
                            clientPhone: appt.clientPhone,
                            serviceId: appt.serviceId, 
                            barberId: appt.barberId,
                            startTime: format(parseISO(appt.startTime), 'HH:mm')
                        }); 
                        setIsModalOpen(true); 
                      }}
                      className="absolute left-3 right-3 rounded-2xl p-4 border border-gold/30 bg-zinc-900/90 shadow-2xl cursor-pointer group hover:border-gold transition-all z-10 overflow-hidden"
                      style={{ top: `${getTop(appt.startTime)}px`, height: `${getHeight(appt.duration)}px` }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-gold uppercase tracking-widest">{format(parseISO(appt.startTime), 'HH:mm')}</span>
                        <Clock size={10} className="text-zinc-600 group-hover:text-gold" />
                      </div>
                      <div className="font-bold text-sm uppercase tracking-tight truncate text-white">{appt.clientName}</div>
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter truncate mt-1">{appt.Service?.title}</div>
                    </motion.div>
                  ))
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6 backdrop-blur-xl">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 rounded-[3rem] border border-zinc-800 p-10 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-display uppercase italic">{editingAppt ? 'Détails du RDV' : 'Nouvelle Réservation'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={30}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6 text-black">
              <input required placeholder="NOM DU CLIENT" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value.toUpperCase()})} />
              <input required placeholder="NUMÉRO DE TÉLÉPHONE" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold" value={formData.clientPhone} onChange={e => setFormData({...formData, clientPhone: e.target.value})} />
              <div className="grid grid-cols-2 gap-4 text-black">
                <select className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold text-xs uppercase" value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})}>
                  {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                <select className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold text-xs uppercase" value={formData.barberId} onChange={e => setFormData({...formData, barberId: e.target.value})}>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.full_name}</option>)}
                </select>
              </div>
              <input type="time" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-black text-xl text-center" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
              <button type="submit" className="w-full bg-gold text-black p-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-gold/20 hover:bg-white transition-all">
                {editingAppt ? 'Mettre à jour' : 'Confirmer le RDV'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
