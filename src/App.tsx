import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Appointments from "./pages/admin/Appointments";
import CalendarView from "./pages/admin/CalendarView";
import Clients from "./pages/admin/Clients";
import Settings from "./pages/admin/Settings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();

  // On vérifie si l'URL actuelle commence par "/admin"
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-bp-bg text-white">
      <ScrollToTop />
      
      {/* N'affiche la Navbar que si on n'est PAS sur une page admin */}
      {!isAdminPath && <Navbar />}
      
      <main>
        <Routes>
          {/* ROUTES PUBLIQUES */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />

          {/* ROUTES ADMIN (Imbriquées dans le AdminLayout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="clients" element={<Clients />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>

      {/* N'affiche le Footer que si on n'est PAS sur une page admin */}
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;