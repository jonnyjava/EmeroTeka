'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Bookmark, Compass, MapPin, FileText, User, Camera, ArrowUpRight } from 'lucide-react';
import { ArticleDTO } from '../domain/Article.ts';

interface ArticleCardProps {
  article: ArticleDTO;
  onSelect: (article: ArticleDTO) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Fallback visual icon based on magazine
  const magazineInitials = article.magazine.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <article
      onClick={() => onSelect(article)}
      className="group relative flex flex-col justify-between bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-400 hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Visual Header / Cover Image Slot with Strict Fallback */}
      <div className="relative w-full h-48 bg-stone-100 overflow-hidden border-b border-stone-100">
        {article.coverImageUrl && !imageFailed ? (
          <Image
            src={article.coverImageUrl}
            alt={`Portada de ${article.magazine.name} sobre ${article.location.formatted}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-stone-100 to-stone-200 p-6 text-stone-400">
            <span className="font-serif text-3xl font-bold text-stone-300">
              {magazineInitials}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-stone-600 mt-2">
              {article.magazine.name}
            </span>
          </div>
        )}

        {/* Editorial Scrim Overlay for Contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />

        {/* Destination & Exact Location Tag on Visual */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium drop-shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-stone-200" />
            <span className="truncate">{article.location.formatted}</span>
          </div>

          <span className="font-mono text-[11px] bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-stone-200 tabular-nums">
            {article.pageCitation}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Discipline: Clean unboxed text with typographic separators */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 font-mono uppercase tracking-wider mb-2.5">
            <span className="font-semibold text-stone-800">{article.magazine.name}</span>
            <span aria-hidden="true">·</span>
            <span>{article.magazine.year}</span>
            <span aria-hidden="true">·</span>
            <span>Nº {article.magazine.issueNumber}</span>
          </div>

          {/* Article Title */}
          <h3 className="text-lg font-serif font-medium text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          {/* Subtitle if available */}
          {article.subtitle && (
            <p className="text-xs text-stone-600 italic mt-1 line-clamp-1">
              {article.subtitle}
            </p>
          )}

          {/* Synopsis */}
          <p className="text-sm text-stone-600 mt-3 line-clamp-3 leading-relaxed">
            {article.synopsis}
          </p>
        </div>

        {/* Card Footer: Authorship & Action affordance */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <div className="truncate max-w-[200px]">
            {article.author ? (
              <span className="flex items-center gap-1 truncate text-stone-700">
                <User className="w-3 h-3 text-stone-600 shrink-0" />
                <span className="truncate">{article.author}</span>
              </span>
            ) : (
              <span className="text-stone-600">Redacción editorial</span>
            )}
          </div>

          <div className="flex items-center gap-1 font-medium text-stone-900 group-hover:text-stone-700 transition-colors">
            <span>Ficha completa</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
};
