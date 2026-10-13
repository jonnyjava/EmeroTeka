'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, BookOpen, Layers, Search, Globe, Bookmark } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#DCE2EE] shadow-2xs">
      {/* Lonely Planet Spine Brand Stripe (St Tropaz #2A3E92 & Sunflower Gold #FFC72C) */}
      <div className="h-1.5 w-full bg-[#2A3E92] flex">
        <div className="w-24 bg-[#FFC72C]" />
        <div className="w-16 bg-[#0098B8]" />
        <div className="flex-1 bg-[#2A3E92]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Identity & Editorial Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-3 text-[#1B275E] tracking-tight transition-opacity hover:opacity-95"
          >
            {/* Lonely Planet Guidebook Spine Box Tag */}
            <div className="flex items-center gap-2 bg-[#2A3E92] text-white px-3.5 py-1.5 rounded-lg shadow-sm border border-[#1B275E]/40">
              <Compass className="w-4 h-4 text-[#FFC72C]" />
              <span className="font-display text-lg sm:text-xl font-bold tracking-widest text-white uppercase">
                Archivia
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-bold text-[#1B275E] leading-tight tracking-wider uppercase">
                Viaggi
              </span>
              <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase text-[#2A3E92] font-bold">
                Revistas & Crónicas
              </span>
            </div>

            <span className="hidden md:inline font-mono text-[10px] tracking-wider uppercase text-[#2A3E92] font-bold bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#CCD5EE]">
              NatGeo Type
            </span>
          </Link>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]">
          <a
            href="#buscador"
            onClick={(e) => {
              e.preventDefault();
              onSearchFocus();
            }}
            className="hover:text-[#2A3E92] transition-colors font-semibold flex items-center gap-1.5"
          >
            <span>Explorar Destinos</span>
          </a>
          <a
            href="#revistas"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('revistas');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#2A3E92] transition-colors font-semibold"
          >
            Hemeroteca de Revistas
          </a>
          <button
            type="button"
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 text-[#475569] hover:text-[#2A3E92] transition-colors cursor-pointer font-semibold"
          >
            <Layers className="w-3.5 h-3.5 text-[#2A3E92]" />
            <span>Arquitectura DDD</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action (St Tropaz #2A3E92 Button with Gold Accent) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSearchFocus}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2A3E92] hover:bg-[#1E2D69] active:bg-[#141E46] rounded-lg transition-all whitespace-nowrap cursor-pointer shadow-sm border border-[#1B275E]/50"
          >
            <Search className="w-3.5 h-3.5 text-[#FFC72C]" />
            <span className="hidden sm:inline">Explorar Archivo</span>
            <span className="font-mono text-[11px] bg-[#FFC72C] text-[#1B275E] px-1.5 py-0.2 rounded font-bold tabular-nums">
              {totalArticles}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
