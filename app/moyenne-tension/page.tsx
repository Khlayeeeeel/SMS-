import { Factory, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moyenne Tension - SMS Solaire",
  description: "Installations solaires moyenne tension pour industriels et grandes structures en Tunisie.",
};

export default function MoyenneTensionPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-padding pt-[120px]">
      <div className="flex flex-col items-start gap-6 max-w-3xl">
        <div className="w-12 h-12 bg-primary-fixed rounded flex items-center justify-center text-technical-blue">
          <Factory size={32} />
        </div>
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary">Moyenne Tension</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Installations industrielles haute capacité conçues pour réduire les coûts opérationnels et améliorer la durabilité. Nous maîtrisons les projets de grande envergure pour les usines, entrepôts et complexes industriels.
        </p>
        <ul className="list-disc list-inside font-body-md text-body-md text-on-surface-variant space-y-2">
          <li>Centrales de 100 kWc à plusieurs MWc</li>
          <li>Optimisation du bilan énergétique</li>
          <li>Intégration bâtiment et ombrières</li>
          <li>Étude de rentabilité personnalisée</li>
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
