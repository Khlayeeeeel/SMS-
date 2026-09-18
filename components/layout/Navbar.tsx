"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/basse-tension", label: "Basse Tension" },
  { href: "/moyenne-tension", label: "Moyenne Tension" },
  { href: "/pompage-solaire", label: "Pompage Solaire" },
  { href: "/realisations", label: "Realisations" },
  { href: "/devis", label: "Simulateur" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-container-max mx-auto px-gutter md:px-margin-mobile flex justify-between items-center py-4">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
          SMS Solaire
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-body-md text-body-md font-medium transition-colors duration-200 pb-1",
                pathname === link.href
                  ? "text-primary border-b-2 border-primary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/contact" className="hidden md:block">
          <Button variant="secondary" size="sm" className="bg-yellow-600 hover:bg-orange-700 text-white">Contact</Button>
        </Link>

        <button
          className="md:hidden text-primary p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant/30 px-gutter py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-body-md text-body-md font-medium py-2",
                pathname === link.href ? "text-primary font-bold" : "text-on-surface-variant"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMobileOpen(false)}>
            <Button variant="secondary" size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">Contact</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
