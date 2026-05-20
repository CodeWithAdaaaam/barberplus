import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Trash2, X, Pencil, Upload, Loader2, Scissors,
  User, Clock, Save, Check, Sparkles, Plus
} from 'lucide-react';

export default function Settings() {
  // --- ETATS ---
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBarberModal, setShowBarberModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingBarberId, setEditingBarberId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- TES NOUVELLES SPÉCIALITÉS ---
  const AVAILABLE_SPECIALTIES = [
    'COIFFURE',
    'COLORISTE/PROTÉINE',
    'MANICURE/PÉDICURE'
  ];

  // Formulaires
  const [formDataBarber, setFormDataBarber] = useState({
    full_name: '',
    bio: '',
    instagram_link: '',
    avatar_url: '',
    display_order: 1,
    specialties: [] as string[] // Bien vérifier cette ligne
  });

  const [newService, setNewService] = useState({ title: '', price: 0, duration: 30, color_code: '#C9A84C' });
  const [salonSettings, setSalonSettings] = useState({ start_hour: 9, end_hour: 21 });

  // --- CHARGEMENT ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [resServices, resBarbers] = await Promise.all([
        supabase.from('Service').select('*').order('price', { ascending: false }),
        supabase.from('Barber').select('*').order('display_order', { ascending: true })
      ]);
      if (resServices.data) setServices(resServices.data);
      if (resBarbers.data) setBarbers(resBarbers.data);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- LOGIQUE SPÉCIALITÉS ---
  const toggleSpecialty = (spec: string) => {
    setFormDataBarber(prev => {
      const isSelected = prev.specialties.includes(spec);
      if (isSelected) {
        return { ...prev, specialties: prev.specialties.filter(s => s !== spec) };
      } else {
        return { ...prev, specialties: [...prev.specialties, spec] };
      }
    });
  };

  // --- LOGIQUE PHOTO ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `barbers/${fileName}`;
    setIsUploading(true);
    try {
      const { error: uploadError } = await supabase.storage.from('barber-photos').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('barber-photos').getPublicUrl(filePath);
      setFormDataBarber(prev => ({ ...prev, avatar_url: data.publicUrl }));
    } catch (error: any) {
      alert("Erreur upload : " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // --- LOGIQUE BARBIERS ---
  const handleSaveBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBarberId) {
        await supabase.from('Barber').update(formDataBarber).eq('id', editingBarberId);
      } else {
        await supabase.from('Barber').insert([formDataBarber]);
      }
      setShowBarberModal(false);
      loadData();
    } catch (err: any) { alert("Erreur: " + err.message); }
  };

  const deleteBarber = async (id: string) => {
    if (confirm("Supprimer cet expert ?")) {
      await supabase.from('Barber').delete().eq('id', id);
      loadData();
    }
  };

  // --- LOGIQUE SERVICES ---
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('Service').insert([newService]);
      setShowServiceModal(false);
      setNewService({ title: '', price: 0, duration: 30, color_code: '#C9A84C' });
      loadData();
    } catch (err: any) { alert("Erreur service: " + err.message); }
  };

  const deleteService = async (id: string) => {
    if (confirm("Supprimer ?")) {
      await supabase.from('Service').delete().eq('id', id);
      loadData();
    }
  };

  const colors = ['#C9A84C', '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Configuration <span className="text-gold">Maison</span></h2>
          <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase mt-2">Hay Riad • Prestige & Excellence</p>
        </div>
        <div className="flex gap-4 bg-zinc-900 p-2 rounded-2xl border border-zinc-800 shadow-2xl self-start">
          <div className="flex items-center gap-3 px-4">
            <Clock size={18} className="text-gold" />
            <input type="number" value={salonSettings.start_hour} onChange={e => setSalonSettings({ ...salonSettings, start_hour: parseInt(e.target.value) })} className="w-10 bg-transparent text-white font-black outline-none text-xl" />
            <span className="text-zinc-700 font-bold">À</span>
            <input type="number" value={salonSettings.end_hour} onChange={e => setSalonSettings({ ...salonSettings, end_hour: parseInt(e.target.value) })} className="w-10 bg-transparent text-white font-black outline-none text-xl" />
          </div>
          <button className="bg-gold text-black p-3.5 rounded-xl hover:bg-white transition-all shadow-lg shadow-gold/20 active:scale-95">
            <Save size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* SECTION BARBIERS (EXPERTS) */}
        <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black flex items-center gap-3 text-white uppercase italic tracking-widest">
              <User size={24} className="text-gold" /> L'Élite
            </h3>
            <button
              onClick={() => {
                setEditingBarberId(null);
                setFormDataBarber({ full_name: '', bio: '', instagram_link: '', avatar_url: '', display_order: barbers.length + 1, specialties: [] });
                setShowBarberModal(true);
              }}
              className="bg-gold text-black text-[10px] font-black px-6 py-2.5 rounded-full hover:bg-white transition uppercase tracking-widest shadow-lg shadow-gold/10"
            >
              + Ajouter un Expert
            </button>
          </div>

          <div className="space-y-4">
            {barbers.map(barber => (
              <div key={barber.id} className="flex items-center justify-between p-6 bg-black/40 border border-zinc-800 rounded-[2rem] group hover:border-gold/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img src={barber.avatar_url || `https://ui-avatars.com/api/?name=Expert&background=C9A84C&color=000`} className="w-16 h-16 rounded-2xl object-cover border border-zinc-800" />
                    <div className="absolute -bottom-2 -right-2 bg-gold text-black p-1 rounded-md">
                      <Sparkles size={10} fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-black text-white uppercase tracking-tight text-lg">{barber.full_name}</p>

                    {/* Affichage forcé des spécialités */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {barber.specialties && barber.specialties.length > 0 ? (
                        barber.specialties.map((s: string) => (
                          <span key={s} className="text-[7px] font-black bg-gold text-black px-2 py-0.5 rounded border border-gold uppercase">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[7px] text-zinc-700 uppercase italic">Aucune spécialité définie</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setEditingBarberId(barber.id);
                    // TRÈS IMPORTANT : On force la récupération des spécialités ou un tableau vide
                    setFormDataBarber({
                      full_name: barber.full_name || '',
                      bio: barber.bio || '',
                      instagram_link: barber.instagram_link || '',
                      avatar_url: barber.avatar_url || '',
                      display_order: barber.display_order || 1,
                      specialties: barber.specialties || []
                    });
                    setShowBarberModal(true);
                  }} className="p-3 text-zinc-700 hover:text-gold transition-colors">
                    <Pencil size={20} />
                  </button>
                  <button onClick={() => deleteBarber(barber.id)} className="p-3 text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION SERVICES */}
        <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black flex items-center gap-3 text-white uppercase italic tracking-widest">
              <Scissors size={24} className="text-gold" /> Catalogue
            </h3>
            <button onClick={() => setShowServiceModal(true)} className="border border-gold/30 text-gold text-[10px] font-black px-6 py-2.5 rounded-full hover:bg-gold hover:text-black transition uppercase tracking-widest">
              + Nouveau Service
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {services.map(service => (
              <div key={service.id} className="flex items-center justify-between p-5 bg-black/40 border border-zinc-800 rounded-[1.5rem] group">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: service.color_code }}></div>
                  <div>
                    <p className="font-black text-white uppercase leading-none text-base">{service.title}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-[0.2em]">{service.duration} MIN • <span className="text-gold">{service.price} MAD</span></p>
                  </div>
                </div>
                <button onClick={() => deleteService(service.id)} className="p-3 text-zinc-800 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALE BARBIER (AVEC TES 3 NOUVELLES SPÉCIALITÉS) */}
      {showBarberModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-6 backdrop-blur-xl">
          <div className="bg-zinc-900 rounded-[3rem] border border-zinc-800 p-10 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-black text-white uppercase italic">Profil Expert</h3>
              <button onClick={() => setShowBarberModal(false)} className="text-zinc-600 hover:text-white"><X size={30} /></button>
            </div>

            <form onSubmit={handleSaveBarber} className="space-y-6">
              <div className="flex justify-center mb-6">
                <label className="relative cursor-pointer group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-zinc-800 group-hover:border-gold transition-all flex items-center justify-center bg-black shadow-2xl">
                    {isUploading ? <Loader2 className="animate-spin text-gold" /> : (
                      <img src={formDataBarber.avatar_url || `https://ui-avatars.com/api/?name=Expert&background=C9A84C&color=fff`} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="text-white" />
                  </div>
                  <input type="file" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <input required placeholder="NOM DE L'EXPERT" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold text-sm" value={formDataBarber.full_name} onChange={e => setFormDataBarber({ ...formDataBarber, full_name: e.target.value })} />

              {/* NOUVELLE SÉLECTION DES SPÉCIALITÉS */}
              <div className="space-y-4 bg-black/30 p-6 rounded-3xl border border-zinc-800/50">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Domaines d'Expertise</label>
                <div className="flex flex-col gap-2">
                  {AVAILABLE_SPECIALTIES.map(spec => {
                    const active = formDataBarber.specialties.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={`flex justify-between items-center px-5 py-4 rounded-2xl text-[10px] font-black transition-all border ${active
                          ? 'bg-gold/10 border-gold text-gold shadow-lg shadow-gold/5'
                          : 'bg-black/50 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                          }`}
                      >
                        {spec}
                        {active ? <Check size={14} strokeWidth={4} /> : <Plus size={14} className="opacity-20" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-600 uppercase font-black ml-4">Ordre d'affichage</label>
                  <input type="number" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold" value={formDataBarber.display_order} onChange={e => setFormDataBarber({ ...formDataBarber, display_order: parseInt(e.target.value) })} />
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={isUploading} className="w-full bg-gold text-black p-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl shadow-gold/20">Enregistrer</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE SERVICE */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-6 backdrop-blur-xl">
          <div className="bg-zinc-900 rounded-[3rem] border border-zinc-800 p-10 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-black text-white uppercase italic">Nouvelle Prestation</h3>
              <button onClick={() => setShowServiceModal(false)} className="text-zinc-600 hover:text-white"><X size={30} /></button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-6">
              <input required placeholder="TITRE (ex: Gentlemen Cut)" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="PRIX (MAD)" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold" value={newService.price || ''} onChange={e => setNewService({ ...newService, price: parseInt(e.target.value) })} />
                <input required type="number" placeholder="DURÉE (MIN)" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white outline-none focus:border-gold font-bold" value={newService.duration || ''} onChange={e => setNewService({ ...newService, duration: parseInt(e.target.value) })} />
              </div>
              <div className="flex gap-3 justify-center p-5 bg-black rounded-3xl border border-zinc-800">
                {colors.map(c => (
                  <button key={c} type="button" onClick={() => setNewService({ ...newService, color_code: c })} className={`w-8 h-8 rounded-full border-2 transition-all ${newService.color_code === c ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
              <button type="submit" className="w-full bg-gold text-black p-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-gold/20 mt-4">Créer la prestation</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}