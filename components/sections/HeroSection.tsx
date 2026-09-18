import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <header className="relative w-full overflow-hidden bg-surface-gray py-section-padding px-margin-mobile md:px-gutter mt-16">
      <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="z-10 flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full text-label-sm font-label-sm text-primary">
            <Zap size={16} className="text-technical-blue" />
            Expertise Photovoltaïque
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary">
            Votre partenaire pour l&apos;énergie solaire en Tunisie
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Des solutions d&apos;ingénierie solaire fiables, rentables et durables pour les secteurs résidentiel, industriel et agricole.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/contact">
              <Button variant="primary" size="lg">Demander un devis gratuit</Button>
            </Link>
            <Link href="/devis">
              <Button variant="outline" size="lg">Simulateur de Devis</Button>
            </Link>
          </div>
        </div>
        <div className="relative w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div
            className="bg-cover bg-center w-full h-full absolute inset-0"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3rmcU1phBtqj8wTCLM66sOfE6BBbeZhtMuocaIe4rP2KWx0lmL2QkiRWGRK_JOMqdvcabPERwPQes4MfBJkI8uR0IDjvso-fadoO-L0rfx3JX-eCyjUqWWxgNaDlSZ9hISIHjXpvF2gQDMEcJJa0BiSTI6q3DyrYIsBwdVYEDDdtgAQiO3tzkMshK0XR1LXCLjFDK9-lpPPYns3I9FGCpy5K9tBzzYUSWy2oh5RGz14U92vzoSqtc4w')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/40 to-transparent" />
        </div>
      </div>
    </header>
  );
}
