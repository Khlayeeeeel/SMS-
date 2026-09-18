import { Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basse Tension - SMS Solaire",
  description: "Solutions solaires basse tension pour habitations et petites entreprises en Tunisie.",
};

export default function BasseTensionPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-padding pt-[120px]">
      <div className="flex flex-col items-start gap-6 max-w-3xl">
        <div className="w-12 h-12 bg-primary-fixed rounded flex items-center justify-center text-technical-blue">
          <Home size={32} />
        </div>
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary">Basse Tension</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Solutions solaires optimisées pour les habitations et les petites entreprises, garantissant une indépendance énergétique. Nos installations basses tension sont conçues pour s&apos;adapter à votre toiture et votre consommation.
        </p>
        <ul className="list-disc list-inside font-body-md text-body-md text-on-surface-variant space-y-2">
          <li>Installations de 3 à 10 kWc</li>
          <li>Autoconsommation et revente de surplus</li>
          <li>Monitoring en temps réel</li>
          <li>Maintenance préventive incluse</li>
        </ul>
        <Link href="/devis">
          <Button variant="primary" className="mt-4 flex items-center gap-2">
            Demander un devis <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
