'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tag, MapPin, User, ArrowUpRight, Compass } from 'lucide-react';
import { ArticleDTO } from '../domain/Article.ts';

interface ArticleCardProps {
  article: ArticleDTO;
  onSelect: (article: ArticleDTO) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Fallback visual initials based on magazine
  const magazineInitials = article.magazine.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <article
      onClick={() => onSelect(article)}
      className="group relative flex flex-col justify-between bg-white border-2 border-[#DCE2EE] rounded-xl overflow-hidden hover:border-[#2A3E92] hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
    >
      {/* Visual Header / Cover Image Slot with Strict Fallback */}
      <div className="relative w-full h-48 bg-[#1B275E] overflow-hidden border-b border-[#DCE2EE]">
        {article.coverImageUrl && !imageFailed ? (
          <Image
            src={article.coverImageUrl}
            alt={`Portada de ${article.magazine.name} sobre ${article.topic.formatted}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1B275E] via-[#2A3E92] to-[#141E46] p-6 text-white text-center">
            <span className="font-serif text-3xl font-bold text-white/90">
              {magazineInitials}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFC72C] mt-2 font-bold">
              {article.magazine.name}
            </span>
          </div>
        )}

        {/* Editorial Scrim Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141E46]/90 via-[#1B275E]/30 to-transparent pointer-events-none" />

        {/* Topic Tag on Visual */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-bold drop-shadow-xs bg-[#2A3E92]/90 px-2 py-0.5 rounded border border-white/20">
            <Tag className="w-3.5 h-3.5 text-[#FFC72C]" />
            <span className="truncate">{article.topic.formatted}</span>
          </div>

          <span className="font-mono text-[11px] bg-[#141E46]/90 backdrop-blur-xs px-2 py-0.5 rounded text-white tabular-nums border border-white/20 font-bold">
            {article.pageCitation}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Discipline: Clean unboxed text with typographic separators */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-mono uppercase tracking-wider mb-2.5">
            <span className="font-bold text-[#2A3E92]">{article.magazine.name}</span>
            <span aria-hidden="true">·</span>
            <span>{article.magazine.year}</span>
            <span aria-hidden="true">·</span>
            <span>Nº {article.magazine.issueNumber}</span>
          </div>

          {/* Article Title */}
          <h3 className="text-lg font-serif font-bold text-[#1B275E] group-hover:text-[#2A3E92] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          {/* Subtitle if available */}
          {article.subtitle && (
            <p className="text-xs text-slate-500 italic mt-1 line-clamp-1">
              {article.subtitle}
            </p>
          )}

          {/* Synopsis */}
          <p className="text-sm text-[#475569] mt-3 line-clamp-3 leading-relaxed">
            {article.synopsis}
          </p>
        </div>

        {/* Card Footer: Authorship & Action affordance */}
        <div className="pt-4 mt-4 border-t border-[#DCE2EE] flex items-center justify-between text-xs text-slate-500">
          <div className="truncate max-w-[200px]">
            {article.author ? (
              <span className="flex items-center gap-1 truncate text-[#1B275E] font-semibold">
                <User className="w-3 h-3 text-[#2A3E92] shrink-0" />
                <span className="truncate">{article.author}</span>
              </span>
            ) : (
              <span className="text-slate-400">Redacción editorial</span>
            )}
          </div>

          <div className="flex items-center gap-1 font-bold text-[#2A3E92] group-hover:text-[#1E2D69] transition-colors">
            <span>Ficha completa</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
};
