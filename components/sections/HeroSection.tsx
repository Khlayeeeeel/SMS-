import Link from "next/link";
import { Zap, Sun, ShieldCheck, TrendingUp, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "500+", label: "Installations Solaires", icon: Sun },
  { value: "15+ MWp", label: "Puissance Installée", icon: Zap },
  { value: "-70%", label: "Facture STEG Réduite", icon: TrendingUp },
  { value: "100%", label: "Conformité STEG", icon: ShieldCheck },
];

export function HeroSection() {
  return (
    <header className="relative w-full overflow-hidden bg-gradient-to-b from-surface-gray via-background to-surface-container-low py-16 md:py-24 px-margin-mobile md:px-gutter mt-16">
      {/* Ambient Solar Background Glow Accents */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00204508_1px,transparent_1px),linear-gradient(to_bottom,#00204508_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-container-max mx-auto relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="md:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-container/20 border border-secondary-container/40 rounded-full text-label-sm font-semibold text-primary shadow-sm backdrop-blur-sm">
              <Zap size={16} className="text-secondary animate-pulse" />
              <span>Leader du Photovoltaïque & Pompage Solaire en Tunisie</span>
            </div>

            <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary leading-[1.15] tracking-tight">
              Transformez le soleil tunisien en <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600">énergie rentable</span>
            </h1>

            <p className="font-inter text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Des solutions d&apos;ingénierie photovoltaïque certifiées pour les secteurs <strong className="text-primary">résidentiel, industriel et agricole</strong>. Réduisez vos coûts STEG et sécurisez votre indépendance énergétique.
            </p>

            <div className="flex flex-wrap gap-4 mt-2 w-full sm:w-auto">
              <Link href="/devis">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 px-6 py-3.5">
                  <span>Simuler Mes Économies STEG</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white font-bold px-6 py-3.5">
                  Demander un Devis Gratuit
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Showcase Photo with Glassmorphism Overlay Cards */}
          <div className="md:col-span-5 relative">
            <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80">
              <div
                className="bg-cover bg-center w-full h-full absolute inset-0 transform hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3rmcU1phBtqj8wTCLM66sOfE6BBbeZhtMuocaIe4rP2KWx0lmL2QkiRWGRK_JOMqdvcabPERwPQes4MfBJkI8uR0IDjvso-fadoO-L0rfx3JX-eCyjUqWWxgNaDlSZ9hISIHjXpvF2gQDMEcJJa0BiSTI6q3DyrYIsBwdVYEDDdtgAQiO3tzkMshK0XR1LXCLjFDK9-lpPPYns3I9FGCpy5K9tBzzYUSWy2oh5RGz14U92vzoSqtc4w')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            </div>

            {/* Floating Glass Card Top Right */}
            <div className="absolute -top-6 -right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 flex items-center gap-3 hidden sm:flex">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                <Award size={22} />
              </div>
              <div>
                <p className="font-bold text-xs text-primary">Garantie Matériel</p>
                <p className="text-[11px] text-on-surface-variant font-medium">25 Ans Rendement Panneau</p>
              </div>
            </div>

            {/* Floating Glass Card Bottom Left */}
            <div className="absolute -bottom-6 -left-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 flex items-center gap-3 hidden sm:flex">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center font-bold">
                <Sun size={22} />
              </div>
              <div>
                <p className="font-bold text-xs text-primary">Autonomie Solaire</p>
                <p className="text-[11px] text-on-surface-variant font-medium">Pompage & Centrale Raccordée</p>
              </div>
            </div>
          </div>

        </div>

        {/* Live Statistics Strip Bar */}
        <div className="mt-16 pt-8 border-t border-outline-variant/30 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <div key={idx} className="bg-white/60 backdrop-blur-md p-4 rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <st.icon size={20} />
              </div>
              <div>
                <div className="font-montserrat text-xl sm:text-2xl font-extrabold text-primary">{st.value}</div>
                <div className="text-xs font-semibold text-on-surface-variant">{st.label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </header>
  );
}
