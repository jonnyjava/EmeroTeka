'use client';

import React, { useRef } from 'react';
import { Search, X, MapPin, SlidersHorizontal, RotateCcw, Tag } from 'lucide-react';
import { MagazineSummary } from '../domain/IArticleRepository.ts';

interface LocationSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedMagazineId?: number;
  onMagazineChange: (magazineId?: number) => void;
  selectedYear?: number;
  onYearChange: (year?: number) => void;
  magazines: MagazineSummary[];
  popularDestinations?: string[];
  popularTopics?: string[];
  totalResults: number;
  isLoading: boolean;
  onReset: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  query,
  onQueryChange,
  selectedMagazineId,
  onMagazineChange,
  selectedYear,
  onYearChange,
  magazines,
  popularDestinations,
  popularTopics,
  totalResults,
  isLoading,
  onReset,
  inputRef,
}) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || internalRef;

  const topicsList = popularTopics || popularDestinations || [];

  const availableYears = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
    2014, 2011, 2008, 2006, 2005, 2003, 1999, 1997, 1994,
  ];

  const hasActiveFilters = Boolean(query || selectedMagazineId || selectedYear);

  return (
    <div id="buscador" className="w-full bg-white border-2 border-[#DCE2EE] rounded-2xl shadow-xs p-6 md:p-8">
      {/* Category / Context Lead */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b-2 border-[#DCE2EE]">
        <div>
          <span className="text-xs uppercase tracking-wider font-mono text-[#2A3E92] font-bold block mb-1">
            Índice de Temáticas y Hemeroteca
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B275E] tracking-tight">
            Localizador Bibliográfico de Artículos
          </h2>
          <p className="text-sm text-[#475569] mt-1 max-w-2xl leading-relaxed">
            Ingresa una temática, ciudad o reporte para descubrir con precisión milimétrica la revista, volumen, año y páginas exactas donde fue publicado.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-[#2A3E92] hover:text-[#1E2D69] flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#CCD5EE] hover:bg-[#EEF2FF] transition-colors cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* Main Search Input */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#2A3E92]">
            <Search className="w-5 h-5 text-[#2A3E92]" />
          </div>

          <input
            ref={activeInputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar por temática o destino (ej. Petra, Kioto, Arqueología, Svalbard, Positano)..."
            className="w-full pl-12 pr-28 py-3.5 bg-[#F8FAFC] border-2 border-[#CCD5EE] focus:border-[#2A3E92] focus:bg-white rounded-xl text-base text-[#1B275E] placeholder:text-slate-400 font-medium transition-all shadow-2xs focus:outline-hidden focus:ring-4 focus:ring-[#2A3E92]/15"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => {
                  onQueryChange('');
                  if (activeInputRef.current) activeInputRef.current.focus();
                }}
                className="p-1 rounded-full text-slate-400 hover:text-[#2A3E92] transition-colors cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <span className="font-mono text-xs text-[#2A3E92] font-bold bg-[#EEF2FF] border border-[#CCD5EE] px-2.5 py-1 rounded-md tabular-nums">
              {isLoading ? '...' : `${totalResults} resultados`}
            </span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label
              htmlFor="legacy-mag-select"
              className="text-xs font-mono uppercase tracking-wider text-[#1B275E] font-bold block mb-1"
            >
              Revista
            </label>
            <select
              id="legacy-mag-select"
              value={selectedMagazineId || ''}
              onChange={(e) =>
                onMagazineChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 text-sm bg-white border-2 border-[#DCE2EE] focus:border-[#2A3E92] rounded-lg text-[#1B275E] font-medium transition-colors cursor-pointer"
            >
              <option value="">Todas las Revistas</option>
              {magazines.map((mag) => (
                <option key={mag.id} value={mag.id}>
                  {mag.name} ({mag.articlesCount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="legacy-year-select"
              className="text-xs font-mono uppercase tracking-wider text-[#1B275E] font-bold block mb-1"
            >
              Año
            </label>
            <select
              id="legacy-year-select"
              value={selectedYear || ''}
              onChange={(e) =>
                onYearChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 text-sm bg-white border-2 border-[#DCE2EE] focus:border-[#2A3E92] rounded-lg text-[#1B275E] font-medium transition-colors cursor-pointer"
            >
              <option value="">Todos los Años</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Topics */}
        {topicsList.length > 0 && (
          <div className="pt-3 border-t-2 border-[#DCE2EE] flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-[#2A3E92] font-bold uppercase mr-1">
              Temáticas:
            </span>
            {topicsList.slice(0, 8).map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => onQueryChange(topic)}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                  query.toLowerCase() === topic.toLowerCase()
                    ? 'bg-[#2A3E92] text-white border-[#2A3E92] font-bold'
                    : 'bg-[#F8FAFC] text-[#1B275E] border-[#CCD5EE] hover:bg-[#EEF2FF] hover:border-[#2A3E92]'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
