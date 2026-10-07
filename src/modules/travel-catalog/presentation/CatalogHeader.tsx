'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Search, Layers, Compass } from 'lucide-react';

interface CatalogHeaderProps {
  onSearchFocus: () => void;
  onOpenArchitecture: () => void;
  totalArticles: number;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  onSearchFocus,
  onOpenArchitecture,
  totalArticles,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E6CCB2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-baseline gap-2.5 text-[#0F2027] tracking-tight transition-opacity hover:opacity-80"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#0F2027]">
              Archivia Viaggi
            </span>
            <span className="hidden sm:inline font-sans text-xs tracking-widest uppercase text-[#203A43] font-semibold">
              Catálogo de Revistas
            </span>
          </Link>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A5568]">
          <a
            href="#buscador"
            onClick={(e) => {
              e.preventDefault();
              onSearchFocus();
            }}
            className="hover:text-[#0F2027] transition-colors"
          >
            Buscar por Localidad
          </a>
          <a
            href="#revistas"
            className="hover:text-[#0F2027] transition-colors"
          >
            Revistas Indexadas
          </a>
          <button
            type="button"
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 text-[#4A5568] hover:text-[#0F2027] transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#203A43]" />
            <span>Arquitectura DDD</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSearchFocus}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F2027] bg-white border border-[#E6CCB2] rounded-lg hover:bg-[#F5EBE0] hover:border-[#D4A373] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-[#203A43]" />
            <span className="hidden sm:inline">Explorar Archivo</span>
            <span className="font-mono text-[11px] text-[#203A43] tabular-nums font-bold">
              ({totalArticles})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
