import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Scissors, Sparkles, FlaskConical, Heart, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { initScrollReveal } from "@/hooks/useScrollReveal";

const iconMap: Record<string, React.ReactNode> = {
  Scissors: <Scissors size={28} />,
  Sparkles: <Sparkles size={28} />,
  FlaskConical: <FlaskConical size={28} />,
  Heart: <Heart size={28} />,
  Crown: <Scissors size={28} />,
  Smile: <Sparkles size={28} />,
};

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initScrollReveal();
  }, []);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="min-h-screen relative flex items-center pt-[72px]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full py-12 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column - Text */}
            <div className="order-2 lg:order-1">
              <motion.p
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-xs uppercase tracking-[0.08em] text-bp-muted mb-6"
              >
                Barbier &amp; Coiffeur Homme à Hay Riad, Rabat
              </motion.p>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8">
                {["Barbier", "&", "Coiffeur", "Homme"].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(12px) brightness(30%)", scale: 0.85 }}
                    animate={{ opacity: 1, filter: "blur(0px) brightness(100%)", scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.15 }}
                    className={`inline-block mr-[0.3em] ${
                      word === "&" || word === "Coiffeur" ? "text-gold" : "text-white"
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
                className="text-lg text-bp-muted max-w-[480px] mb-8 leading-relaxed"
              >
                Votre Style, Notre Confiance. Découvrez l&apos;expérience Barber Plus.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.72 }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                <Link
                  to="/booking"
                  className="bg-gold text-bp-bg px-8 py-4 rounded-lg font-semibold text-sm hover:bg-gold-light transition-all duration-200 hover:-translate-y-0.5"
                >
                  Prendre un Rendez-Vous
                </Link>
                <Link
                  to="/services"
                  className="text-gold text-sm font-medium inline-flex items-center gap-2 group"
                >
                  Voir nos Services
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Right Column - Images */}
            <div className="order-1 lg:order-2 flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                className="overflow-hidden rounded-lg border border-bp-border"
              >
                <img
                  src="/images/hero-styling.jpg"
                  alt="Barber styling a client's hair"
                  className="w-full h-[280px] md:h-[350px] object-cover"
                  loading="eager"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
                className="overflow-hidden rounded-lg border border-bp-border"
              >
                <img
                  src="/images/hero-interior.jpg"
                  alt="Barbershop interior"
                  className="w-full h-[180px] md:h-[220px] object-cover"
                  loading="eager"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTRO STRIP ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <h2 data-reveal className="font-display text-3xl md:text-4xl text-white mb-6">
            Les beaux jours capillaires commencent ici !
          </h2>
          <p data-reveal className="text-lg text-bp-muted max-w-[640px] mx-auto mb-8 leading-relaxed" style={{ transitionDelay: "0.15s" }}>
            Chez Barber Plus, nous ne nous contentons pas de couper vos cheveux, nous vous offrons une expérience de coiffure masculine haut de gamme conçue pour sublimer votre style.
          </p>
          <Link
            to="/services"
            data-reveal
            className="text-gold text-sm font-medium inline-flex items-center gap-2 group"
            style={{ transitionDelay: "0.3s" }}
          >
            Voir nos Services
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section id="services" className="py-24 md:py-28 bg-bp-card">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div data-reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-gold mb-3">NOS SERVICES</p>
              <h2 className="font-display text-3xl md:text-4xl text-white">
                Services de Barbier &amp; Coiffeur Homme Premium
              </h2>
            </div>
            <Link
              to="/services"
              className="text-gold text-sm font-medium inline-flex items-center gap-2 group whitespace-nowrap"
            >
              Voir tous nos services &amp; tarifs
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Service Cards */}
          <div data-stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                data-reveal-child
                className="bg-bp-bg border border-bp-border rounded-lg p-8 transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-gold group"
              >
                <div className="w-16 h-16 rounded-full border border-bp-border flex items-center justify-center text-gold mb-6 group-hover:border-gold transition-colors">
                  {iconMap[service.icon]}
                </div>
                <h3 className="font-display text-xl text-white mb-3">{service.name}</h3>
                <p className="text-sm text-bp-muted leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SALON AMBIANCE ===== */}
      <section className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/salon-panorama.jpg"
            alt="Salon interior"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bp-bg/80 via-bp-bg/40 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h2 data-reveal className="font-display text-5xl md:text-6xl text-white mb-4">
            Le Salon
          </h2>
          <p data-reveal className="font-display text-xl md:text-2xl text-gold" style={{ transitionDelay: "0.3s" }}>
            Faites comme chez vous
          </p>
        </div>
      </section>

      {/* ===== PRICING TABLE ===== */}
      <section className="py-24 md:py-28">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center mb-12">
            <p data-reveal className="text-xs uppercase tracking-[0.08em] text-gold mb-3">TARIFS</p>
            <h2 data-reveal className="font-display text-3xl md:text-4xl text-white mb-4" style={{ transitionDelay: "0.1s" }}>
              Nos Tarifs
            </h2>
            <p data-reveal className="text-lg text-bp-muted max-w-[560px] mx-auto" style={{ transitionDelay: "0.2s" }}>
              Nous offrons une gamme complète de services de coiffure et de soins pour hommes.
            </p>
          </div>

          {/* Pricing Rows */}
          <div data-stagger className="space-y-0">
            {services.map((service) => (
              <div
                key={service.id}
                data-reveal-child
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6 border-b border-bp-border group hover:border-gold/50 transition-colors"
              >
                <div className="mb-3 sm:mb-0">
                  <h3 className="text-white font-medium">{service.name}</h3>
                  <p className="text-sm text-bp-muted mt-1">{service.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-display text-2xl text-gold">{service.price} Dhs</span>
                  <Link
                    to="/booking"
                    className="text-xs font-medium border border-gold text-gold px-5 py-2 rounded hover:bg-gold hover:text-bp-bg transition-all duration-200"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOKING CTA ===== */}
      <section className="py-20 md:py-24 bg-bp-card">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <p data-reveal className="text-xs uppercase tracking-[0.08em] text-gold mb-4">
                RÉSERVATION EN LIGNE
              </p>
              <h2 data-reveal className="font-display text-3xl md:text-4xl text-white mb-6" style={{ transitionDelay: "0.1s" }}>
                Réservez Votre Moment de Style
              </h2>
              <p data-reveal className="text-lg text-bp-muted mb-8 leading-relaxed" style={{ transitionDelay: "0.2s" }}>
                Réservez votre rendez-vous chez Barber Plus en quelques clics. Choisissez votre service, votre date et votre heure, et laissez-nous prendre soin de vous.
              </p>
              <Link
                to="/booking"
                data-reveal
                className="inline-block bg-gold text-bp-bg px-8 py-4 rounded-lg font-semibold text-sm hover:bg-gold-light transition-all duration-200 hover:-translate-y-0.5"
                style={{ transitionDelay: "0.3s" }}
              >
                Réserver Maintenant
              </Link>
            </div>

            {/* Right - Image */}
            <div data-reveal className="overflow-hidden rounded-xl border border-bp-border">
              <img
                src="/images/booking-cta.jpg"
                alt="Premium barbershop chair"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center mb-12">
            <p data-reveal className="text-xs uppercase tracking-[0.08em] text-gold mb-3">TÉMOIGNAGES</p>
            <h2 data-reveal className="font-display text-3xl md:text-4xl text-white" style={{ transitionDelay: "0.1s" }}>
              Ce Que Nos Clients Disent
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div data-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                data-reveal-child
                className="bg-bp-card border border-bp-border rounded-lg p-8 relative transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-gold"
              >
                {/* Decorative quote mark */}
                <span className="absolute top-4 left-4 text-gold text-5xl font-display opacity-30 leading-none">
                  &ldquo;
                </span>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gold fill-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white italic leading-relaxed mb-6 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-bp-tertiary mt-1">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
