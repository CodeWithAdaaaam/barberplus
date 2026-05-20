import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Phone, User, Calendar, History, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Client {
  id: string;
  full_name: string;
  phone: string;
  total_visits: number;
  last_visit: string;
  notes: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchAndProcessClients() {
      setLoading(true);
      // On récupère tous les bookings pour construire la base client
      const { data, error } = await supabase
        .from('Booking')
        .select('*')
        .order('startTime', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        // Groupement par téléphone (identifiant unique du client)
        const clientMap = new Map<string, Client>();

        (data || []).forEach(booking => {
          const phone = booking.clientPhone;
          if (!clientMap.has(phone)) {
            clientMap.set(phone, {
              id: booking.id,
              full_name: booking.clientName,
              phone: phone,
              total_visits: 0,
              last_visit: booking.startTime,
              notes: booking.note || ""
            });
          }
          const client = clientMap.get(phone)!;
          client.total_visits += 1;
          // Comme c'est trié par date DESC, le premier qu'on croise est le plus récent
        });

        setClients(Array.from(clientMap.values()));
      }
      setLoading(false);
    }

    fetchAndProcessClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col">
      {/* HEADER & RECHERCHE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <User className="text-gold" /> Base Clients
          </h2>
          <p className="text-gray-500 text-sm italic">{clients.length} clients enregistrés</p>
        </div>

        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
                type="text" 
                placeholder="Rechercher un nom ou un numéro..." 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* TABLEAU DES CLIENTS */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
              <thead className="bg-black/40 border-b border-zinc-800">
                  <tr>
                      <th className="p-5 font-medium text-gold text-xs uppercase tracking-widest">Client</th>
                      <th className="p-5 font-medium text-gold text-xs uppercase tracking-widest">Coordonnées</th>
                      <th className="p-5 font-medium text-gold text-xs uppercase tracking-widest text-center">Visites</th>
                      <th className="p-5 font-medium text-gold text-xs uppercase tracking-widest">Dernière visite</th>
                      <th className="p-5 font-medium text-gold text-xs uppercase tracking-widest">Notes / Services habituels</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                  {loading ? (
                      <tr><td colSpan={5} className="p-10 text-center text-zinc-500 italic">Analyse de la base de données...</td></tr>
                  ) : filteredClients.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center text-zinc-600">Aucun client trouvé.</td></tr>
                  ) : (
                      filteredClients.map((client) => (
                          <tr key={client.phone} className="hover:bg-white/5 transition-colors group">
                              <td className="p-5">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-gold font-bold">
                                          {client.full_name.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="font-bold text-white text-lg">{client.full_name}</span>
                                  </div>
                              </td>
                              <td className="p-5">
                                  <div className="flex flex-col gap-1">
                                      <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-zinc-300 hover:text-gold transition-colors text-sm font-medium">
                                          <Phone size={14} className="text-gold" /> {client.phone}
                                      </a>
                                  </div>
                              </td>
                              <td className="p-5 text-center">
                                  <div className="inline-flex items-center gap-1.5 bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-black border border-gold/20">
                                      <History size={12}/> {client.total_visits}
                                  </div>
                              </td>
                              <td className="p-5">
                                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                                      <Calendar size={14} />
                                      {client.last_visit ? format(new Date(client.last_visit), 'dd MMM yyyy', { locale: fr }) : '-'}
                                  </div>
                              </td>
                              <td className="p-5">
                                  <div className="flex items-start gap-2 max-w-xs">
                                      <MessageSquare size={14} className="text-zinc-600 mt-1 shrink-0" />
                                      <span className="text-xs text-zinc-500 italic line-clamp-2">
                                          {client.notes || "Pas de note particulière"}
                                      </span>
                                  </div>
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