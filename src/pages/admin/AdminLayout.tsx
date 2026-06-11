import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, List, Settings, LogOut, Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();

  const SECRET_PASSWORD = "Barber2024"; 

  useEffect(() => {
    const saved = localStorage.getItem("admin_auth");
    if (saved === SECRET_PASSWORD) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) {
      localStorage.setItem("admin_auth", SECRET_PASSWORD);
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    navigate("/");
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const isActive = (path: string) => location.pathname === path;
  
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
    ${isActive(path) 
      ? 'bg-gold text-black font-bold shadow-lg shadow-gold/20' 
      : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'}
  `;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-gold border border-gold/20">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-display text-white mb-2 uppercase italic tracking-tighter">Accès <span className="text-gold">Privé</span></h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-8">Hay Riad • Administration</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="MOT DE PASSE"
            className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white mb-6 outline-none focus:border-gold transition-all text-center tracking-[0.5em] font-bold"
            autoFocus
          />
          <button type="submit" className="w-full bg-gold text-black font-black py-5 rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-xs shadow-xl shadow-gold/10">
            Entrer dans la Maison
          </button>
        </form>
      </div>
    );
  }

  return (
    // Utilisation de h-[100dvh] pour éviter les bugs de hauteur mobile
    <div className="flex flex-col md:flex-row h-[100dvh] bg-black font-sans text-white overflow-hidden">
      
      {/* MOBILE HEADER (FIXE EN HAUT) */}
      <div className="md:hidden h-20 bg-[#050505] border-b border-zinc-800 flex items-center justify-between px-6 z-[60] shrink-0">
        <div className="flex flex-col">
            <span className="font-black tracking-tighter text-lg leading-none">BARBER PLUS<span className="text-gold">.</span></span>
            <span className="text-[8px] text-gold uppercase tracking-[0.3em] mt-1 font-bold italic">Dashboard</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-zinc-900 rounded-xl text-gold border border-zinc-800">
            <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] md:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-[80] w-72 bg-[#050505] border-r border-zinc-900 flex flex-col transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="h-24 flex items-center justify-center border-b border-zinc-900 relative px-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-black tracking-tighter text-white">BARBER <span className="text-gold">PLUS.</span></h1>
            <div className="h-[1px] w-12 bg-gold mt-1 opacity-50" />
          </div>
          <button onClick={closeSidebar} className="absolute right-6 md:hidden text-zinc-600 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-3 mt-4">
          <Link to="/admin" onClick={closeSidebar} className={linkClass('/admin')}>
            <LayoutDashboard size={20} />
            <span className="font-black uppercase text-[10px] tracking-widest">Vue d'ensemble</span>
          </Link>
          
          <Link to="/admin/calendar" onClick={closeSidebar} className={linkClass('/admin/calendar')}>
            <Calendar size={20} />
            <span className="font-black uppercase text-[10px] tracking-widest">Calendrier</span>
          </Link>

          <Link to="/admin/appointments" onClick={closeSidebar} className={linkClass('/admin/appointments')}>
            <List size={20} />
            <span className="font-black uppercase text-[10px] tracking-widest">Réservations</span>
          </Link>

          <Link to="/admin/settings" onClick={closeSidebar} className={linkClass('/admin/settings')}>
            <Settings size={20} />
            <span className="font-black uppercase text-[10px] tracking-widest">Paramètres</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-zinc-900">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-6 py-4 text-red-500 w-full hover:bg-red-500/5 rounded-2xl transition-all font-black uppercase text-[9px] tracking-widest border border-red-500/10"
            >
                <LogOut size={18} />
                <span>Quitter le Panel</span>
            </button>
        </div>
      </aside>

      {/* CONTENU DES PAGES (Dashboard, Calendar, etc.) */}
      <main className="flex-1 overflow-y-auto bg-black relative">
        {/* pb-32 sur mobile pour s'assurer que le contenu dépasse la barre du navigateur */}
        <div className="p-6 md:p-12 pb-32 md:pb-12 max-w-7xl mx-auto">
            <Outlet />
        </div>
      </main>

    </div>
  );
}