'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Globe,
  Compass,
  X,
  RotateCcw,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  Tag,
  Bookmark,
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
  popularTopics?: string[];
  popularDestinations?: string[];
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
  popularTopics,
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

  const topicsList = popularTopics || popularDestinations || [];

  // Filter suggestions based on current query
  const suggestions = topicsList.filter((topic) =>
    topic.toLowerCase().includes(query.trim().toLowerCase())
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

  const handleSelectTopic = (topic: string) => {
    onQueryChange(topic);
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
      className="relative w-full bg-white border-2 border-[#DCE2EE] rounded-2xl shadow-sm p-6 sm:p-8 transition-all duration-300 overflow-hidden"
    >
      {/* Lonely Planet Guide Chapter Stripe: St Tropaz #2A3E92 with Sunflower Gold #FFC72C */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#2A3E92] flex">
        <div className="w-20 bg-[#FFC72C]" />
        <div className="w-12 bg-[#0098B8]" />
        <div className="flex-1 bg-[#2A3E92]" />
      </div>

      {/* Header with Title and Reset Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-5 border-b-2 border-[#DCE2EE] pt-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-[#2A3E92] font-bold bg-[#EEF2FF] px-2.5 py-1 rounded-md border border-[#CCD5EE]">
              <Compass className="w-3.5 h-3.5 text-[#2A3E92]" />
              Guía de Búsqueda · Lonely Planet Index
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B275E] tracking-tight">
            Localizador Predictivo por Temática y Destino
          </h2>

          <p className="text-sm text-[#475569] mt-1.5 max-w-2xl leading-relaxed">
            Escribe el nombre de cualquier temática, paraje o reportaje para descubrir la revista, volumen, año y páginas exactas de publicación.
          </p>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="self-start md:self-auto text-xs font-bold text-[#2A3E92] hover:text-[#1E2D69] hover:bg-[#EEF2FF] flex items-center gap-1.5 border border-[#CCD5EE] rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer búsqueda</span>
          </Button>
        )}
      </div>

      {/* Predictive Search Bar with St Tropaz #2A3E92 Focus States */}
      <div className="space-y-4">
        <div className="relative">
          <div className="relative flex items-center">
            {/* Leading Icon: St Tropaz Accent */}
            <div className="absolute left-4.5 pointer-events-none text-[#2A3E92]">
              {isLoading ? (
                <Compass className="w-5 h-5 animate-spin text-[#2A3E92]" />
              ) : (
                <Search className="w-5 h-5 text-[#2A3E92]" />
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
              placeholder="Buscar temática o destino (ej. Petra, Kioto, Arqueología, Svalbard, Positano, Altiplano)..."
              className="w-full pl-13 pr-32 py-4 bg-[#F8FAFC] hover:bg-white focus:bg-white border-2 border-[#CCD5EE] focus:border-[#2A3E92] rounded-xl text-base text-[#1B275E] placeholder:text-slate-400 font-medium transition-all shadow-xs focus:outline-hidden focus:ring-4 focus:ring-[#2A3E92]/15"
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
                  className="p-1 rounded-full text-slate-400 hover:text-[#2A3E92] hover:bg-[#EEF2FF] transition-colors"
                  aria-label="Limpiar campo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <Badge
                className="hidden sm:inline-flex text-[11px] font-mono py-0.5 px-2 bg-[#EEF2FF] text-[#2A3E92] border border-[#CCD5EE] font-bold rounded-md"
              >
                {totalResults} {totalResults === 1 ? 'artículo' : 'artículos'}
              </Badge>
            </div>
          </div>

          {/* Predictive Dropdown Suggestions */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border-2 border-[#DCE2EE] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#DCE2EE] flex items-center justify-between text-xs text-[#2A3E92] font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFC72C]" />
                  Temáticas coincidentes en el índice impreso
                </span>
                <span className="text-[11px] text-slate-500">
                  Usa ↑ ↓ para navegar · Enter para seleccionar
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-[#EEF2FF]">
                {suggestions.map((topic, idx) => {
                  const isHighlighted = idx === selectedIndex;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleSelectTopic(topic)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                        isHighlighted
                          ? 'bg-[#2A3E92] text-white'
                          : 'hover:bg-[#EEF2FF] text-[#1B275E]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-md ${
                            isHighlighted
                              ? 'bg-white/20 text-white'
                              : 'bg-[#EEF2FF] text-[#2A3E92]'
                          }`}
                        >
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm block">
                            {topic}
                          </span>
                          <span
                            className={`text-xs block ${
                              isHighlighted ? 'text-white/80' : 'text-slate-500'
                            }`}
                          >
                            Ver artículos indexados en el catálogo
                          </span>
                        </div>
                      </div>

                      <ArrowRight
                        className={`w-4 h-4 ${
                          isHighlighted ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filter Controls Row in Lonely Planet Palette */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {/* Magazine Filter */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="filter-magazine"
              className="text-xs font-bold text-[#1B275E] flex items-center gap-1.5 font-mono uppercase tracking-wider"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2A3E92]" />
              Revista Publicada
            </label>
            <select
              id="filter-magazine"
              value={selectedMagazineId || ''}
              onChange={(e) =>
                onMagazineChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-[#DCE2EE] focus:border-[#2A3E92] rounded-lg text-[#1B275E] font-medium focus:outline-hidden transition-all shadow-2xs cursor-pointer"
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
              className="text-xs font-bold text-[#1B275E] flex items-center gap-1.5 font-mono uppercase tracking-wider"
            >
              <Calendar className="w-3.5 h-3.5 text-[#2A3E92]" />
              Año de Edición
            </label>
            <select
              id="filter-year"
              value={selectedYear || ''}
              onChange={(e) =>
                onYearChange(e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3.5 py-2.5 text-sm bg-white border-2 border-[#DCE2EE] focus:border-[#2A3E92] rounded-lg text-[#1B275E] font-medium focus:outline-hidden transition-all shadow-2xs cursor-pointer"
            >
              <option value="">Cualquier Época (1994 - 2024)</option>
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
            <div className="h-10 px-4 py-2 flex items-center justify-between text-xs bg-[#F8FAFC] border-2 border-[#DCE2EE] rounded-lg text-[#1B275E]">
              <span className="font-mono flex items-center gap-1.5 text-slate-600 font-semibold">
                <Globe className="w-3.5 h-3.5 text-[#2A3E92]" />
                Estado del índice:
              </span>
              <span className="font-bold text-[#2A3E92] tabular-nums font-mono">
                {isLoading ? 'Consultando...' : `${totalResults} resultados`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Topic Chips (St Tropaz & Lonely Planet pre-2022 Guidebook Index style) */}
        <div className="pt-3.5 border-t-2 border-[#DCE2EE] flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] font-bold flex items-center gap-1.5 mr-1 shrink-0">
            <Tag className="w-3.5 h-3.5 text-[#FFC72C]" />
            Índice rápido:
          </span>

          {topicsList.slice(0, 10).map((topic) => {
            const isSelected = query.toLowerCase() === topic.toLowerCase();
            return (
              <button
                key={topic}
                type="button"
                onClick={() => handleSelectTopic(topic)}
                className={`text-xs px-3.5 py-1.5 rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-[#2A3E92] text-white shadow-sm ring-2 ring-[#2A3E92]/30 font-bold'
                    : 'bg-[#F8FAFC] hover:bg-[#EEF2FF] text-[#1B275E] border border-[#CCD5EE] hover:border-[#2A3E92] hover:text-[#2A3E92]'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
