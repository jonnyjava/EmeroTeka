'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Globe,
  Compass,
  X,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MagazineSummary } from '../domain/IArticleRepository';

export interface PredictiveLocationSearchBarProps {
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

export const PredictiveLocationSearchBar: React.FC<PredictiveLocationSearchBarProps> = ({
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
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const localInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || localInputRef;

  // Filter suggestions based on current query
  const suggestions = popularDestinations.filter((dest) =>
    dest.toLowerCase().includes(query.trim().toLowerCase())
  );

  const showDropdown = isFocused && query.trim().length > 0 && suggestions.length > 0;

  // Handle keyboard navigation in suggestions dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        onQueryChange(suggestions[selectedIndex]);
        setIsFocused(false);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const handleSelectDestination = (destination: string) => {
    onQueryChange(destination);
    setIsFocused(false);
    if (activeInputRef.current) {
      activeInputRef.current.focus();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        activeInputRef.current &&
        !activeInputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeInputRef]);

  const hasActiveFilters = Boolean(query || selectedMagazineId || selectedYear);

  return (
    <div
      id="buscador"
      className="relative w-full bg-[#FAF6F0] border border-[#E6CCB2]/80 rounded-2xl shadow-sm p-6 sm:p-8 transition-all duration-300"
    >
      {/* Decorative top accent line with deep ocean to warm sand gradient */}
      <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#D4A373] rounded-t-full" />

      {/* Header with Title and Reset Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-5 border-b border-[#E6CCB2]/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase text-[#203A43] font-semibold bg-[#EBDDCF] px-2.5 py-0.5 rounded-full">
              <Compass className="w-3.5 h-3.5 text-[#0F2027]" />
              Catálogo de Expediciones
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F2027] tracking-tight">
            Localizador Predictivo de Artículos
          </h2>

          <p className="text-sm text-[#4A5568] mt-1.5 max-w-2xl leading-relaxed">
            Escribe el nombre de una ciudad, región o país para descubrir la revista, volumen, año y páginas exactas de publicación.
          </p>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="self-start md:self-auto text-xs text-[#203A43] hover:text-[#0F2027] hover:bg-[#EBDDCF]/60 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer búsqueda</span>
          </Button>
        )}
      </div>

      {/* Predictive Search Bar with Modern Travel Icons */}
      <div className="space-y-4">
        <div className="relative">
          <div className="relative flex items-center">
            {/* Leading Icon: Deep Blue Accent */}
            <div className="absolute left-4.5 pointer-events-none text-[#203A43]">
              {isLoading ? (
                <Compass className="w-5 h-5 animate-spin text-[#0F2027]" />
              ) : (
                <Search className="w-5 h-5 text-[#0F2027]" />
              )}
            </div>

            <input
              ref={activeInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                onQueryChange(e.target.value);
                setSelectedIndex(-1);
              }}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar por ciudad, país o región (ej. Petra, Kioto, Cusco, Svalbard, Positano, Granada)..."
              className="w-full pl-13 pr-24 py-4 bg-white hover:bg-white/95 focus:bg-white border-2 border-[#E6CCB2] focus:border-[#0F2027] rounded-xl text-base text-[#0F2027] placeholder:text-stone-400 font-medium transition-all shadow-xs focus:outline-hidden focus:ring-3 focus:ring-[#0F2027]/10"
            />

            {/* Trailing Controls: Clear Icon + Live Status */}
            <div className="absolute right-3.5 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    onQueryChange('');
                    if (activeInputRef.current) activeInputRef.current.focus();
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-[#0F2027] hover:bg-stone-100 transition-colors"
                  aria-label="Limpiar campo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <Badge
                variant="sand"
                className="hidden sm:inline-flex text-[11px] font-mono py-0.5 px-2 bg-[#F5EBE0] text-[#0F2027] border-[#D4A373]/40"
              >
                {totalResults} {totalResults === 1 ? 'artículo' : 'artículos'}
              </Badge>
            </div>
          </div>

          {/* Predictive Dropdown Suggestions */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-[#E6CCB2] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="px-3 py-2 bg-[#FAF6F0] border-b border-[#E6CCB2]/50 flex items-center justify-between text-xs text-[#203A43] font-mono">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                  Localidades coincidentes en el índice
                </span>
                <span className="text-[11px] text-stone-500">
                  Usa ↑ ↓ para navegar · Enter para elegir
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-stone-100">
                {suggestions.map((dest, idx) => {
                  const isHighlighted = idx === selectedIndex;
                  return (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => handleSelectDestination(dest)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                        isHighlighted
                          ? 'bg-[#0F2027] text-white'
                          : 'hover:bg-[#FAF6F0] text-[#0F2027]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-md ${
                            isHighlighted
                              ? 'bg-white/10 text-white'
                              : 'bg-[#F5EBE0] text-[#0F2027]'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-medium text-sm block">
                            {dest}
                          </span>
                          <span
                            className={`text-xs block ${
                              isHighlighted ? 'text-stone-300' : 'text-stone-500'
                            }`}
                          >
                            Ver artículos indexados en revistas
                          </span>
                        </div>
                      </div>

                      <ArrowRight
                        className={`w-4 h-4 ${
                          isHighlighted ? 'text-white' : 'text-stone-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filter Controls Row (Shadcn styled Selects) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {/* Magazine Filter */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="filter-magazine"
              className="text-xs font-semibold text-[#0F2027] flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#203A43]" />
              Revista Publicada
            </label>
            <select
              id="filter-magazine"
              value={selectedMagazineId || ''}
              onChange={(e) =>
                onMagazineChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6CCB2] rounded-lg text-[#0F2027] font-medium focus:outline-hidden focus:border-[#0F2027] transition-all shadow-2xs cursor-pointer"
            >
              <option value="">Todas las Revistas ({magazines.length})</option>
              {magazines.map((mag) => (
                <option key={mag.id} value={mag.id}>
                  {mag.name} ({mag.articlesCount} artículos)
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="filter-year"
              className="text-xs font-semibold text-[#0F2027] flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#203A43]" />
              Año de Publicación
            </label>
            <select
              id="filter-year"
              value={selectedYear || ''}
              onChange={(e) =>
                onYearChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E6CCB2] rounded-lg text-[#0F2027] font-medium focus:outline-hidden focus:border-[#0F2027] transition-all shadow-2xs cursor-pointer"
            >
              <option value="">Cualquier Año (1994 - 2024)</option>
              {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2011, 2008, 2006, 2005, 2003, 1999, 1997, 1994].map(
                (yr) => (
                  <option key={yr} value={yr}>
                    Año {yr}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Live Status Metric Card */}
          <div className="flex flex-col justify-end">
            <div className="h-10 px-4 py-2 flex items-center justify-between text-xs bg-white border border-[#E6CCB2] rounded-lg text-[#203A43]">
              <span className="font-mono flex items-center gap-1.5 text-stone-600">
                <Globe className="w-3.5 h-3.5 text-[#0F2027]" />
                Estado del índice:
              </span>
              <span className="font-semibold text-[#0F2027] tabular-nums font-mono">
                {isLoading ? 'Consultando...' : `${totalResults} resultados`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Travel Destination Chips (Warm Sand / Deep Ocean) */}
        <div className="pt-3.5 border-t border-[#E6CCB2]/50 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#203A43] font-semibold flex items-center gap-1.5 mr-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
            Destinos destacados:
          </span>

          {popularDestinations.slice(0, 10).map((dest) => {
            const isSelected = query.toLowerCase() === dest.toLowerCase();
            return (
              <button
                key={dest}
                type="button"
                onClick={() => handleSelectDestination(dest)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F2027] text-white font-semibold shadow-xs ring-2 ring-[#0F2027]/20'
                    : 'bg-white hover:bg-[#F5EBE0] text-[#0F2027] border border-[#E6CCB2] hover:border-[#D4A373]'
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
