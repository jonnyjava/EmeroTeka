'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import { CatalogHeader } from './CatalogHeader.tsx';
import { PredictiveLocationSearchBar } from './PredictiveLocationSearchBar.tsx';
import { ResponsiveArticleGrid } from './ResponsiveArticleGrid.tsx';
import { MagazineShowcase } from './MagazineShowcase.tsx';
import { ArticleDetailModal } from './ArticleDetailModal.tsx';
import { ArchitectureInfoModal } from './ArchitectureInfoModal.tsx';
import { ArticleDTO } from '../domain/Article.ts';
import { MagazineSummary } from '../domain/IArticleRepository.ts';
import { searchArticlesAction } from '@/app/actions/search.ts';
import { Compass, BookOpen, Layers, Search, Sparkles } from 'lucide-react';

interface TravelCatalogAppProps {
  initialMagazines: MagazineSummary[];
  initialArticles: ArticleDTO[];
  initialDestinations: string[];
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
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#0F2027] flex flex-col font-sans selection:bg-[#0F2027] selection:text-white">
      {/* Top Bar Header */}
      <CatalogHeader
        onSearchFocus={handleFocusSearch}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        totalArticles={articles.length}
      />

      {/* Hero Marquee Section (Deep Blue & Warm Sand Palette) */}
      <section className="relative border-b border-[#E6CCB2] overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#F5EBE0]/80 to-[#FAF6F0] pt-14 pb-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-[#E6CCB2] rounded-full text-xs font-mono text-[#0F2027] tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#1E3A8A] inline-block animate-pulse" />
            <span>Persistencia en PostgreSQL Cloud SQL · Domain-Driven Design (DDD)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#0F2027] leading-[1.12] text-balance">
            Catálogo Histórico de Revistas de Viajes
          </h1>

          <p className="text-base sm:text-lg text-[#4A5568] max-w-2xl mx-auto leading-relaxed">
            Localiza con exactitud en qué revista, año, número y páginas se han publicado crónicas y reportajes sobre cualquier ciudad o paraje del mundo.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#203A43]">
            <span className="bg-[#FAF6F0] px-2.5 py-1 rounded-md border border-[#E6CCB2]">
              6 revistas de referencia
            </span>
            <span>·</span>
            <span className="bg-[#FAF6F0] px-2.5 py-1 rounded-md border border-[#E6CCB2]">
              23 números indexados
            </span>
            <span>·</span>
            <span className="bg-[#FAF6F0] px-2.5 py-1 rounded-md border border-[#E6CCB2]">
              Localidades con índices y páginas exactas
            </span>
          </div>
        </div>
      </section>

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* 1) Predictive Location Search Bar with Modern Travel Icons */}
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
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E6CCB2]/80">
            <div className="flex items-center gap-2.5">
              <h3 id="resultados-titulo" className="font-serif text-xl sm:text-2xl font-bold text-[#0F2027]">
                {query ? `Artículos para "${query}"` : 'Artículos Indexados en el Archivo'}
              </h3>
              <span className="font-mono text-xs text-[#0F2027] font-semibold bg-[#EBDDCF] px-2.5 py-0.5 rounded-full tabular-nums">
                {articles.length} {articles.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>

            {(query || selectedMagazineId || selectedYear) && (
              <span className="text-xs text-[#4A5568] hidden sm:inline font-medium">
                Filtros:{' '}
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

          {/* 2) Responsive Article Cards Grid */}
          <ResponsiveArticleGrid
            articles={articles}
            onSelectArticle={setSelectedArticle}
            onClearFilters={handleResetFilters}
          />
        </section>

        {/* Magazine Showcase Grid */}
        <MagazineShowcase
          magazines={initialMagazines}
          selectedMagazineId={selectedMagazineId}
          onSelectMagazine={(id) => {
            setSelectedMagazineId(id);
            handleFocusSearch();
          }}
        />
      </main>

      {/* Modals */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <ArchitectureInfoModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="mt-20 border-t border-[#E6CCB2] bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-[#4A5568] font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-[#0F2027]">
              Archivia Viaggi
            </span>{' '}
            · Catálogo Bibliográfico de Revistas de Viajes
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setIsArchitectureOpen(true)}
              className="text-[#0F2027] hover:text-[#1E3A8A] underline transition-colors cursor-pointer"
            >
              Arquitectura DDD & Capas
            </button>
            <span className="text-[#203A43]">PostgreSQL en Google Cloud SQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
