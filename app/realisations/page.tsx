import { ProjectsGallery } from "@/components/sections/ProjectsGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réalisations - SMS Solaire",
  description: "Découvrez nos projets d'installation photovoltaïque et de pompage solaire à travers la Tunisie.",
};

export default function RealisationsPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter py-section-padding pt-[120px]">
      <section className="text-center mb-16">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary mb-4">Nos Réalisations</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Découvrez nos projets d&apos;installation de panneaux photovoltaïques et de pompage solaire à travers la Tunisie.
        </p>
      </section>
      <ProjectsGallery />
    </main>
  );
}
