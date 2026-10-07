'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  FileText,
  User,
  Camera,
  BookOpen,
  ArrowUpRight,
  Bookmark,
  Compass,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        <div className="py-20 px-6 text-center bg-[#FAF6F0] border-2 border-dashed border-[#E6CCB2] rounded-2xl max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#F5EBE0] text-[#0F2027] flex items-center justify-center mx-auto shadow-inner">
            <Compass className="w-7 h-7 text-[#0F2027]" />
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#0F2027]">
            No hay artículos indexados para esta búsqueda
          </h3>

          <p className="text-sm text-[#4A5568] leading-relaxed">
            No se han encontrado registros con esos criterios de localidad o fecha. Intenta con destinos como <strong className="text-[#0F2027]">Petra</strong>, <strong className="text-[#0F2027]">Kioto</strong>, <strong className="text-[#0F2027]">Cusco</strong>, <strong className="text-[#0F2027]">Svalbard</strong> o <strong className="text-[#0F2027]">Granada</strong>.
          </p>

          {onClearFilters && (
            <Button
              variant="voyage"
              size="sm"
              onClick={onClearFilters}
              className="mt-2"
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
      className="group relative flex flex-col justify-between bg-white border border-[#E6CCB2] hover:border-[#0F2027] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* 1. SIMULATED MAGAZINE COVER (PORTADA SIMULADA) */}
      <div className="relative w-full h-64 sm:h-72 bg-[#0F2027] overflow-hidden">
        {/* Cover Image Background */}
        {article.coverImageUrl && !imageError ? (
          <Image
            src={article.coverImageUrl}
            alt={`Portada simulada de ${article.magazine.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F2027] to-[#203A43] text-stone-300 p-6 text-center">
            <Compass className="w-10 h-10 text-[#D4A373] mb-2" />
            <span className="font-serif text-lg font-bold">
              {article.magazine.name}
            </span>
          </div>
        )}

        {/* Realistic Magazine Texture & Scrim Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Magazine Spine Edge Simulation (left highlight) */}
        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

        {/* Simulated Magazine Header Masthead */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
          <div
            className={`px-2.5 py-1 rounded text-[11px] font-mono tracking-widest uppercase font-bold shadow-md ${
              isNatGeo
                ? 'bg-[#FFD100] text-black border-2 border-black'
                : isCondeNast
                ? 'bg-white/95 text-stone-900 font-serif tracking-widest'
                : isGeo
                ? 'bg-[#14532D] text-white'
                : isAltair
                ? 'bg-[#9A3412] text-white'
                : 'bg-[#0F2027]/90 text-white border border-white/20'
            }`}
          >
            {article.magazine.name}
          </div>

          {/* Issue Number Badge */}
          <div className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-mono text-white/90 border border-white/10 tabular-nums">
            Nº {article.magazine.issueNumber}
          </div>
        </div>

        {/* 2. LOCALIDAD ENCONTRADA (MUY DESTACADA VISUALMENTE) */}
        <div className="absolute bottom-3.5 left-4 right-4 z-10">
          <div className="bg-[#FAF6F0]/95 backdrop-blur-md border border-[#E6CCB2] rounded-xl p-3 shadow-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-lg bg-[#0F2027] text-[#FAF6F0] shrink-0 shadow-xs">
                <MapPin className="w-4 h-4 text-[#D4A373]" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4A5568] block">
                  Localidad Encontrada
                </span>
                <span className="font-serif font-bold text-base text-[#0F2027] truncate block leading-tight">
                  {article.location.formatted}
                </span>
              </div>
            </div>

            <ArrowUpRight className="w-4 h-4 text-[#203A43] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>
        </div>
      </div>

      {/* 3. CARD BODY: METRICS & CITATION */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Strip: Páginas y Fecha de Publicación (Destacados de forma limpia) */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E6CCB2]/70 text-xs">
          {/* Páginas Destacadas */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-white text-[#0F2027] border border-[#E6CCB2]">
              <BookOpen className="w-3.5 h-3.5 text-[#0F2027]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#718096] block leading-none mb-0.5">
                Páginas
              </span>
              <span className="font-mono font-bold text-[#0F2027] tabular-nums block text-xs">
                {article.pageCitation}
              </span>
            </div>
          </div>

          {/* Fecha de Publicación Destacada */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-white text-[#0F2027] border border-[#E6CCB2]">
              <Calendar className="w-3.5 h-3.5 text-[#0F2027]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#718096] block leading-none mb-0.5">
                Publicación
              </span>
              <span className="font-semibold text-[#0F2027] block text-xs truncate">
                {publicationDate}
              </span>
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="font-serif font-bold text-lg text-[#0F2027] group-hover:text-[#1E3A8A] transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>

          {article.subtitle && (
            <p className="text-xs text-[#718096] italic mt-1 line-clamp-1">
              {article.subtitle}
            </p>
          )}

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-[#4A5568] mt-2.5 line-clamp-3 leading-relaxed">
            {article.synopsis}
          </p>
        </div>

        {/* Authorship & CTA */}
        <div className="pt-3 border-t border-[#E6CCB2]/50 flex items-center justify-between text-xs text-[#718096]">
          <div className="truncate max-w-[180px]">
            {article.author ? (
              <span className="flex items-center gap-1.5 truncate text-[#203A43]">
                <User className="w-3.5 h-3.5 text-[#0F2027] shrink-0" />
                <span className="truncate font-medium">{article.author}</span>
              </span>
            ) : (
              <span className="text-stone-400">Redacción editorial</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-semibold text-[#0F2027] hover:text-[#1E3A8A] hover:bg-[#F5EBE0] gap-1 cursor-pointer"
          >
            <span>Ver ficha</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
