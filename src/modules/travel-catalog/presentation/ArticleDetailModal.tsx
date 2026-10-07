'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Copy, Check, MapPin, BookOpen, User, Camera, Calendar, FileText } from 'lucide-react';
import { ArticleDTO } from '../domain/Article.ts';

interface ArticleDetailModalProps {
  article: ArticleDTO | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  // Generate standard bibliographic reference
  const bibliographicCitation = `${article.author || 'Redacción'}. (${article.magazine.year}). "${article.title}". ${article.magazine.name}, ${article.magazine.issueNumber}, ${article.pageCitation}. Destino: ${article.location.formatted}.`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(bibliographicCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-stone-600">
              Ficha Bibliográfica del Catálogo
            </span>
            <span className="text-stone-300">·</span>
            <span className="font-mono text-xs text-stone-600">
              Ref. #{article.id}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Article Title & Kicker */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">
              <span className="font-semibold text-stone-800">{article.magazine.name}</span>
              <span aria-hidden="true">·</span>
              <span>Año {article.magazine.year}</span>
              <span aria-hidden="true">·</span>
              <span>Nº {article.magazine.issueNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-stone-900">{article.pageCitation}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 leading-tight">
              {article.title}
            </h2>

            {article.subtitle && (
              <p className="text-sm sm:text-base text-stone-600 italic mt-2">
                {article.subtitle}
              </p>
            )}
          </div>

          {/* Quick Location & Pagination Highlight Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-stone-600 block">
                  Localización Indexada
                </span>
                <span className="text-sm font-semibold text-stone-900 block">
                  {article.location.formatted}
                </span>
                <span className="text-xs text-stone-600">
                  {article.location.city && `Ciudad: ${article.location.city} · `}
                  {article.location.region && `Región: ${article.location.region} · `}
                  País: {article.location.country}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-stone-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-stone-600 block">
                  Localización en la Revista
                </span>
                <span className="text-sm font-semibold text-stone-900 block font-mono tabular-nums">
                  Páginas {article.startPage} a {article.endPage} ({article.pageCount} páginas)
                </span>
                <span className="text-xs text-stone-600">
                  {article.magazine.fullCitation}
                </span>
              </div>
            </div>
          </div>

          {/* Full Synopsis */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">
              Sinopsis del Reportaje
            </h3>
            <p className="text-base text-stone-700 leading-relaxed font-sans">
              {article.synopsis}
            </p>
          </div>

          {/* Credits Grid (Author, Photographer, Tags) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-600 block mb-1">
                Créditos Editoriales
              </span>
              <div className="space-y-1.5 text-sm text-stone-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Texto: {article.author || 'Redacción editorial'}</span>
                </div>
                {article.photographer && (
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-stone-600 shrink-0" />
                    <span>Fotografía: {article.photographer}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-600 block mb-1">
                Descriptores Temáticos
              </span>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Citation Generator Box */}
          <div className="p-4 bg-stone-100/70 border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-600">
                Cita Bibliográfica para Investigación
              </span>
              <button
                type="button"
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 py-1 px-2.5 rounded bg-white border border-stone-300 hover:border-stone-400 shadow-2xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Cita</span>
                  </>
                )}
              </button>
            </div>

            <p className="font-mono text-xs text-stone-800 bg-white p-3 rounded-lg border border-stone-200 select-all leading-relaxed break-words">
              {bibliographicCitation}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-stone-50 px-6 py-3.5 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
