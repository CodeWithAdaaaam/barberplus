import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trash2, Phone, Calendar, Clock, User, Scissors, RefreshCw, Lock } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  startTime: string;
  note: string;
  barber?: { full_name: string };
  service?: { title: string };
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState(""); // Pour le formulaire
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const SECRET_PASSWORD = "Barber2024"; // TON MOT DE PASSE ICI

  // Vérifier si déjà connecté au chargement
  useEffect(() => {
    const saved = localStorage.getItem("admin_auth");
    if (saved === SECRET_PASSWORD) {
      setIsAuthenticated(true);
    }
  }, []);

  // Charger les bookings quand on est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      
      const channel = supabase
        .channel("admin-bookings")
        .on("postgres_changes", { event: "*", schema: "public", table: "Booking" }, () => {
          fetchBookings();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Booking")
      .select(`*, barber:Barber(full_name), service:Service(title)`)
      .order("startTime", { ascending: true });

    if (!error) setBookings(data || []);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) {
      localStorage.setItem("admin_auth", SECRET_PASSWORD);
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const deleteBooking = async (id: string) => {
  if (!window.confirm("Voulez-vous vraiment supprimer ce rendez-vous ?")) return;

  try {
    const { error, status } = await supabase
      .from('Booking')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erreur Supabase:", error);
      alert("Erreur : " + error.message);
    } else {
      console.log("Suppression réussie, statut:", status);
      // Recharger les données après suppression
      loadData(); 
    }
  } catch (err) {
    console.error("Erreur système:", err);
  }
};

  // --- RENDU 1 : SI PAS AUTHENTIFIÉ, MONTRER LE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
            <Lock size={30} />
          </div>
          <h1 className="text-2xl font-display text-white mb-6">Accès Administration</h1>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-black border border-zinc-800 p-4 rounded-lg text-white mb-4 outline-none focus:border-gold transition-all"
            autoFocus
          />
          <button type="submit" className="w-full bg-gold text-black font-bold py-4 rounded-lg hover:bg-white transition-all">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  // --- RENDU 2 : LE DASHBOARD (SI AUTHENTIFIÉ) ---
  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-display text-4xl text-white">Backoffice</h1>
            <p className="text-gold uppercase tracking-widest text-sm">Gestion des rendez-vous</p>
          </div>
          <button onClick={fetchBookings} className="p-3 bg-zinc-900 border border-zinc-800 rounded-full text-gold">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="grid gap-6">
          {bookings.map((b) => (
            <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-gold/50 transition-all shadow-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <User size={18} className="text-gold" />
                  <span className="text-xl font-bold text-white">{b.clientName}</span>
                </div>
                <a href={`tel:${b.clientPhone}`} className="text-gray-400 hover:text-gold flex items-center gap-2">
                  <Phone size={14} /> {b.clientPhone}
                </a>
              </div>

              <div className="flex-1 bg-black/40 p-4 rounded-lg border border-zinc-800 w-full">
                <div className="flex items-center gap-2 text-gold mb-1 italic text-xs uppercase font-bold">
                  <Scissors size={14} /> Services
                </div>
                <p className="text-white text-sm">{b.note ? b.note.replace('Services sélectionnés: ', '') : b.service?.title}</p>
                <p className="text-xs text-gray-500 mt-2 italic">Expert: {b.barber?.full_name}</p>
              </div>

              <div className="flex flex-col items-start md:items-end min-w-[150px]">
                <div className="text-white font-bold text-lg flex items-center gap-2">
                  <Calendar size={16} className="text-gold" />
                  {format(new Date(b.startTime), 'dd MMM', { locale: fr })}
                </div>
                <div className="text-3xl font-display text-white mt-1">
                  {format(new Date(b.startTime), 'HH:mm')}
                </div>
              </div>

              <button onClick={() => deleteBooking(b.id)} className="p-4 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {bookings.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-500 border border-dashed border-zinc-800 rounded-xl">
              Aucune réservation pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;