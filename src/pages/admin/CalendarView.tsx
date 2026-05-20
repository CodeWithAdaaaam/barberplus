import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format, parseISO, differenceInMinutes, addMinutes, addDays, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, RefreshCw, Plus, X } from 'lucide-react';

const PIXELS_PER_HOUR = 100;
const SNAP_MINUTES = 15;

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
  // --- ETATS ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [settings] = useState({ start_hour: 9, end_hour: 21 }); 
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Drag & Drop
  const [draggedAppt, setDraggedAppt] = useState<Booking | null>(null);

  // Modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    clientName: '', clientPhone: '', serviceId: '', barberId: '', startTime: ''
  });

  // --- CHARGEMENT DES DONNEES ---
  const loadData = async () => {
    setIsRefreshing(true);
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
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('calendar-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Booking' }, () => {
        loadData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentDate]);

  // --- NAVIGATION ---
  const handlePrevDay = () => setCurrentDate(prev => addDays(prev, -1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  // --- LOGIQUE DRAG & DROP ---
  const handleDragStart = (e: React.DragEvent, appt: Booking) => {
    setDraggedAppt(appt);
  };

  const handleDrop = async (e: React.DragEvent, barberId: string) => {
    e.preventDefault();
    if (!draggedAppt) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top + e.currentTarget.scrollTop;
    const minutesFromStart = (offsetY / PIXELS_PER_HOUR) * 60;
    const snappedMinutes = Math.round(minutesFromStart / SNAP_MINUTES) * SNAP_MINUTES;

    const newStart = new Date(currentDate);
    newStart.setHours(settings.start_hour, 0, 0, 0);
    const finalDate = addMinutes(newStart, snappedMinutes);

    const { error } = await supabase
      .from('Booking')
      .update({ 
        startTime: finalDate.toISOString(), 
        barberId: barberId 
      })
      .eq('id', draggedAppt.id);

    if (error) alert("Erreur de déplacement : " + error.message);
    setDraggedAppt(null);
  };

  // --- GESTION MODALE ---
  const openNewModal = () => {
    setEditingAppt(null);
    setFormData({
      clientName: '',
      clientPhone: '',
      serviceId: services[0]?.id || '',
      barberId: barbers[0]?.id || '',
      startTime: format(new Date(), 'HH:mm')
    });
    setIsModalOpen(true);
  };

  const openEditModal = (appt: Booking) => {
    setEditingAppt(appt);
    setFormData({
      clientName: appt.clientName,
      clientPhone: appt.clientPhone,
      serviceId: appt.serviceId,
      barberId: appt.barberId,
      startTime: format(parseISO(appt.startTime), 'HH:mm')
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

    if (editingAppt) {
      // MISE À JOUR
      const { error } = await supabase.from('Booking').update(payload).eq('id', editingAppt.id);
      if (error) alert(error.message);
      else setIsModalOpen(false);
    } else {
      // INSERTION
      const { error } = await supabase.from('Booking').insert([payload]);
      if (error) alert(error.message);
      else setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce rendez-vous ?")) {
      const { error } = await supabase.from('Booking').delete().eq('id', id);
      if (error) alert(error.message);
      else setIsModalOpen(false);
    }
  };

  // --- CALCULS VISUELS ---
  const getTop = (startTime: string) => {
    const date = parseISO(startTime);
    const dayStart = new Date(date);
    dayStart.setHours(settings.start_hour, 0, 0, 0);
    return (differenceInMinutes(date, dayStart) / 60) * PIXELS_PER_HOUR;
  };

  const getHeight = (duration: number) => {
    return (duration / 60) * PIXELS_PER_HOUR;
  };

  if (loading) return <div className="p-20 text-center text-gold">Chargement du calendrier...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative shadow-2xl">
      
      {/* HEADER */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-md z-30 text-white">
        <div className="flex items-center gap-4">
            <div className="flex items-center bg-black rounded-lg p-1 border border-zinc-800">
                <button onClick={handlePrevDay} className="p-1 hover:text-gold transition-colors"><ChevronLeft size={20}/></button>
                <button onClick={handleToday} className="px-3 text-xs font-bold uppercase tracking-widest border-x border-zinc-800">Aujourd'hui</button>
                <button onClick={handleNextDay} className="p-1 hover:text-gold transition-colors"><ChevronRight size={20}/></button>
            </div>
            <h1 className="text-xl font-display font-bold capitalize">
                {format(currentDate, 'EEEE d MMMM', { locale: fr })}
            </h1>
        </div>

        <div className="flex items-center gap-4">
            <button onClick={loadData} className={`text-gold ${isRefreshing ? 'animate-spin' : ''}`}><RefreshCw size={20} /></button>
            <button onClick={openNewModal} className="bg-gold text-black px-4 py-2 rounded-lg hover:bg-white transition font-bold flex items-center gap-2 text-sm shadow-gold-lg">
                <Plus size={18} /> Nouveau RDV
            </button>
        </div>
      </div>

      {/* ZONE DE GRILLE */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Colonne Heures */}
        <div className="w-20 border-r border-zinc-800 bg-zinc-900/20 flex-shrink-0 overflow-hidden">
            <div className="h-12 border-b border-zinc-800"></div> 
            {Array.from({ length: settings.end_hour - settings.start_hour + 1 }).map((_, i) => (
                <div key={i} className="text-[10px] text-zinc-500 text-center font-bold" style={{ height: `${PIXELS_PER_HOUR}px`, paddingTop: '10px' }}>
                    {settings.start_hour + i}:00
                </div>
            ))}
        </div>

        {/* Colonnes Barbiers */}
        <div className="flex-1 flex overflow-x-auto relative">
            {barbers.map(barber => (
                <div 
                    key={barber.id} 
                    className="flex-1 border-r border-zinc-800 min-w-[220px] relative group"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, barber.id)}
                >
                    {/* Header Barbier */}
                    <div className="h-12 border-b border-zinc-800 bg-zinc-900/80 sticky top-0 z-20 flex items-center justify-center font-bold text-gold uppercase tracking-widest text-xs">
                        {barber.full_name}
                    </div>

                    {/* Grille de fond */}
                    <div className="absolute inset-0 pointer-events-none">
                         {Array.from({ length: settings.end_hour - settings.start_hour + 1 }).map((_, i) => (
                            <div key={i} className="border-b border-zinc-900/50" style={{ height: `${PIXELS_PER_HOUR}px` }}></div>
                        ))}
                    </div>

                    {/* Rendez-vous */}
                    <div className="relative" style={{ height: `${(settings.end_hour - settings.start_hour) * PIXELS_PER_HOUR}px` }}>
                        {appointments
                            .filter(appt => appt.barberId === barber.id)
                            .map(appt => (
                                <div
                                    key={appt.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, appt)}
                                    onClick={(e) => { e.stopPropagation(); openEditModal(appt); }}
                                    className="absolute left-2 right-2 rounded-lg p-2 text-[11px] shadow-xl border-l-4 cursor-pointer hover:brightness-125 transition-all overflow-hidden z-10"
                                    style={{
                                        top: `${getTop(appt.startTime)}px`,
                                        height: `${getHeight(appt.duration)}px`,
                                        backgroundColor: '#18181b', 
                                        borderColor: '#C9A84C', 
                                        color: 'white',
                                        borderWidth: '1px',
                                        borderLeftWidth: '4px'
                                    }}
                                >
                                    <div className="font-bold text-gold">{format(parseISO(appt.startTime), 'HH:mm')}</div>
                                    <div className="font-medium truncate">{appt.clientName}</div>
                                    <div className="text-[10px] text-zinc-500 truncate">{appt.Service?.title}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* MODALE D'ÉDITION / CRÉATION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/50">
                    <h3 className="font-bold text-white uppercase tracking-widest text-sm">
                      {editingAppt ? 'Modifier le RDV' : 'Nouveau Rendez-vous'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-500 hover:text-white" /></button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Nom du client</label>
                        <input required className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-gold" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Téléphone</label>
                        <input required className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-gold" value={formData.clientPhone} onChange={e => setFormData({...formData, clientPhone: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Prestation</label>
                            <select className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none" value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})}>
                                {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Coiffeur</label>
                            <select className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none" value={formData.barberId} onChange={e => setFormData({...formData, barberId: e.target.value})}>
                                {barbers.map(b => <option key={b.id} value={b.id}>{b.full_name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Heure</label>
                        <input type="time" className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-gold" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                    </div>

                    <div className="pt-4 flex gap-3">
                        {editingAppt && (
                             <button type="button" onClick={() => handleDelete(editingAppt.id)} className="flex-1 border border-red-500/50 text-red-500 p-3 rounded-lg hover:bg-red-500 hover:text-white transition font-bold">Supprimer</button>
                        )}
                        <button type="submit" className="flex-1 bg-gold text-black p-3 rounded-lg font-bold hover:bg-white transition">
                          {editingAppt ? 'Mettre à jour' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}