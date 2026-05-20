import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { initScrollReveal } from "@/hooks/useScrollReveal";

// --- ON DÉFINIT LES 3 IMAGES ICI POUR ÊTRE SÛR DU CHEMIN ---
// Remplace 'photo1.jpg' etc. par les VRAIS noms de tes fichiers dans public/images/
const myThreeImages = [
  {
    id: 1,
    src: "/images/IMG_0312.jpg", // Chemin correct : part de 'public'
    alt: "Coupe Signature Barber Plus",
    category: "Coiffure"
  },
  {
    id: 2,
    src: "/images/IMG_1309.jpg",
    alt: "Taille de Barbe Traditionnelle",
    category: "Barbe"
  },
  {
    id: 3,
    src: "/images/IMG_5351.JPG",
    alt: "Soin Visage Prestige",
    category: "Soins"
  }
];

const Gallery: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    initScrollReveal();
    window.scrollTo(0, 0);
  }, []);

  // On utilise uniquement nos 3 images
  const filteredImages = myThreeImages;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  };

  const goToPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1);
    }
  }, [lightboxIndex, filteredImages.length]);

  const goToNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  }, [lightboxIndex, filteredImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, goToPrev, goToNext]);

  return (
    <div className="pt-[72px] bg-black min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          {/* Header Luxe Hay Riad */}
          <div className="text-center mb-20">
            <p data-reveal className="text-[10px] uppercase tracking-[0.5em] text-gold mb-4 font-black">
              L'EXCELLENCE VISUELLE
            </p>
            <h1 data-reveal className="font-display text-5xl md:text-7xl text-white mb-6 uppercase tracking-tighter">
              Galerie <span className="text-gold italic">Prestige</span>
            </h1>
            <div className="w-20 h-1 bg-gold mx-auto shadow-[0_0_15px_rgba(201,168,76,0.5)]" />
          </div>

          {/* Grille de 3 Photos - Propre et alignée */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-zinc-800 cursor-pointer bg-zinc-900"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  loading="lazy"
                  onError={(e) => {
                    // Si l'image ne charge pas, on affiche un message d'erreur dans la console
                    console.error(`Erreur de chargement pour : ${img.src}`);
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x800?text=Image+non+trouvée";
                  }}
                />
                
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-gold text-[10px] font-black uppercase tracking-widest mb-1">
                    {img.category}
                  </span>
                  <h3 className="text-white font-bold uppercase text-sm italic">{img.alt}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox (Gardée identique mais simplifiée) */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white hover:text-gold transition-colors z-[110]"><X size={32} /></button>
            <button onClick={(e) => { e.stopPropagation(); goToPrev(); }} className="absolute left-4 text-white hover:text-gold transition-colors z-[110]"><ChevronLeft size={48} /></button>
            <button onClick={(e) => { e.stopPropagation(); goToNext(); }} className="absolute right-4 text-white hover:text-gold transition-colors z-[110]"><ChevronRight size={48} /></button>

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[lightboxIndex].src}
                alt={filteredImages[lightboxIndex].alt}
                className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
              />
              <div className="mt-6 text-center">
                <p className="text-gold font-black uppercase tracking-widest text-xs mb-2">{filteredImages[lightboxIndex].category}</p>
                <p className="text-white text-lg italic">{filteredImages[lightboxIndex].alt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;