'use client';

import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

interface CatalogHeaderProps {
  onSearchFocus: () => void;
  totalArticles: number;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = () => {
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
                Emero.tk
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
