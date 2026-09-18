import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MessageCircle } from "lucide-react";

const quickLinks = [
  { href: "/basse-tension", label: "Basse Tension" },
  { href: "/moyenne-tension", label: "Moyenne Tension" },
  { href: "/pompage-solaire", label: "Pompage Solaire" },
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
      <div className="max-w-container-max mx-auto px-gutter py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand & Socials Column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="inline-block">
            <img
              src="/SMS.svg"
              alt="SMS Solaire"
              className="h-14 w-auto object-contain brightness-0 invert opacity-95 hover:opacity-100 transition-opacity"
            />
          </Link>
          <p className="font-inter text-xs text-on-primary/80 leading-relaxed">
            &copy; 2026 SMS Solaire. Tous droits réservés. Expertise en Photovoltaïque & Pompage Solaire en Tunisie.
          </p>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.facebook.com/share/1CDGcx5WH1/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook SMS Solaire"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-secondary-container hover:text-deep-charcoal flex items-center justify-center transition-all duration-200"
            >
              <Facebook size={18} />
            </a>

            <a
              href="https://www.instagram.com/sms_energy_?stkn=Y3J2NDd5MXdjb3ox"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram SMS Energy"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-secondary-container hover:text-deep-charcoal flex items-center justify-center transition-all duration-200"
            >
              <Instagram size={18} />
            </a>

            <a
              href="https://wa.me/21654525769"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp SMS Solaire"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all duration-200"
            >
              <MessageCircle size={18} />
            </a>

            <a
              href="mailto:Mokninesolaire@gmail.com"
              aria-label="Email SMS Solaire"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-secondary-container hover:text-deep-charcoal flex items-center justify-center transition-all duration-200"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-montserrat text-sm font-bold uppercase tracking-wider text-secondary-container">Navigation</h4>
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-inter text-xs text-on-primary/80 hover:text-secondary-container transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Informational Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-montserrat text-sm font-bold uppercase tracking-wider text-secondary-container">Informations</h4>
          {infoLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-inter text-xs text-on-primary/80 hover:text-secondary-container transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Direct Contact Info Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-montserrat text-sm font-bold uppercase tracking-wider text-secondary-container">Contact Direct</h4>
          <a
            href="mailto:Mokninesolaire@gmail.com"
            className="flex items-center gap-2.5 text-xs text-on-primary/80 hover:text-white transition-colors"
          >
            <Mail size={16} className="text-secondary-container shrink-0" />
            <span>Mokninesolaire@gmail.com</span>
          </a>

          <a
            href="https://wa.me/21654525769"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-xs text-on-primary/80 hover:text-white transition-colors"
          >
            <Phone size={16} className="text-secondary-container shrink-0" />
            <span>+216 54 525 769 (WhatsApp)</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
