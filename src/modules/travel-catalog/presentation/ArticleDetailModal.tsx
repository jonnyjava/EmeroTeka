'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Copy, Check, Tag, BookOpen, User, Camera, Calendar, FileText, Bookmark } from 'lucide-react';
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
  const bibliographicCitation = `${article.author || 'Redacción'}. (${article.magazine.year}). "${article.title}". ${article.magazine.name}, ${article.magazine.issueNumber}, ${article.pageCitation}. Temática: ${article.topic.formatted}.`;

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

          {/* Quick Topic & Pagination Highlight Strip (Lonely Planet Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4.5 bg-[#F8FAFC] border-2 border-[#DCE2EE] rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#2A3E92] text-white rounded-lg shrink-0 mt-0.5 shadow-2xs">
                <Tag className="w-4 h-4 text-[#FFC72C]" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] block font-bold">
                  Temática Indexada
                </span>
                <span className="text-base font-bold text-[#1B275E] block font-serif">
                  {article.topic.formatted}
                </span>
                <span className="text-xs text-slate-500">
                  {article.topic.name && `Tema: ${article.topic.name} · `}
                  {article.topic.subtopic && `Subtema: ${article.topic.subtopic} · `}
                  {article.topic.category && `Categoría: ${article.topic.category}`}
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

          {/* Credits Grid (Author, Photographer, Tags) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-[#DCE2EE]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] font-bold block mb-1">
                Créditos Editoriales
              </span>
              <div className="space-y-1.5 text-sm text-[#1B275E]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2A3E92] shrink-0" />
                  <span>Texto: <strong className="font-semibold">{article.author || 'Redacción editorial'}</strong></span>
                </div>
                {article.photographer && (
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#2A3E92] shrink-0" />
                    <span>Fotografía: <strong className="font-semibold">{article.photographer}</strong></span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] font-bold block mb-1">
                Descriptores Temáticos
              </span>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 bg-[#EEF2FF] text-[#2A3E92] border border-[#CCD5EE] rounded-md font-mono font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Citation Generator Box in Lonely Planet St Tropaz Theme */}
          <div className="p-4.5 bg-[#F8FAFC] border-2 border-[#DCE2EE] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#2A3E92] font-bold">
                Cita Bibliográfica para Archivo o Investigación
              </span>
              <button
                type="button"
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2A3E92] hover:bg-[#1E2D69] py-1 px-3 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#FFC72C]" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white/90" />
                    <span>Copiar Cita</span>
                  </>
                )}
              </button>
            </div>

            <p className="font-mono text-xs text-[#1B275E] bg-white p-3 rounded-lg border border-[#CCD5EE] select-all leading-relaxed break-words font-medium">
              {bibliographicCitation}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-[#F8FAFC] px-6 py-3.5 border-t-2 border-[#DCE2EE] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#1B275E] bg-white border border-[#CCD5EE] rounded-lg hover:bg-[#EEF2FF] hover:text-[#2A3E92] transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
