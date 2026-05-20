import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  format, 
  startOfDay, 
  endOfDay, 
  startOfMonth, 
  endOfMonth,
} from 'date-fns';
import { 
  TrendingUp, 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Clock,
  ChevronRight,
  Scissors
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingBooking {
  id: string;
  startTime: string;
  clientName: string;
  Service?: { title: string };
  Barber?: { full_name: string };
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayRev: 0,
    todayCount: 0,
    monthRev: 0,
    totalClients: 0
  });
  const [upcoming, setUpcoming] = useState<UpcomingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const today = new Date();
      const tStart = startOfDay(today).toISOString();
      const tEnd = endOfDay(today).toISOString();
      const mStart = startOfMonth(today).toISOString();
      const mEnd = endOfMonth(today).toISOString();

      const [resToday, resMonth, resAll] = await Promise.all([
        supabase.from('Booking').select('totalPrice').gte('startTime', tStart).lte('startTime', tEnd),
        supabase.from('Booking').select('totalPrice').gte('startTime', mStart).lte('startTime', mEnd),
        supabase.from('Booking').select('clientPhone')
      ]);

      // Calculs Today
      const tRev = resToday.data?.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0) || 0;
      const mRev = resMonth.data?.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0) || 0;  
      const tCount = resToday.data?.length || 0;

      // Calculs Month
      

      // Clients Uniques
      const uniqueClients = new Set(resAll.data?.map(b => b.clientPhone)).size;

      setStats({
        todayRev: tRev,
        todayCount: tCount,
        monthRev: mRev,
        totalClients: uniqueClients
      });

      // Prochains RDV (ceux qui ne sont pas encore passés aujourd'hui)
      const now = new Date().toISOString();
      const { data: next } = await supabase
        .from('Booking')
        .select('*, Service(title), Barber(full_name)')
        .gte('startTime', now)
        .order('startTime', { ascending: true })
        .limit(5);

      setUpcoming(next || []);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "RDV Aujourd'hui", value: stats.todayCount, icon: CalendarIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "CA Aujourd'hui", value: `${stats.todayRev} DH`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "CA du Mois", value: `${stats.monthRev} DH`, icon: DollarSign, color: "text-gold", bg: "bg-gold/10" },
    { title: "Total Clients", value: stats.totalClients, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  if (loading) return <div className="p-10 text-zinc-500">Analyse de l'activité...</div>;

  return (
    <div className="space-y-10">
      {/* WELCOME */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Bonjour, Chef ! 👋</h1>
        <p className="text-zinc-500">Voici ce qui se passe dans votre salon aujourd'hui.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{card.title}</p>
            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PROCHAINS RDV */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="text-gold" size={20} /> Prochains rendez-vous
            </h3>
            <Link to="/admin/calendar" className="text-xs text-gold hover:underline">Voir tout le planning</Link>
          </div>

          <div className="space-y-4">
            {upcoming.map((rdv) => (
              <div key={rdv.id} className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-xl group hover:border-gold/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-gold font-bold border border-zinc-700">
                    {format(new Date(rdv.startTime), 'HH:mm')}
                  </div>
                  <div>
                    <p className="font-bold text-white">{rdv.clientName}</p>
                    <p className="text-xs text-zinc-500">{rdv.Service?.title} • {rdv.Barber?.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 group-hover:text-gold transition-colors">
                  <span className="text-xs font-bold uppercase tracking-tighter">Détails</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <div className="text-center py-10 text-zinc-600 italic border border-dashed border-zinc-800 rounded-xl">
                Plus aucun rendez-vous pour aujourd'hui.
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS RAPIDES & INFOS */}
        <div className="space-y-6">
          <div className="bg-gold p-6 rounded-2xl shadow-gold-lg text-black">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Scissors size={20} /> Mode Admin
            </h3>
            <p className="text-sm font-medium opacity-80 mb-6">
              Gérez vos barbiers, vos prix et vos horaires en un clic.
            </p>
            <Link 
              to="/admin/settings" 
              className="block w-full bg-black text-white text-center py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"
            >
              Paramètres Salon
            </Link>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-white font-bold mb-4">Rappel Sécurité</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              N'oubliez pas de supprimer les rendez-vous annulés pour libérer les créneaux sur le calendrier public.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}