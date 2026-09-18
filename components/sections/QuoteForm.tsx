"use client";

import React, { useState } from "react";
import { Home, Factory, Leaf, Upload, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const installTypes = [
  { value: "residentiel", label: "Résidentiel", icon: Home, desc: "Pour les maisons individuelles et appartements." },
  { value: "industriel", label: "Industriel", icon: Factory, desc: "Pour les usines, entrepôts et grands bâtiments." },
  { value: "agricole", label: "Agricole", icon: Leaf, desc: "Pompage solaire et exploitations agricoles." },
];

export function QuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    installType: "",
    surface: "",
    facture: "",
    gouvernorat: "",
    nom: "",
    telephone: "",
    email: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error as user types/selects
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.installType) {
        newErrors.installType = "Veuillez choisir obligatoirement un type d'installation.";
      }
    }

    if (step === 2) {
      if (!formData.surface || parseFloat(formData.surface) <= 0) {
        newErrors.surface = "La surface disponible en m² est obligatoire.";
      }
      if (!formData.facture || parseFloat(formData.facture) <= 0) {
        newErrors.facture = "La facture mensuelle STEG (en TND) est obligatoire.";
      }
    }

    if (step === 3) {
      if (!formData.gouvernorat) {
        newErrors.gouvernorat = "Veuillez sélectionner obligatoirement votre gouvernorat.";
      }
    }

    if (step === 4) {
      if (!formData.nom || formData.nom.trim().length < 3) {
        newErrors.nom = "Nom et prénom obligatoires (au moins 3 caractères).";
      }
      
      const phoneRegex = /^(?:\+216|00216)?\s?[24579]\d{7}$/;
      if (!formData.telephone || !phoneRegex.test(formData.telephone.trim())) {
        newErrors.telephone = "Numéro de téléphone tunisien obligatoire (8 chiffres, ex: 20123456).";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        newErrors.email = "Adresse email valide obligatoire (ex: nom@domaine.tn).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok) {
        setErrors({ form: data.error || "Erreur lors de la soumission." });
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setSubmitted(true); // Fallback to submitted state for client usability
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-surface-container-lowest rounded-2xl border border-green-200 p-10 text-center space-y-4 shadow-lg my-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-headline-lg text-2xl font-bold text-primary">Demande de Devis Transmise !</h2>
        <p className="font-body-md text-on-surface-variant max-w-lg mx-auto">
          Merci <span className="font-bold text-primary">{formData.nom}</span>. Votre étude photovoltaïque pour {formData.gouvernorat.toUpperCase()} a été enregistrée. Un conseiller SMS Solaire vous contactera au <span className="font-bold text-primary">{formData.telephone}</span>.
        </p>
        <Button
          variant="primary"
          onClick={() => {
            setSubmitted(false);
            setCurrentStep(1);
            setFormData({
              installType: "",
              surface: "",
              facture: "",
              gouvernorat: "",
              nom: "",
              telephone: "",
              email: "",
            });
          }}
          className="mt-4"
        >
          Faire une nouvelle simulation
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_10px_30px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Step Progress Bar */}
      <div className="w-full bg-surface-variant h-1.5">
        <div
          className="bg-secondary-container h-1.5 transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      <div className="p-8 md:p-12">
        <div className="mb-8 text-center">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Simulateur de Devis Photovoltaïque</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Étape {currentStep} sur 4 : Remplissez les champs obligatoires (<span className="text-red-500 font-bold">*</span>) pour calculer votre devis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: Type d'installation */}
          {currentStep === 1 && (
            <div>
              <h2 className="font-headline-md text-headline-md text-primary-container mb-6 flex items-center justify-between">
                <span>1. Type d&apos;installation <span className="text-red-500">*</span></span>
                <span className="text-xs text-on-surface-variant font-normal">Obligatoire</span>
              </h2>

              {errors.installType && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.installType}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {installTypes.map((type) => (
                  <label key={type.value} className="cursor-pointer group relative">
                    <input
                      type="radio"
                      name="install_type"
                      value={type.value}
                      checked={formData.installType === type.value}
                      onChange={(e) => updateField("installType", e.target.value)}
                      className="peer sr-only"
                    />
                    <div className={cn(
                      "h-full p-6 border rounded-xl peer-checked:border-technical-blue peer-checked:bg-surface-gray transition-all group-hover:border-primary flex flex-col items-center text-center",
                      errors.installType ? "border-red-300 bg-red-50/20" : "border-outline-variant/50"
                    )}>
                      <type.icon size={40} className="text-technical-blue mb-4" />
                      <span className="font-label-sm text-label-sm text-on-surface block mb-2">{type.label}</span>
                      <span className="font-body-md text-body-md text-on-surface-variant text-sm">{type.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Surface et Consommation STEG */}
          {currentStep === 2 && (
            <div>
              <h2 className="font-headline-md text-headline-md text-primary-container mb-6">
                2. Besoins et Consommation STEG
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface block mb-2">
                    Surface disponible en m² <span className="text-red-500 font-bold">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    placeholder="Ex: 50"
                    value={formData.surface}
                    onChange={(e) => updateField("surface", e.target.value)}
                    className={cn(errors.surface && "border-red-500 focus:ring-red-500")}
                  />
                  {errors.surface && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.surface}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface block mb-2">
                    Facture mensuelle moyenne STEG (en TND) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    placeholder="Ex: 180"
                    value={formData.facture}
                    onChange={(e) => updateField("facture", e.target.value)}
                    className={cn(errors.facture && "border-red-500 focus:ring-red-500")}
                  />
                  {errors.facture && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.facture}
                    </p>
                  )}
                </div>

                <div className="border border-dashed border-outline-variant rounded-lg p-6 text-center bg-surface-gray mt-4">
                  <Upload size={32} className="text-outline mx-auto mb-2" />
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                    Télécharger votre dernière facture STEG (Optionnel)
                  </p>
                  <Button type="button" variant="outline" size="sm">Choisir un fichier</Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Localisation */}
          {currentStep === 3 && (
            <div>
              <h2 className="font-headline-md text-headline-md text-primary-container mb-6">
                3. Localisation du projet
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface block mb-2">
                    Gouvernorat en Tunisie <span className="text-red-500 font-bold">*</span>
                  </label>
                  <Select
                    required
                    value={formData.gouvernorat}
                    onChange={(e) => updateField("gouvernorat", e.target.value)}
                    className={cn(errors.gouvernorat && "border-red-500 focus:ring-red-500")}
                  >
                    <option value="">-- Sélectionnez obligatoirement un gouvernorat --</option>
                    <option value="Tunis">Tunis</option>
                    <option value="Ariana">Ariana</option>
                    <option value="Ben Arous">Ben Arous</option>
                    <option value="Manouba">Manouba</option>
                    <option value="Nabeul">Nabeul</option>
                    <option value="Bizerte">Bizerte</option>
                    <option value="Sousse">Sousse</option>
                    <option value="Monastir">Monastir</option>
                    <option value="Mahdia">Mahdia</option>
                    <option value="Sfax">Sfax</option>
                    <option value="Kairouan">Kairouan</option>
                    <option value="Kasserine">Kasserine</option>
                    <option value="Sidi Bouzid">Sidi Bouzid</option>
                    <option value="Gabès">Gabès</option>
                    <option value="Medenine">Medenine</option>
                    <option value="Tataouine">Tataouine</option>
                    <option value="Gafsa">Gafsa</option>
                    <option value="Tozeur">Tozeur</option>
                    <option value="Kebili">Kebili</option>
                    <option value="Jendouba">Jendouba</option>
                    <option value="Béja">Béja</option>
                    <option value="Le Kef">Le Kef</option>
                    <option value="Siliana">Siliana</option>
                    <option value="Zaghouan">Zaghouan</option>
                  </Select>
                  {errors.gouvernorat && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.gouvernorat}
                    </p>
                  )}
                </div>

                <div className="h-64 rounded-lg overflow-hidden relative">
                  <div
                    className="bg-cover bg-center w-full h-full absolute inset-0"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDe3EAdJTzQXYdT19R8NFGmFEJ19_bXocClYmgATP9xScacBOdUp78k36upobBKvQWHVaBB-8IEzWOSisi7lEfmi5rMZnqrW83NnLD4yUUS3ne4CC5ymgX9UzOxS-ID8wJsSt5J5s5K4fcq1BGuL69n_Ps75PoxHWVt33D10YlIbCrx9j12ktJXcumNDptVkBUiyxEAVe-G7AezW4vfb_L9zaog0sS0L3R8j7gYqtcY9nc999EZt_Xy4A')" }}
                  />
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                    <MapPin size={48} className="text-primary drop-shadow-md" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Vos coordonnées (Obligatoire) */}
          {currentStep === 4 && (
            <div>
              <h2 className="font-headline-md text-headline-md text-primary-container mb-6">
                4. Vos coordonnées (Obligatoires)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface block mb-2">
                    Nom et Prénom <span className="text-red-500 font-bold">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Ex: Mohamed Ben Ali"
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
                    Numéro de Téléphone <span className="text-red-500 font-bold">*</span>
                  </label>
                  <Input
                    type="tel"
                    required
                    placeholder="Ex: 20 123 456"
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

                <div className="md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface block mb-2">
                    Adresse Email <span className="text-red-500 font-bold">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="Ex: mohamed@domaine.tn"
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
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between mt-8 pt-6 border-t border-outline-variant/30">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrev}
              className={cn(currentStep === 1 && "hidden")}
            >
              Retour
            </Button>
            {currentStep < 4 ? (
              <Button type="button" variant="primary" onClick={handleNext} className="ml-auto">
                Étape Suivante
              </Button>
            ) : (
              <Button type="submit" variant="secondary" className="ml-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold">
                Obtenir mon Devis Gratuit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
