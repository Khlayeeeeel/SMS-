import Link from "next/link";
import { Droplets, ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pompage Solaire - SMS Solaire",
  description: "Solutions d'irrigation intelligente par pompage solaire pour l'agriculture tunisienne.",
};

export default function PompagePage() {
  return (
    <div className="pt-[88px]">
      <section className="py-section-padding px-margin-mobile md:px-gutter max-w-container-max mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-secondary-fixed/20 text-secondary-container px-3 py-1 rounded-full w-fit">
            <Droplets size={16} />
            <span className="font-label-sm text-label-sm">Solutions Agricoles - Sahel Tunisien</span>
          </div>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary">
            L&apos;Irrigation Intelligente par Pompage Solaire
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            Optimisez vos rendements agricoles à Monastir, Mahdia et Sousse. Remplacez le diesel coûteux par une énergie propre, fiable et subventionnée.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/devis">
              <Button variant="primary" className="flex items-center gap-2">
                Calculer mes économies <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-outline-variant/20 shadow-[0px_10px_30px_rgba(0,0,0,0.05)]">
          <div
            className="bg-cover bg-center w-full h-full"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6ts68FoJRM95TblcjnGqicsoAc1J6ae2uXjgjtVVaDuhi7Ut74xIt3faCf-bwkSr03-JXX3973yhg-eXv6JHBV4E4q9H2KFyt3fAxvv5_SvxjGvoRV0ZRub8uaXYrDaxtOEJVDytU_8HtoYCs2b9Cj2D9QotiDhhGWavrYcWaXIagC8laR1qkXf3lO0eYDSCGbEI4EITo--BVLOR8v5UYDcaXvsvNrUPnPN9x-F5Q_0wRur-Cdj4L_A')" }}
          />
          <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm p-4 rounded-lg border border-outline-variant/30 flex items-center gap-3">
            <TrendingDown size={32} className="text-technical-blue" />
            <div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">Jusqu&apos;à</div>
              <div className="font-headline-md text-headline-md text-primary">-70% sur la facture d&apos;eau</div>
            </div>
          </div>
        </div>
      </section>
      <BenefitsSection />
    </div>
  );
}
