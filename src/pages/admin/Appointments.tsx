import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  format, 
  startOfDay, 
  endOfDay, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  addDays, 
  addMonths, 
  addYears 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, ArrowLeft, ArrowRight, User, Scissors, Phone } from 'lucide-react';

interface Booking {
  id: string;
  startTime: string;
  clientName: string;
  clientPhone: string;
  note: string;
  totalPrice: number;
  barber?: { full_name: string };
  service?: { title: string; price: number };
}

export default function Appointments() {
  // --- ÉTATS ---
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [filterType, setFilterType] = useState<'day' | 'month' | 'year'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- CHARGEMENT DES DONNÉES DEPUIS SUPABASE ---
  const loadData = async () => {
    setLoading(true);
    let start, end;

    if (filterType === 'day') {
      start = startOfDay(currentDate).toISOString();
      end = endOfDay(currentDate).toISOString();
    } else if (filterType === 'month') {
      start = startOfMonth(currentDate).toISOString();
      end = endOfMonth(currentDate).toISOString();
    } else {
      start = startOfYear(currentDate).toISOString();
      end = endOfYear(currentDate).toISOString();
    }

    const { data, error } = await supabase
      .from('Booking')
      .select(`
        *,
        barber:Barber(full_name),
        service:Service(title, price)
      `)
      .gte('startTime', start)
      .lte('startTime', end)
      .order('startTime', { ascending: true });

    if (!error) {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentDate, filterType]);

  // --- NAVIGATION ---
  const handlePrev = () => {
    if (filterType === 'day') setCurrentDate(addDays(currentDate, -1));
    if (filterType === 'month') setCurrentDate(addMonths(currentDate, -1));
    if (filterType === 'year') setCurrentDate(addYears(currentDate, -1));
  };

  const handleNext = () => {
    if (filterType === 'day') setCurrentDate(addDays(currentDate, 1));
    if (filterType === 'month') setCurrentDate(addMonths(currentDate, 1));
    if (filterType === 'year') setCurrentDate(addYears(currentDate, 1));
  };

  const getPeriodTitle = () => {
    if (filterType === 'day') return format(currentDate, 'dd MMMM yyyy', { locale: fr });
    if (filterType === 'month') return format(currentDate, 'MMMM yyyy', { locale: fr });
    return format(currentDate, 'yyyy', { locale: fr });
  };

  // Calcul du CA (Basé sur le prix du service lié)
    const totalRevenue = appointments.reduce((sum, rdv) => sum + (Number(rdv.totalPrice) || 0), 0);

  return (
    <div className="h-full flex flex-col">
      
      {/* EN-TÊTE ET FILTRES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2 text-white">
          <Calendar className="text-gold" /> Historique & Liste
        </h2>

        <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800 p-1 w-full md:w-auto">
           {(['day', 'month', 'year'] as const).map((type) => (
             <button 
                key={type}
                onClick={() => setFilterType(type)} 
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition ${
                    filterType === type ? 'bg-gold text-black font-bold' : 'text-gray-500 hover:text-white'
                }`}
             >
                {type === 'day' ? 'Jour' : type === 'month' ? 'Mois' : 'Année'}
             </button>
           ))}
        </div>
      </div>

      {/* NAVIGATION DE PÉRIODE & STATS */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <button onClick={handlePrev} className="p-2 bg-black hover:bg-zinc-800 rounded-full border border-zinc-800 text-gold transition-colors"><ArrowLeft size={20}/></button>
            <span className="text-lg md:text-xl font-bold capitalize min-w-[200px] text-center text-white">{getPeriodTitle()}</span>
            <button onClick={handleNext} className="p-2 bg-black hover:bg-zinc-800 rounded-full border border-zinc-800 text-gold transition-colors"><ArrowRight size={20}/></button>
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto bg-black p-4 rounded-lg justify-between border border-zinc-800">
            <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Revenus Estimés</p>
                <p className="text-xl md:text-2xl font-bold text-green-500">{totalRevenue} DH</p>
            </div>
            <div className="text-right border-l pl-6 border-zinc-800">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total RDV</p>
                <p className="text-xl md:text-2xl font-bold text-white">{appointments.length}</p>
            </div>
        </div>
      </div>

      {/* TABLEAU DES RDV */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 flex-1 overflow-hidden flex flex-col shadow-2xl">
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse"> 
                <thead className="bg-black/50 sticky top-0 z-10">
                    <tr className="border-b border-zinc-800">
                        <th className="p-4 font-medium text-gold text-xs uppercase tracking-widest">Date & Heure</th>
                        <th className="p-4 font-medium text-gold text-xs uppercase tracking-widest">Client</th>
                        <th className="p-4 font-medium text-gold text-xs uppercase tracking-widest">Prestations</th>
                        <th className="p-4 font-medium text-gold text-xs uppercase tracking-widest">Expert</th>
                        <th className="p-4 font-medium text-gold text-xs uppercase tracking-widest">Prix</th>
                        <th className="p-4 font-medium text-gold text-xs uppercase tracking-widest">Statut</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {loading ? (
                        <tr><td colSpan={6} className="p-10 text-center text-gray-500">Chargement en cours...</td></tr>
                    ) : appointments.length === 0 ? (
                        <tr><td colSpan={6} className="p-10 text-center text-gray-600 italic">Aucun rendez-vous enregistré pour cette période.</td></tr>
                    ) : (
                        appointments.map((rdv) => (
                            <tr key={rdv.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="font-bold text-white">{format(new Date(rdv.startTime), 'dd/MM/yyyy')}</div>
                                    <div className="text-sm text-gold font-display">{format(new Date(rdv.startTime), 'HH:mm')}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-gray-500" />
                                        <span className="font-medium text-white">{rdv.clientName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <Phone size={12} />
                                        <span>{rdv.clientPhone}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-start gap-2">
                                        <Scissors size={14} className="text-gold mt-1 shrink-0" />
                                        <span className="text-sm text-gray-300 max-w-[200px]">
                                            {rdv.note ? rdv.note.replace('Services sélectionnés: ', '') : rdv.service?.title}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-gold uppercase">
                                            {rdv.barber?.full_name?.charAt(0)}
                                        </div>
                                        <span className="text-sm text-gray-300">{rdv.barber?.full_name}</span>
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-white">
                                    {rdv.totalPrice || rdv.service?.price || '0'} DH
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                        Confirmé
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}