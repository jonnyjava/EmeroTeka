'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import { CatalogHeader } from './CatalogHeader.tsx';
import { PredictiveLocationSearchBar } from './PredictiveLocationSearchBar.tsx';
import { ResponsiveArticleGrid } from './ResponsiveArticleGrid.tsx';
import { MagazineShowcase } from './MagazineShowcase.tsx';
import { ArticleDetailModal } from './ArticleDetailModal.tsx';
import { ArticleDTO } from '../domain/Article.ts';
import { MagazineSummary } from '../domain/IArticleRepository.ts';
import { searchArticlesAction } from '@/app/actions/search.ts';
import { Compass } from 'lucide-react';

interface TravelCatalogAppProps {
  initialMagazines: MagazineSummary[];
  initialArticles: ArticleDTO[];
  initialDestinations?: string[];
}

export const TravelCatalogApp: React.FC<TravelCatalogAppProps> = ({
  initialMagazines,
  initialArticles,
  initialDestinations,
}) => {
  const [query, setQuery] = useState('');
  const [selectedMagazineId, setSelectedMagazineId] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [articles, setArticles] = useState<ArticleDTO[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<ArticleDTO | null>(null);
  const [isSearching, startTransition] = useTransition();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced server action search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        const response = await searchArticlesAction({
          query,
          magazineId: selectedMagazineId,
          year: selectedYear,
        });

        if (response.success) {
          setArticles(response.articles);
        }
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedMagazineId, selectedYear]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedMagazineId(undefined);
    setSelectedYear(undefined);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleFocusSearch = () => {
    const element = document.getElementById('buscador');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1B275E] flex flex-col font-sans selection:bg-[#2A3E92] selection:text-white">
      {/* Top Bar Header in Lonely Planet St Tropaz palette */}
      <CatalogHeader
        onSearchFocus={handleFocusSearch}
        totalArticles={articles.length}
      />

      {/* Hero Marquee Section (Pre-2022 Lonely Planet Guidebook & Magazine Aesthetic) */}
      <section className="relative border-b-2 border-[#DCE2EE] bg-white overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Lonely Planet Spine Tab Decoration (Left Vertical Accent) */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-3 bg-[#2A3E92]" />

        {/* Subtle Travel Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2A3E92_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          {/* Top Spine Ribbon / Metadata Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#EEF2FF] border border-[#CCD5EE] rounded-md text-xs font-mono text-[#2A3E92] font-bold tracking-wider uppercase shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#FFC72C] inline-block ring-2 ring-[#2A3E92]" />
            <span>Tipografía National Geographic (Geograph & Caslon) · Paleta St Tropaz</span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-[#1B275E] font-normal">Hemeroteca Histórica</span>
          </div>

          {/* Main Title in Authoritative Editorial Serif with St Tropaz Blue tone */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#1B275E] leading-[1.12] text-balance">
            Catálogo Histórico de Artículos de Viajes
          </h1>

          <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Descubre con precisión milimétrica en qué revista, año, número y páginas se publicaron crónicas, mapas y reportajes de autor sobre cualquier destino o rincón del planeta.
          </p>

          {/* Guidebook Stats Strip (Pre-2022 LP Chapter Index Style) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono">
            <div className="bg-[#F8F9FC] px-3 py-1.5 rounded-lg border border-[#CCD5EE] text-[#1B275E] font-semibold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#2A3E92]" />
              <span>6 revistas internacionales</span>
            </div>
            <div className="bg-[#F8F9FC] px-3 py-1.5 rounded-lg border border-[#CCD5EE] text-[#1B275E] font-semibold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0098B8]" />
              <span>23 volúmenes indexados</span>
            </div>
            <div className="bg-[#F8F9FC] px-3 py-1.5 rounded-lg border border-[#CCD5EE] text-[#1B275E] font-semibold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
              <span>Citas y páginas exactas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* 1) Predictive Search Bar (St Tropaz #2A3E92 & Lonely Planet Chapter Card) */}
        <PredictiveLocationSearchBar
          query={query}
          onQueryChange={setQuery}
          selectedMagazineId={selectedMagazineId}
          onMagazineChange={setSelectedMagazineId}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          magazines={initialMagazines}
          popularDestinations={initialDestinations}
          totalResults={articles.length}
          isLoading={isSearching}
          onReset={handleResetFilters}
          inputRef={searchInputRef}
        />

        {/* Results Stream Section */}
        <section aria-labelledby="resultados-titulo" className="space-y-6">
          <div className="flex items-center justify-between pb-3.5 border-b-2 border-[#DCE2EE]">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-[#2A3E92] rounded-full hidden sm:block" />
              <h3 id="resultados-titulo" className="font-serif text-xl sm:text-2xl font-bold text-[#1B275E]">
                {query ? `Artículos para "${query}"` : 'Artículos Indexados en la Colección'}
              </h3>
              <span className="font-mono text-xs text-[#2A3E92] font-bold bg-[#EEF2FF] border border-[#CCD5EE] px-2.5 py-0.5 rounded-md tabular-nums">
                {articles.length} {articles.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>

            {(query || selectedMagazineId || selectedYear) && (
              <span className="text-xs text-[#475569] hidden sm:inline font-medium">
                Filtros activos:{' '}
                {[
                  query && `"${query}"`,
                  selectedMagazineId && initialMagazines.find((m) => m.id === selectedMagazineId)?.name,
                  selectedYear && `Año ${selectedYear}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            )}
          </div>

          {/* 2) Responsive Article Cards Grid with St Tropaz Simulated Covers */}
          <ResponsiveArticleGrid
            articles={articles}
            onSelectArticle={setSelectedArticle}
            onClearFilters={handleResetFilters}
          />
        </section>

        {/* 3) Magazine Collection Archive Showcase */}
        <MagazineShowcase
          magazines={initialMagazines}
          selectedMagazineId={selectedMagazineId}
          onSelectMagazine={(id) => {
            setSelectedMagazineId(id);
            handleFocusSearch();
          }}
        />
      </main>

      {/* Bibliographic Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Footer in Editorial Deep St Tropaz Blue */}
      <footer className="bg-[#141E46] text-white border-t-4 border-[#FFC72C] py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2A3E92] rounded-lg border border-white/20">
              <Compass className="w-5 h-5 text-[#FFC72C]" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-wider uppercase block text-white">
                Emero.tk Viaggi
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Catálogo Histórico Bibliográfico de Revistas de Viajes
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-mono">
            <span>Next.js 15 App Router</span>
            <span>·</span>
            <span>Clean Architecture / DDD</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
