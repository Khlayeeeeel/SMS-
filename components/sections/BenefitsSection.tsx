import { Leaf, Banknote, Settings2 } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "Énergie Gratuite & Propre",
    description: "Éliminez votre dépendance au gasoil ou au réseau électrique instable. Le soleil couvre vos besoins d'irrigation.",
  },
  {
    icon: Banknote,
    title: "Subventions Étatiques",
    description: "Bénéficiez d'aides financières importantes (FNAAP, ANME) pour réduire considérablement votre investissement initial.",
  },
  {
    icon: Settings2,
    title: "Fiabilité Technique",
    description: "Systèmes robustes avec variateurs de fréquence intelligents pour protéger la pompe et optimiser le débit d'eau.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-section-padding bg-surface-gray px-margin-mobile md:px-gutter">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">
            Pourquoi choisir le pompage solaire ?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Une solution technique éprouvée, conçue pour les contraintes climatiques et économiques des agriculteurs tunisiens.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-surface rounded-xl p-6 border border-outline-variant/30 hover:border-technical-blue/50 transition-colors flex flex-col gap-4"
            >
              <b.icon size={40} className="text-technical-blue" />
              <h3 className="font-headline-md text-headline-md text-primary">{b.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
