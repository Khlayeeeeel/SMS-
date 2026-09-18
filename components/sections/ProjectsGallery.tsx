"use client";

import React, { useState, useMemo } from "react";
import { MapPin, ArrowRight, Search, X, CheckCircle, Zap, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { projects, zones, types } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ProjectsGallery() {
  const [activeZone, setActiveZone] = useState("Toutes");
  const [activeType, setActiveType] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const zoneMatch = activeZone === "Toutes" || p.zone === activeZone;
      const typeMatch = activeType === "Tous" || p.type === activeType;
      const searchMatch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.zone.toLowerCase().includes(searchQuery.toLowerCase());

      return zoneMatch && typeMatch && searchMatch;
    });
  }, [activeZone, activeType, searchQuery]);

  return (
    <div>
      {/* Search & Filter Header Control Bar */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm mb-12 space-y-6">
        
        {/* Search Bar Input */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/60">
            <Search className="w-5 h-5" />
          </div>
          <Input
            type="text"
            placeholder="Rechercher par nom de projet, ville ou mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-surface-container-low border-outline-variant/40 text-sm focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills Grid */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between pt-4 border-t border-outline-variant/20">
          
          {/* Zone Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mr-2">Zone :</span>
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setActiveZone(z)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                  activeZone === z
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                )}
              >
                {z}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mr-2">Type :</span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                  activeType === t
                    ? "bg-yellow-600 text-white shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                )}
              >
                {t}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((project) => (
          <article
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-64 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${project.image}')` }}
                />
                <div className={cn("absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-md", project.badgeColor)}>
                  {project.badge}
                </div>
                {project.beforeAfter && (
                  <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-md text-xs shadow-md font-bold">
                    Avant / Après
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-surface-container-lowest/90 backdrop-blur text-primary px-3 py-1 rounded-lg text-xs shadow-sm font-semibold flex items-center gap-1">
                  <MapPin size={14} /> {project.zone}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-montserrat text-xl font-bold text-primary mb-2 group-hover:text-yellow-600 transition-colors">
                  {project.title}
                </h3>
                <p className="font-inter text-sm text-on-surface-variant mb-4 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-on-surface-variant">{project.metricLabel}</span>
                  <span className="font-montserrat font-bold text-base text-technical-blue">{project.power}</span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-yellow-600 transition-colors"
                >
                  <span>Voir Fiche Technique</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
          <p className="font-montserrat text-lg font-semibold text-on-surface">Aucun projet ne correspond à votre recherche.</p>
          <p className="text-sm text-on-surface-variant mt-1">Essayez de modifier les filtres ou le terme de recherche.</p>
          <Button variant="outline" onClick={() => { setActiveZone("Toutes"); setActiveType("Tous"); setSearchQuery(""); }} className="mt-4">
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Project Detail Modal Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/40 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-72 w-full">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${selectedProject.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-sm", selectedProject.badgeColor)}>
                  {selectedProject.badge}
                </span>
                <h2 className="font-montserrat text-2xl font-bold">{selectedProject.title}</h2>
                <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> Gouvernorat de {selectedProject.zone}, Tunisie
                </p>
              </div>
            </div>

            {/* Modal Body Specs */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Présentation du Projet</h4>
                <p className="text-sm text-on-surface leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Technical Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-surface-gray p-4 rounded-xl border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-[11px] text-on-surface-variant font-medium">Puissance System</p>
                    <p className="font-bold text-sm text-primary">{selectedProject.power}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-technical-blue shrink-0" />
                  <div>
                    <p className="text-[11px] text-on-surface-variant font-medium">Grille STEG</p>
                    <p className="font-bold text-sm text-primary">Approuvé & Certifié</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                  <Calendar className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-[11px] text-on-surface-variant font-medium">Garantie</p>
                    <p className="font-bold text-sm text-primary">25 Ans Rendement</p>
                  </div>
                </div>
              </div>

              {/* Tech Specs Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Points Forts de l'Installation</h4>
                <ul className="space-y-1.5 text-xs text-on-surface">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Modules photovoltaïques monocristallins haute efficacité (&gt;21% rendement).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Onduleur réseau certifié conforme aux normes STEG en Tunisie.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Structure de montage en aluminium anodisé résistant aux conditions climatiques.</span>
                  </li>
                </ul>
              </div>

              {/* CTA Action inside Modal */}
              <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedProject(null)}>
                  Fermer
                </Button>
                <a href="/devis">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xs">
                    Demander un Devis Semblable
                  </Button>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
