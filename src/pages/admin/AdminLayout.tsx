import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, List, Settings, LogOut, Menu, X, Lock } from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();

  const SECRET_PASSWORD = "Barber2024"; // TON MOT DE PASSE ICI

  // Vérification de l'auth au chargement
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

  // Helper pour savoir si un lien est actif dans Vite
  const isActive = (path: string) => location.pathname === path;
  
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
    ${isActive(path) 
      ? 'bg-gold text-black font-bold shadow-lg shadow-gold/20' 
      : 'text-gray-400 hover:bg-zinc-800 hover:text-white'}
  `;

  // --- 1. ÉCRAN DE CONNEXION (Si pas authentifié) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
            <Lock size={30} />
          </div>
          <h1 className="text-2xl font-display text-white mb-6 uppercase tracking-widest">Accès Admin</h1>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-black border border-zinc-800 p-4 rounded-lg text-white mb-4 outline-none focus:border-gold transition-all"
            autoFocus
          />
          <button type="submit" className="w-full bg-gold text-black font-bold py-4 rounded-lg hover:bg-white transition-all uppercase tracking-widest">
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  // --- 2. LE LAYOUT ADMIN (Si authentifié) ---
  return (
    <div className="flex h-screen bg-black font-sans text-white overflow-hidden">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-30">
        <span className="font-black tracking-tighter text-lg text-white">BARBER PLUS<span className="text-gold">.</span></span>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gold">
            <Menu size={24} />
        </button>
      </div>

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={closeSidebar}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="h-20 flex items-center justify-center border-b border-zinc-800 relative">
          <h1 className="text-xl font-black tracking-tighter text-white">BARBER PLUS<span className="text-gold">.</span></h1>
          <button onClick={closeSidebar} className="absolute right-4 md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link to="/admin" onClick={closeSidebar} className={linkClass('/admin')}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Tableau de Bord</span>
          </Link>
          
          <Link to="/admin/calendar" onClick={closeSidebar} className={linkClass('/admin/calendar')}>
            <Calendar size={20} />
            <span className="font-medium">Calendrier</span>
          </Link>

          <Link to="/admin/appointments" onClick={closeSidebar} className={linkClass('/admin/appointments')}>
            <List size={20} />
            <span className="font-medium">Réservations</span>
          </Link>

          <Link to="/admin/settings" onClick={closeSidebar} className={linkClass('/admin/settings')}>
            <Settings size={20} />
            <span className="font-medium">Paramètres</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-500 w-full hover:bg-red-500/10 rounded-lg transition-colors"
            >
                <LogOut size={20} />
                <span className="font-medium">Déconnexion</span>
            </button>
        </div>
      </aside>

      {/* CONTENU DES PAGES (Dashboard, Calendar, etc.) */}
      <main className="flex-1 overflow-y-auto pt-20 md:pt-0 bg-black">
        <div className="p-4 md:p-8">
            <Outlet /> {/* C'est ici que tes pages admin vont s'afficher ! */}
        </div>
      </main>
    </div>
  );
}