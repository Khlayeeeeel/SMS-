import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMS Solaire | Votre partenaire pour l'énergie solaire en Tunisie",
  description: "Expertise en photovoltaïque et pompage solaire en Tunisie. Solutions résidentielles, industrielles et agricoles.",
  openGraph: {
    title: "SMS Solaire",
    description: "Votre partenaire pour l'énergie solaire en Tunisie",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="light">
      <body className="min-h-screen flex flex-col pt-16">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
