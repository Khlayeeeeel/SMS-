"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Mail, Phone, MessageCircle, Instagram, Facebook, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom || formData.nom.trim().length < 3) {
      newErrors.nom = "Nom et prénom obligatoires (min 3 caractères).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Adresse email valide obligatoire (ex: nom@domaine.tn).";
    }

    const phoneRegex = /^(?:\+216|00216)?\s?[24579]\d{7}$/;
    if (!formData.telephone || !phoneRegex.test(formData.telephone.trim())) {
      newErrors.telephone = "Numéro de téléphone tunisien obligatoire (8 chiffres).";
    }

    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = "Veuillez préciser votre message (au moins 10 caractères).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (jsonErr) {
        console.warn("Could not parse response as JSON:", jsonErr);
      }

      setIsSubmitting(false);

      if (!res.ok) {
        setErrors({ form: data.error || "Erreur lors de l'envoi." });
        return;
      }

      setSent(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-4 bg-surface-container-lowest p-8 rounded-2xl border border-green-200 shadow-md">
        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-headline-lg text-2xl font-bold text-primary">Message Envoyé avec Succès !</h2>
        <p className="font-body-md text-on-surface-variant">
          Merci <span className="font-bold text-primary">{formData.nom}</span>. L&apos;équipe SMS Solaire vous recontactera très rapidement au <span className="font-bold text-primary">{formData.telephone}</span>.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSent(false);
            setFormData({ nom: "", email: "", telephone: "", message: "" });
          }}
          className="mt-4"
        >
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Direct Contact Info & Social Links */}
      <div className="lg:col-span-5 bg-primary text-on-primary p-8 rounded-2xl shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <h3 className="font-montserrat text-2xl font-bold text-white">Contactez Notre Équipe</h3>
          <p className="text-xs text-on-primary/80 leading-relaxed">
            Une question technique, une étude photovoltaïque ou un projet de pompage solaire ? Nous sommes à votre disposition.
          </p>
        </div>

        {/* Contact Info Items */}
        <div className="space-y-4 relative z-10 text-sm">
          <a
            href="mailto:Mokninesolaire@gmail.com"
            className="flex items-center gap-3.5 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary-container/20 text-secondary-container flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-on-primary/70 font-medium">Adresse Email</p>
              <p className="font-semibold text-white text-xs sm:text-sm">Mokninesolaire@gmail.com</p>
            </div>
          </a>

          <a
            href="https://wa.me/21654525769"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
          >
            <div className="w-9 h-9 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-on-primary/70 font-medium">Téléphone / WhatsApp</p>
              <p className="font-semibold text-white text-xs sm:text-sm">+216 54 525 769</p>
            </div>
          </a>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/10 border border-white/10">
            <div className="w-9 h-9 rounded-lg bg-secondary-container/20 text-secondary-container flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-on-primary/70 font-medium">Localisation</p>
              <p className="font-semibold text-white text-xs sm:text-sm">Moknine - Monastir, Tunisie</p>
            </div>
          </div>
        </div>

        {/* Social Media Row */}
        <div className="pt-4 border-t border-white/10 space-y-3 relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-container">Suivez-nous sur les réseaux :</p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/share/1CDGcx5WH1/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook SMS Solaire"
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-secondary-container hover:text-deep-charcoal text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Facebook size={16} />
              <span>Facebook</span>
            </a>

            <a
              href="https://www.instagram.com/sms_energy_?stkn=Y3J2NDd5MXdjb3ox"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram SMS Energy"
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-secondary-container hover:text-deep-charcoal text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Instagram size={16} />
              <span>Instagram</span>
            </a>

            <a
              href="https://wa.me/21654525769"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp SMS Solaire"
              className="px-3 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* Right Column: Message Form */}
      <div className="lg:col-span-7 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-md">
        <h3 className="font-montserrat text-xl font-bold text-primary mb-6">Envoyez-nous un Message</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {errors.form}
            </div>
          )}

          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-2">
              Nom et Prénom <span className="text-red-500 font-bold">*</span>
            </label>
            <Input
              type="text"
              required
              placeholder="Jean Dupont"
              value={formData.nom}
              onChange={(e) => updateField("nom", e.target.value)}
              className={cn(errors.nom && "border-red-500 focus:ring-red-500")}
            />
            {errors.nom && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.nom}
              </p>
            )}
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-2">
              Adresse Email <span className="text-red-500 font-bold">*</span>
            </label>
            <Input
              type="email"
              required
              placeholder="exemple@domaine.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={cn(errors.email && "border-red-500 focus:ring-red-500")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-2">
              Numéro de Téléphone <span className="text-red-500 font-bold">*</span>
            </label>
            <Input
              type="tel"
              required
              placeholder="+216 20 123 456"
              value={formData.telephone}
              onChange={(e) => updateField("telephone", e.target.value)}
              className={cn(errors.telephone && "border-red-500 focus:ring-red-500")}
            />
            {errors.telephone && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.telephone}
              </p>
            )}
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-2">
              Message <span className="text-red-500 font-bold">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              className={cn(
                "w-full bg-surface-container-lowest border rounded-lg p-3 text-on-surface focus:outline-none focus:border-technical-blue focus:ring-2 focus:ring-technical-blue/20 transition-shadow text-sm",
                errors.message ? "border-red-500 focus:ring-red-500" : "border-outline-variant"
              )}
              placeholder="Décrivez votre projet d'installation solaire..."
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold h-11 text-sm shadow-md"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le Message"}
          </Button>
        </form>
      </div>

    </div>
  );
}
