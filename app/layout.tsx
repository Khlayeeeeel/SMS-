import type { Metadata } from "next";
import { ClientLayout } from "@/components/layout/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMS Solaire | Votre partenaire pour l'énergie solaire en Tunisie",
  description: "Expertise en photovoltaïque et pompage solaire en Tunisie. Solutions résidentielles, industrielles et agricoles.",
  icons: {
    icon: "/SMS.svg",
    shortcut: "/SMS.svg",
    apple: "/SMS.svg",
  },
  openGraph: {
    title: "SMS Solaire",
    description: "Votre partenaire pour l'énergie solaire en Tunisie",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="light">
      <body className="min-h-screen bg-background antialiased font-inter">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
