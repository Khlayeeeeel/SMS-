import Link from "next/link";
import { Home, Factory, Droplets, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Home,
    title: "Basse Tension",
    description: "Solutions solaires optimisées pour les habitations et les petites entreprises, garantissant une indépendance énergétique.",
    href: "/basse-tension",
  },
  {
    icon: Factory,
    title: "Moyenne Tension",
    description: "Installations industrielles haute capacité conçues pour réduire les coûts opérationnels et améliorer la durabilité.",
    href: "/moyenne-tension",
  },
  {
    icon: Droplets,
    title: "Pompage Solaire",
    description: "Systèmes d'irrigation alimentés par l'énergie solaire, idéaux pour le secteur agricole tunisien exigeant.",
    href: "/pompage-solaire",
  },
];

export function ServicesSection() {
  return (
    <section className="py-section-padding px-margin-mobile md:px-gutter bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">Nos Solutions d&apos;Ingénierie</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Conçues pour maximiser la performance et minimiser l&apos;empreinte énergétique.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-shadow">
              <CardContent className="flex flex-col items-start gap-4">
                <div className="w-12 h-12 bg-primary-fixed rounded flex items-center justify-center text-technical-blue mb-2">
                  <service.icon size={32} />
                </div>
                <h3 className="font-headline-md text-headline-md text-primary">{service.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">{service.description}</p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 font-label-sm text-label-sm text-technical-blue mt-4 group hover:text-primary transition-colors"
                >
                  En savoir plus
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
