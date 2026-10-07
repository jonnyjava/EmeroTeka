'use client';

import React, { useRef } from 'react';
import { Search, X, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { MagazineSummary } from '../domain/IArticleRepository.ts';

interface LocationSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedMagazineId?: number;
  onMagazineChange: (magazineId?: number) => void;
  selectedYear?: number;
  onYearChange: (year?: number) => void;
  magazines: MagazineSummary[];
  popularDestinations: string[];
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
  totalResults,
  isLoading,
  onReset,
  inputRef,
}) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || internalRef;

  const availableYears = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
    2014, 2011, 2008, 2006, 2005, 2003, 1999, 1997, 1994,
  ];

  const hasActiveFilters = Boolean(query || selectedMagazineId || selectedYear);

  return (
    <div id="buscador" className="w-full bg-white border border-stone-200 rounded-xl shadow-xs p-6 md:p-8">
      {/* Category / Context Lead */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-stone-600 block mb-1">
            Índice de Destinos y Hemeroteca
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 tracking-tight">
            Localizador Bibliográfico de Artículos
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Ingresa una ciudad, país o región para descubrir con precisión milimétrica la revista, volumen, año y páginas exactas donde fue publicado.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors py-1 px-2.5 rounded-md hover:bg-stone-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer filtros</span>
          </button>
        )}
      </div>

      {/* Main Search Input & Filters Grid */}
      <div className="space-y-4">
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-stone-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={activeInputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Escribe una localidad (ej. Petra, Kioto, Cusco, Svalbard, Positano, Granada)..."
            className="w-full pl-12 pr-12 py-3.5 bg-stone-50 hover:bg-stone-50/80 focus:bg-white border border-stone-300 focus:border-stone-800 rounded-lg text-base text-stone-900 placeholder:text-stone-600 transition-all focus:outline-hidden focus:ring-1 focus:ring-stone-800"
          />

          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="absolute right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Secondary Select Controls: Magazine & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {/* Magazine Filter */}
          <div className="flex flex-col gap-1">
            <label htmlFor="select-magazine" className="text-xs font-medium text-stone-600">
              Filtrar por Revista
            </label>
            <select
              id="select-magazine"
              value={selectedMagazineId || ''}
              onChange={(e) =>
                onMagazineChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:border-stone-800 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Todas las Revistas ({magazines.length})</option>
              {magazines.map((mag) => (
                <option key={mag.id} value={mag.id}>
                  {mag.name} ({mag.articlesCount} arts)
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col gap-1">
            <label htmlFor="select-year" className="text-xs font-medium text-stone-600">
              Año de Publicación
            </label>
            <select
              id="select-year"
              value={selectedYear || ''}
              onChange={(e) =>
                onYearChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:border-stone-800 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Cualquier época (1994 - 2024)</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Active status tracker */}
          <div className="flex flex-col justify-end">
            <div className="h-10 px-3 py-2 flex items-center justify-between text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-600">
              <span className="font-mono text-stone-600">Estado del índice:</span>
              <span className="font-medium text-stone-900 tabular-nums">
                {isLoading ? (
                  <span className="inline-block animate-pulse">Buscando...</span>
                ) : (
                  `${totalResults} artículos encontrados`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Popular Destination Pill Buttons (Interactive Filter Controls) */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-stone-600 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <MapPin className="w-3.5 h-3.5 text-stone-600" />
            Destinos clave:
          </span>

          {popularDestinations.slice(0, 10).map((dest) => {
            const isSelected = query.toLowerCase() === dest.toLowerCase();
            return (
              <button
                key={dest}
                type="button"
                onClick={() => onQueryChange(dest)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white font-medium shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {dest}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
