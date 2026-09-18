import Link from "next/link";
import { MapPin, Phone, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const regions = [
  { name: "Monastir & Moknine", count: "180+ Projets", status: "Siège Principal", highlight: true },
  { name: "Sousse & Kantaoui", count: "140+ Projets", status: "Équipe Disponible", highlight: false },
  { name: "Mahdia & El Jem", count: "95+ Projets", status: "Station Agricole & Pompage", highlight: false },
  { name: "Sfax & Zone Industrielle", count: "60+ Projets", status: "Projets Industriels", highlight: false },
  { name: "Tunis & Grand Tunis", count: "50+ Projets", status: "Résidentiel & Tertiaire", highlight: false },
  { name: "Nabeul & Cap Bon", count: "40+ Projets", status: "Installation Réseau", highlight: false },
];

export function RegionalCoverageSection() {
  return (
    <section className="py-20 px-margin-mobile md:px-gutter bg-primary text-on-primary relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-technical-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-container-max mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
          
          <div className="md:w-1/2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-secondary-container">
              <ShieldCheck size={16} />
              <span>Présence & Réactivité sur le Terrain</span>
            </div>
            <h2 className="font-montserrat text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Expertise solaire déployée au cœur de la Tunisie
            </h2>
            <p className="font-inter text-body-md text-on-primary/80 leading-relaxed">
              Forts d&apos;une présence établie à Moknine et dans toute la région du Sahel et de la Tunisie, nous garantissons des interventions rapides sous 24h et une prise en charge complète du dossier STEG.
            </p>
          </div>

          <div className="md:w-1/2 flex flex-col items-start md:items-end justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3 max-w-md">
              <p className="font-bold text-sm text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary-container" />
                Intervention & Maintenance Technique Directe
              </p>
              <p className="text-xs text-on-primary/80">
                Nos équipes d'ingénieurs et techniciens se déplacent dans tous les gouvernorats pour la maintenance et l'installation.
              </p>
              <Link href="/contact" className="inline-block pt-1">
                <Button variant="secondary" size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xs flex items-center gap-2">
                  <span>Contacter l'Équipe Régionale</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>

        </div>

        {/* Governorates Interactive Coverage Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((reg, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                reg.highlight
                  ? "bg-gradient-to-br from-white/15 to-white/5 border-secondary-container/50 shadow-lg"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-montserrat font-bold text-lg text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary-container shrink-0" />
                    {reg.name}
                  </span>
                  <span className="px-2.5 py-1 bg-secondary-container/20 text-secondary-container text-[11px] font-bold rounded-full">
                    {reg.count}
                  </span>
                </div>
                <p className="text-xs text-on-primary/70">{reg.status}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-secondary-container font-semibold">
                <span>Équipe Technique active</span>
                <span>En savoir plus &rarr;</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
