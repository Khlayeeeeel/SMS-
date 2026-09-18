import { MapPin } from "lucide-react";

const locations = ["Monastir", "Mahdia", "Sousse"];

export function RegionalCoverageSection() {
  return (
    <section className="py-section-padding px-margin-mobile md:px-gutter bg-primary text-on-primary">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-6">
            Expertise déployée au cœur de la Tunisie
          </h2>
          <p className="font-body-md text-body-md text-on-primary/80 mb-8">
            Forts d&apos;une présence établie dans les régions clés, nous garantissons des interventions rapides et un suivi de proximité pour tous vos projets d&apos;énergie solaire.
          </p>
          <div className="flex flex-wrap gap-4">
            {locations.map((loc) => (
              <span
                key={loc}
                className="px-4 py-2 bg-primary-container border border-outline-variant/30 rounded text-label-sm font-label-sm text-inverse-primary flex items-center gap-2"
              >
                <MapPin size={18} /> {loc}
              </span>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 w-full h-[300px] bg-primary-container rounded-xl overflow-hidden border border-outline-variant/20 relative">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYvhh7USMy4-RLEQQkgVCsN1eDkdNUmGvtPzG-Pr269ZSr4wjO6NL3zuJPNjnzJzdoKgBKgCVqyhSWW_7tlFOTLBCbMUx54GAoWtz_qJ-pllfnjfyQ3pooXq06LN9ErQGSjxqqX-gUbL2_saAwlcjVhoGx5FOoD3DUfAl-nO3fVlBBcgnKF3XAH9Agqxr-7YzjPtI-1nDiftEOIcqyfmE0UjDRot_gTXCHGpW88c7CuHMaMIKrnOGMiA"
            alt="Carte des zones d'intervention"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      </div>
    </section>
  );
}
