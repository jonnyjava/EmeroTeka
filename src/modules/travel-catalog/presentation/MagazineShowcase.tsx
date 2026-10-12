'use client';

import React from 'react';
import { ArrowRight, BookOpen, Compass, Award } from 'lucide-react';
import { MagazineSummary } from '../domain/IArticleRepository.ts';

interface MagazineShowcaseProps {
  magazines: MagazineSummary[];
  selectedMagazineId?: number;
  onSelectMagazine: (magazineId?: number) => void;
}

export const MagazineShowcase: React.FC<MagazineShowcaseProps> = ({
  magazines,
  selectedMagazineId,
  onSelectMagazine,
}) => {
  return (
    <section id="revistas" className="w-full mt-16 pt-12 border-t-2 border-[#DCE2EE]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#FFC72C] rounded-xs" />
            <span className="text-xs uppercase tracking-wider font-mono text-[#2A3E92] font-bold block">
              Hemeroteca & Ediciones de Referencia
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B275E] tracking-tight">
            Colección de Revistas y Guías Indexadas
          </h2>
          <p className="text-sm text-[#475569] mt-1.5 max-w-2xl leading-relaxed">
            Publicaciones geográficas, crónicas de expedición y guías de viaje registradas en la base de datos PostgreSQL de Cloud SQL, estructuradas por números y páginas exactas.
          </p>
        </div>

        {selectedMagazineId && (
          <button
            type="button"
            onClick={() => onSelectMagazine(undefined)}
            className="text-xs text-[#2A3E92] hover:text-[#1E2D69] font-bold py-1.5 px-3.5 rounded-lg border-2 border-[#CCD5EE] bg-white hover:bg-[#EEF2FF] transition-colors cursor-pointer self-start md:self-auto shadow-2xs"
          >
            Ver todas las publicaciones
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {magazines.map((mag) => {
          const isSelected = selectedMagazineId === mag.id;
          const isLonelyPlanet = mag.name.toLowerCase().includes('lonely planet');

          return (
            <div
              key={mag.id}
              onClick={() => onSelectMagazine(isSelected ? undefined : mag.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#2A3E92] text-white border-[#2A3E92] shadow-xl ring-4 ring-[#2A3E92]/20'
                  : 'bg-white text-[#1B275E] border-[#DCE2EE] hover:border-[#2A3E92] hover:shadow-md'
              }`}
            >
              {/* Special Pre-2022 Lonely Planet Badge on LP Magazine */}
              {isLonelyPlanet && (
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-bl-lg tracking-wider ${
                    isSelected
                      ? 'bg-[#FFC72C] text-[#1B275E]'
                      : 'bg-[#FFC72C] text-[#1B275E]'
                  }`}
                >
                  Referente Guías
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-mono tracking-wider uppercase font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isLonelyPlanet
                        ? 'bg-[#EEF2FF] text-[#2A3E92] border border-[#CCD5EE]'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {mag.country || 'Internacional'}
                  </span>
                  <div
                    className={`flex items-center gap-2 text-xs font-mono tabular-nums font-semibold ${
                      isSelected ? 'text-white/80' : 'text-slate-500'
                    }`}
                  >
                    <span>{mag.issuesCount} núms</span>
                    <span>·</span>
                    <span>{mag.articlesCount} artículos</span>
                  </div>
                </div>

                <h3
                  className={`text-xl ${
                    mag.name.toLowerCase().includes('national geographic')
                      ? 'font-display tracking-wider font-extrabold uppercase text-lg sm:text-xl'
                      : 'font-serif font-bold tracking-tight'
                  } ${
                    isSelected ? 'text-white' : 'text-[#1B275E]'
                  }`}
                >
                  {mag.name}
                </h3>

                {mag.publisher && (
                  <p
                    className={`text-xs mt-1 font-medium ${
                      isSelected ? 'text-white/80' : 'text-slate-500'
                    }`}
                  >
                    Editorial: {mag.publisher}
                  </p>
                )}

                {mag.description && (
                  <p
                    className={`text-xs leading-relaxed mt-3 line-clamp-3 ${
                      isSelected ? 'text-white/90' : 'text-[#475569]'
                    }`}
                  >
                    {mag.description}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/40 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-white' : 'text-[#2A3E92]'}>
                  {isSelected ? 'Filtro activo' : 'Filtrar por esta revista'}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? 'translate-x-1 text-white' : 'text-[#2A3E92]'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
