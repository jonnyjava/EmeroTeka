'use client';

import React from 'react';
import Image from 'next/image';
import { BookOpen, Globe, FileText, ArrowRight } from 'lucide-react';
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
    <section id="revistas" className="w-full mt-16 pt-12 border-t border-[#E6CCB2]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#203A43] font-semibold block mb-1">
            Hemeroteca Especializada
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F2027] tracking-tight">
            Revistas de Viajes en el Archivo
          </h2>
          <p className="text-sm text-[#4A5568] mt-1.5 max-w-2xl leading-relaxed">
            Publicaciones geográficas y de expedición indexadas en la base de datos relacional de Cloud SQL, estructuradas por números y páginas de artículo.
          </p>
        </div>

        {selectedMagazineId && (
          <button
            type="button"
            onClick={() => onSelectMagazine(undefined)}
            className="text-xs text-[#0F2027] hover:text-[#1E3A8A] font-semibold py-1.5 px-3.5 rounded-lg border border-[#E6CCB2] bg-white hover:bg-[#F5EBE0] transition-colors cursor-pointer self-start md:self-auto shadow-2xs"
          >
            Ver todas las publicaciones
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {magazines.map((mag) => {
          const isSelected = selectedMagazineId === mag.id;

          return (
            <div
              key={mag.id}
              onClick={() => onSelectMagazine(isSelected ? undefined : mag.id)}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#0F2027] text-white border-[#0F2027] shadow-xl ring-2 ring-[#0F2027]/20'
                  : 'bg-white text-[#0F2027] border-[#E6CCB2] hover:border-[#0F2027] hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-mono tracking-widest uppercase font-semibold ${
                      isSelected ? 'text-[#D4A373]' : 'text-[#203A43]'
                    }`}
                  >
                    {mag.country || 'Internacional'}
                  </span>
                  <div
                    className={`flex items-center gap-2 text-xs font-mono tabular-nums ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    <span>{mag.issuesCount} núms</span>
                    <span>·</span>
                    <span>{mag.articlesCount} artículos</span>
                  </div>
                </div>

                <h3
                  className={`text-xl font-serif font-bold tracking-tight ${
                    isSelected ? 'text-white' : 'text-[#0F2027]'
                  }`}
                >
                  {mag.name}
                </h3>

                {mag.publisher && (
                  <p
                    className={`text-xs mt-1 ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    Editorial: {mag.publisher}
                  </p>
                )}

                {mag.description && (
                  <p
                    className={`text-xs leading-relaxed mt-3 line-clamp-3 ${
                      isSelected ? 'text-stone-300' : 'text-[#4A5568]'
                    }`}
                  >
                    {mag.description}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100/20 flex items-center justify-between text-xs font-medium">
                <span className={isSelected ? 'text-[#D4A373]' : 'text-stone-500'}>
                  {isSelected ? 'Filtro activo' : 'Filtrar por esta revista'}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? 'translate-x-1 text-[#D4A373]' : 'text-stone-400'
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
