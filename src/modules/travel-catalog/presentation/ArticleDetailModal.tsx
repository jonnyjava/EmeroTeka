'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Copy, Check, MapPin, BookOpen, User, Camera, Calendar, FileText, Bookmark } from 'lucide-react';
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
  const bibliographicCitation = `${article.author || 'Redacción'}. (${article.magazine.year}). "${article.title}". ${article.magazine.name}, ${article.magazine.issueNumber}, ${article.pageCitation}. Destino: ${article.location}.`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(bibliographicCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#141E46]/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white border-2 border-[#DCE2EE] rounded-2xl shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Lonely Planet Spine Stripe: St Tropaz #2A3E92 & Sunflower Gold #FFC72C */}
        <div className="h-1.5 w-full bg-[#2A3E92] flex">
          <div className="w-16 bg-[#FFC72C]" />
          <div className="flex-1 bg-[#2A3E92]" />
        </div>

        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b-2 border-[#DCE2EE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#2A3E92] font-bold">
              Ficha Bibliográfica del Catálogo
            </span>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-xs text-slate-500 font-semibold">
              Ref. #{article.id}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2A3E92] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
            aria-label="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Article Title & Kicker */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              <span className="font-bold text-[#2A3E92]">{article.magazine.name}</span>
              <span aria-hidden="true">·</span>
              <span>Año {article.magazine.year}</span>
              <span aria-hidden="true">·</span>
              <span>Nº {article.magazine.issueNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold text-[#1B275E] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#CCD5EE]">
                {article.pageCitation}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B275E] leading-tight">
              {article.title}
            </h2>

            {article.subtitle && (
              <p className="text-sm sm:text-base text-[#475569] italic mt-2">
                {article.subtitle}
              </p>
            )}
          </div>

          {/* Quick Destination & Pagination Highlight Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4.5 bg-[#F8FAFC] border-2 border-[#DCE2EE] rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#2A3E92] text-white rounded-lg shrink-0 mt-0.5 shadow-2xs">
                <MapPin className="w-4 h-4 text-[#FFC72C]" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] block font-bold">
                  Destino Geográfico
                </span>
                <span className="text-base font-bold text-[#1B275E] block font-serif">
                  {article.location}
                </span>
                <span className="text-xs text-slate-500">
                  {[
                    article.city && `Ciudad: ${article.city}`,
                    article.region && `Región: ${article.region}`,
                    article.country && `País: ${article.country}`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#EEF2FF] text-[#2A3E92] border border-[#CCD5EE] rounded-lg shrink-0 mt-0.5 shadow-2xs">
                <BookOpen className="w-4 h-4 text-[#2A3E92]" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] block font-bold">
                  Localización en la Revista
                </span>
                <span className="text-sm font-bold text-[#1B275E] block font-mono tabular-nums">
                  Páginas {article.startPage} a {article.endPage} ({article.pageCount} páginas)
                </span>
                <span className="text-xs text-slate-500">
                  {article.magazine.fullCitation}
                </span>
              </div>
            </div>
          </div>

          {/* Full Synopsis */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] font-bold mb-2">
              Sinopsis del Reportaje
            </h3>
            <p className="text-base text-[#334155] leading-relaxed font-sans">
              {article.synopsis}
            </p>
          </div>

          {/* Credits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#DCE2EE] text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4 text-[#2A3E92]" />
              <span>
                <strong>Texto / Autor:</strong> {article.author || 'Redacción Editorial'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Camera className="w-4 h-4 text-[#2A3E92]" />
              <span>
                <strong>Fotografía:</strong> {article.photographer || 'Archivo de la Revista'}
              </span>
            </div>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold mr-1">
                Etiquetas:
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#EEF2FF] text-[#2A3E92] px-2.5 py-1 rounded-md border border-[#CCD5EE] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bibliographic Citation Box */}
          <div className="p-4 bg-[#F8FAFC] border-2 border-[#DCE2EE] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] font-bold flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                Cita Bibliográfica para Investigadores
              </span>

              <button
                type="button"
                onClick={handleCopyCitation}
                className="text-xs font-bold text-[#2A3E92] hover:text-[#1E2D69] flex items-center gap-1 py-1 px-2.5 rounded border border-[#CCD5EE] hover:bg-white transition-colors cursor-pointer"
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

            <p className="font-mono text-xs text-slate-700 bg-white p-3 rounded-lg border border-[#DCE2EE] leading-relaxed break-all">
              {bibliographicCitation}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F8FAFC] px-6 py-4 border-t-2 border-[#DCE2EE] flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">
            Indexado en {article.magazine.name}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#2A3E92] hover:bg-[#1E2D69] text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
