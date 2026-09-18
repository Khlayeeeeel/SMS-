import { QuoteForm } from "@/components/sections/QuoteForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demande de Devis - SMS Solaire",
  description: "Simulateur de devis pour votre installation photovoltaïque en Tunisie.",
};

export default function DevisPage() {
  return (
    <div className="py-section-padding px-margin-mobile md:px-gutter">
      <QuoteForm />
    </div>
  );
}
