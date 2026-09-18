import { ContactSection } from "@/components/sections/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - SMS Solaire",
  description: "Contactez SMS Solaire pour votre projet d'énergie solaire en Tunisie.",
};

export default function ContactPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-padding pt-[120px]">
      <div className="text-center mb-12">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary mb-4">Contactez-nous</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Une question ? Un projet ? Remplissez le formulaire ci-dessous.
        </p>
      </div>
      <ContactSection />
    </div>
  );
}
