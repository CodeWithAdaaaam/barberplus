import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";
import { initScrollReveal } from "@/hooks/useScrollReveal";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    initScrollReveal();
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (!formData.message.trim()) newErrors.message = "Le message est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ firstName: "", phone: "", subject: "", message: "" });
      }, 5000);
    }
  };

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p data-reveal className="text-xs uppercase tracking-[0.08em] text-gold mb-4">CONTACT</p>
            <h1 data-reveal className="font-display text-4xl md:text-5xl text-white mb-6" style={{ transitionDelay: "0.1s" }}>
              Contactez-Nous
            </h1>
            <p data-reveal className="text-lg text-bp-muted max-w-[600px] mx-auto" style={{ transitionDelay: "0.2s" }}>
              Une question ? Besoin d&apos;informations ? N&apos;hésitez pas à nous contacter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Info */}
            <div data-reveal>
              <div className="space-y-8 mb-10">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-bp-card border border-bp-border flex items-center justify-center text-gold flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Adresse</h3>
                    <p className="text-bp-muted text-sm">
                      Hay Riad, Rabat, Maroc
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-bp-card border border-bp-border flex items-center justify-center text-gold flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Téléphone</h3>
                    <a href="tel:+212661217511" className="text-bp-muted text-sm hover:text-gold transition-colors">
                      +212 661-217511
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-bp-card border border-bp-border flex items-center justify-center text-gold flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Horaires d&apos;ouverture</h3>
                    <p className="text-bp-muted text-sm">
                      Lundi – Dimanche : 9h – 22h
                      <br />
                      <span className="text-gold">Ouvert 7j/7</span>
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] flex-shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/212600000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] text-sm hover:underline"
                    >
                      Écrivez-nous sur WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-xl border border-bp-border overflow-hidden aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.938768896914!2d-6.8520!3d33.9690!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76c719a162e41%3A0x8465a4c9c2c2f5c0!2sHay%20Riad%2C%20Rabat%2C%20Morocco!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(100%) invert(92%)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Barber Plus Location"
                />
              </div>
            </div>

            {/* Right Column - Form */}
            <div data-reveal style={{ transitionDelay: "0.15s" }}>
              <div className="bg-bp-card border border-bp-border rounded-xl p-8">
                <h2 className="font-display text-2xl text-white mb-6">Envoyez-nous un message</h2>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle size={48} className="text-gold mb-4" />
                    <h3 className="text-white font-display text-xl mb-2">Message envoyé !</h3>
                    <p className="text-bp-muted text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* First Name */}
                    <div>
                      <label className="block text-xs uppercase tracking-[0.08em] text-bp-muted mb-2">
                        Prénom <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Votre prénom"
                        className={`w-full bg-bp-bg border rounded-md px-4 py-3.5 text-white placeholder:text-bp-tertiary focus:outline-none focus:border-gold focus:shadow-gold-lg transition-all ${
                          errors.firstName ? "border-red-500" : "border-bp-border"
                        }`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs uppercase tracking-[0.08em] text-bp-muted mb-2">
                        Téléphone <span className="text-gold">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Votre numéro de téléphone"
                        className={`w-full bg-bp-bg border rounded-md px-4 py-3.5 text-white placeholder:text-bp-tertiary focus:outline-none focus:border-gold focus:shadow-gold-lg transition-all ${
                          errors.phone ? "border-red-500" : "border-bp-border"
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs uppercase tracking-[0.08em] text-bp-muted mb-2">
                        Sujet
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-bp-bg border border-bp-border rounded-md px-4 py-3.5 text-white focus:outline-none focus:border-gold focus:shadow-gold-lg transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="rendez-vous">Rendez-vous</option>
                        <option value="information">Information</option>
                        <option value="reclamation">Réclamation</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs uppercase tracking-[0.08em] text-bp-muted mb-2">
                        Message <span className="text-gold">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Votre message..."
                        rows={5}
                        className={`w-full bg-bp-bg border rounded-md px-4 py-3.5 text-white placeholder:text-bp-tertiary focus:outline-none focus:border-gold focus:shadow-gold-lg transition-all resize-none ${
                          errors.message ? "border-red-500" : "border-bp-border"
                        }`}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold text-bp-bg py-4 rounded-lg font-semibold text-sm hover:bg-gold-light transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Envoyer le message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
