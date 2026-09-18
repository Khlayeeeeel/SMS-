"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
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

      const data = await res.json();
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
        <h2 className="font-headline-lg text- headline-lg text-primary">Message Envoyé avec Succès !</h2>
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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
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
            "w-full bg-surface-container-lowest border rounded-lg p-3 text-on-surface focus:outline-none focus:border-technical-blue focus:ring-2 focus:ring-technical-blue/20 transition-shadow",
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

      <Button type="submit" variant="secondary" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold">
        Envoyer le Message
      </Button>
    </form>
  );
}
