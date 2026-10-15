'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  User,
  BookOpen,
  ArrowUpRight,
  Compass,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArticleDTO } from '../domain/Article';

export interface ResponsiveArticleGridProps {
  articles: ArticleDTO[];
  onSelectArticle: (article: ArticleDTO) => void;
  onClearFilters?: () => void;
}

export const ResponsiveArticleGrid: React.FC<ResponsiveArticleGridProps> = ({
  articles,
  onSelectArticle,
  onClearFilters,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Empty State */}
      {articles.length === 0 ? (
        <div className="py-20 px-6 text-center bg-white border-2 border-dashed border-[#CCD5EE] rounded-2xl max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#EEF2FF] text-[#2A3E92] flex items-center justify-center mx-auto shadow-inner border border-[#CCD5EE]">
            <Compass className="w-7 h-7 text-[#2A3E92]" />
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#1B275E]">
            No hay artículos indexados para esta búsqueda
          </h3>

          <p className="text-sm text-[#475569] leading-relaxed">
            No se han encontrado registros con esos criterios en la base de datos de revistas. Prueba buscando destinos como{' '}
            <strong className="text-[#2A3E92]">Petra</strong>, <strong className="text-[#2A3E92]">Kioto</strong>,{' '}
            <strong className="text-[#2A3E92]">Cusco</strong>, <strong className="text-[#2A3E92]">Svalbard</strong> o{' '}
            <strong className="text-[#2A3E92]">Samarcanda</strong>.
          </p>

          {onClearFilters && (
            <Button
              variant="voyage"
              size="sm"
              onClick={onClearFilters}
              className="mt-2 bg-[#2A3E92] hover:bg-[#1E2D69] text-white font-bold cursor-pointer"
            >
              Restablecer filtros
            </Button>
          )}
        </div>
      ) : (
        /* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <IndexedMagazineCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface IndexedMagazineCardProps {
  article: ArticleDTO;
  onSelect: (article: ArticleDTO) => void;
}

const IndexedMagazineCard: React.FC<IndexedMagazineCardProps> = ({
  article,
  onSelect,
}) => {
  const [imageError, setImageError] = useState(false);

  // Distinct branding details for simulated covers
  const isLonelyPlanet = article.magazine.name.toLowerCase().includes('lonely planet');
  const isNatGeo = article.magazine.name.toLowerCase().includes('national geographic');
  const isCondeNast = article.magazine.name.toLowerCase().includes('condé');
  const isGeo = article.magazine.name.toLowerCase().includes('geo');
  const isAltair = article.magazine.name.toLowerCase().includes('altaïr');

  // Publication date string
  const publicationDate = article.magazine.month
    ? `${article.magazine.month} ${article.magazine.year}`
    : `Año ${article.magazine.year}`;

  return (
    <Card
      onClick={() => onSelect(article)}
      className="group relative flex flex-col justify-between bg-white border-2 border-[#DCE2EE] hover:border-[#2A3E92] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
    >
      {/* 1. SIMULATED MAGAZINE COVER (PORTADA SIMULADA ESTILO LONELY PLANET) */}
      <div className="relative w-full h-64 sm:h-72 bg-[#1B275E] overflow-hidden">
        {/* Cover Image Background */}
        {article.magazine.coverImageUrl && !imageError ? (
          <Image
            src={article.magazine.coverImageUrl}
            alt={`Portada simulada de ${article.magazine.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1B275E] via-[#2A3E92] to-[#141E46] text-white p-6 text-center">
            <Compass className="w-10 h-10 text-[#FFC72C] mb-2" />
            <span className="font-serif text-lg font-bold">
              {article.magazine.name}
            </span>
          </div>
        )}

        {/* Realistic Magazine Scrim Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141E46]/95 via-[#1B275E]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Lonely Planet spine edge simulation on the left */}
        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

        {/* Special Lonely Planet Spine Bookmark Ribbon on Cover */}
        {isLonelyPlanet && (
          <div className="absolute top-0 right-14 z-20 bg-[#FFC72C] text-[#1B275E] font-mono text-[9px] font-bold px-2 py-1 shadow-md uppercase tracking-wider rounded-b">
            LP Official
          </div>
        )}

        {/* Simulated Magazine Header Masthead */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
          <div
            className={`px-3 py-1 rounded text-[11px] font-mono tracking-wider uppercase font-bold shadow-md ${
              isLonelyPlanet
                ? 'bg-[#2A3E92] text-white border-2 border-white ring-2 ring-[#2A3E92]'
                : isNatGeo
                ? 'bg-[#FFD100] text-black border-2 border-black font-display tracking-widest font-black'
                : isCondeNast
                ? 'bg-white text-slate-900 font-display tracking-widest'
                : isGeo
                ? 'bg-[#14532D] text-white'
                : isAltair
                ? 'bg-[#9A3412] text-white'
                : 'bg-[#2A3E92] text-white border border-white/20'
            }`}
          >
            {article.magazine.name}
          </div>

          {/* Issue Number Badge */}
          <div className="bg-[#141E46]/85 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-mono text-white border border-white/20 tabular-nums font-semibold shadow-xs">
            Nº {article.magazine.issueNumber}
          </div>
        </div>

        {/* 2. REFERENCIA EDITORIAL DE LA REVISTA */}
        <div className="absolute bottom-3.5 left-4 right-4 z-10">
          <div className="bg-white/95 backdrop-blur-md border border-[#CCD5EE] rounded-xl p-3 shadow-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-[#2A3E92] text-white shrink-0 shadow-xs">
                <BookOpen className="w-4 h-4 text-[#FFC72C]" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#2A3E92] block font-bold">
                  Referencia de Hemeroteca
                </span>
                <span className="font-serif font-bold text-base text-[#1B275E] truncate block leading-tight">
                  {article.magazine.name} · {article.pageCitation}
                </span>
              </div>
            </div>

            <ArrowUpRight className="w-4 h-4 text-[#2A3E92] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>
        </div>
      </div>

      {/* 3. CARD BODY: METRICS & CITATION */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Strip: Páginas y Fecha de Publicación */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#F8F9FC] rounded-xl border border-[#DCE2EE] text-xs">
          {/* Páginas Destacadas con Icono de Libro */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-white text-[#2A3E92] border border-[#CCD5EE]">
              <BookOpen className="w-3.5 h-3.5 text-[#2A3E92]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#64748B] block leading-none mb-0.5 font-bold">
                Páginas
              </span>
              <span className="font-mono font-bold text-[#2A3E92] tabular-nums block text-xs">
                {article.pageCitation}
              </span>
            </div>
          </div>

          {/* Fecha de Publicación Destacada */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-white text-[#2A3E92] border border-[#CCD5EE]">
              <Calendar className="w-3.5 h-3.5 text-[#2A3E92]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#64748B] block leading-none mb-0.5 font-bold">
                Publicación
              </span>
              <span className="font-semibold text-[#1B275E] block text-xs truncate">
                {publicationDate}
              </span>
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="font-serif font-bold text-lg text-[#1B275E] group-hover:text-[#2A3E92] transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          {article.subtitle && (
            <p className="text-xs text-[#64748B] italic mt-1 line-clamp-1">
              {article.subtitle}
            </p>
          )}

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-[#475569] mt-2.5 line-clamp-3 leading-relaxed">
            {article.synopsis}
          </p>
        </div>

        {/* Authorship & CTA */}
        <div className="pt-3 border-t border-[#DCE2EE] flex items-center justify-between text-xs text-[#64748B]">
          <div className="truncate max-w-[180px]">
            {article.author ? (
              <span className="flex items-center gap-1.5 truncate text-[#1B275E]">
                <User className="w-3.5 h-3.5 text-[#2A3E92] shrink-0" />
                <span className="truncate font-semibold">{article.author}</span>
              </span>
            ) : (
              <span className="text-slate-400">Redacción editorial</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-bold text-[#2A3E92] hover:text-[#1E2D69] hover:bg-[#EEF2FF] gap-1 cursor-pointer"
          >
            <span>Ver ficha</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
