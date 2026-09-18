import Link from "next/link";

const quickLinks = [
  { href: "/basse-tension", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/devis", label: "Simulateur de Devis" },
];

const infoLinks = [
  { href: "/contact", label: "Contactez-nous" },
  { href: "#", label: "Mentions Légales" },
  { href: "#", label: "Politique de Confidentialité" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-on-primary border-t border-primary-container">
      <div className="max-w-container-max mx-auto px-gutter py-section-padding flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4 max-w-sm">
          <span className="font-headline-md text-headline-md font-bold">SMS Solaire</span>
          <p className="font-body-md text-body-md text-on-primary/80">
            &copy; 2026 SMS Solaire. Tous droits réservés. Expertise en Photovoltaïque & Pompage.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label-sm text-label-sm text-on-primary/80 hover:text-secondary-fixed transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {infoLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-label-sm text-label-sm text-on-primary/80 hover:text-secondary-fixed transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
