"use client";

import React, { useState, useMemo } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projects, zones, types } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ProjectsGallery() {
  const [activeZone, setActiveZone] = useState("Toutes");
  const [activeType, setActiveType] = useState("Tous");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const zoneMatch = activeZone === "Toutes" || p.zone === activeZone;
      const typeMatch = activeType === "Tous" || p.type === activeType;
      return zoneMatch && typeMatch;
    });
  }, [activeZone, activeType]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between p-6 bg-surface-container-low rounded-lg border border-outline-variant/30 mb-12">
        <div className="w-full md:w-auto flex flex-col gap-2">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Filtrer par Zone</label>
          <div className="flex flex-wrap gap-2">
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => setActiveZone(z)}
                className={cn(
                  "px-4 py-2 rounded-full border font-label-sm text-label-sm transition-colors",
                  activeZone === z
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline text-on-surface-variant hover:border-primary hover:text-primary"
                )}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-auto flex flex-col gap-2">
          <label className="font-label-sm text-label-sm text-on-surface-variant">Filtrer par Type</label>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={cn(
                  "px-4 py-2 rounded-full border font-label-sm text-label-sm transition-colors",
                  activeType === t
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline text-on-surface-variant hover:border-primary hover:text-primary"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((project) => (
          <article
            key={project.id}
            className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-64 overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              <div className={cn("absolute top-4 left-4 px-3 py-1 rounded-full font-label-sm text-label-sm shadow-md", project.badgeColor)}>
                {project.badge}
              </div>
              {project.beforeAfter && (
                <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded font-label-sm text-label-sm shadow-md font-bold">
                  Avant / Après
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-surface-container-lowest/90 backdrop-blur text-primary px-3 py-1 rounded font-label-sm text-label-sm shadow-sm flex items-center gap-1">
                <MapPin size={16} /> {project.zone}
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-headline-md text-headline-md text-primary mb-2">{project.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">{project.description}</p>
              <div className="flex items-center gap-4 border-t border-outline-variant/30 pt-4 mt-auto">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">{project.metricLabel}</span>
                  <span className="font-headline-md text-[18px] text-technical-blue">{project.power}</span>
                </div>
                <div className="flex flex-col ml-auto">
                  <span className="text-technical-blue hover:text-primary font-label-sm text-label-sm flex items-center gap-1 cursor-pointer">
                    Détails <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">Aucun projet ne correspond aux filtres sélectionnés.</div>
      )}

      <div className="mt-12 text-center">
        <Button variant="outline">Charger Plus de Réalisations</Button>
      </div>
    </div>
  );
}
