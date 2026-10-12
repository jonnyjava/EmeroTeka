'use client';

import React from 'react';
import { X, CheckCircle2, Database, ShieldCheck, Cpu, LayoutTemplate, Layers } from 'lucide-react';

interface ArchitectureInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureInfoModal: React.FC<ArchitectureInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const layers = [
    {
      title: '1. Domain Layer (/src/modules/travel-catalog/domain)',
      icon: ShieldCheck,
      color: 'text-[#2A3E92]',
      description:
        'El núcleo puro del sistema sin dependencias de base de datos ni librerías externas. Contiene entidades ricas y objetos de valor con invariantes de negocio.',
      artifacts: [
        'Topic.ts (Value Object): Modela la temática, tema principal o categoría del artículo con inmutabilidad, equivalencia por valor y normalización semántica.',
        'Article.ts (Entity / Aggregate Root): Valida rango de páginas (startPage <= endPage), invariantes de título y cita bibliográfica.',
        'MagazineIssue.ts (Entity): Encapsula volumen, número, año y cita editorial estandarizada.',
        'IArticleRepository.ts (Domain Interface): Contrato abstracto para invertir dependencias hacia la infraestructura.',
      ],
    },
    {
      title: '2. Application Layer (/src/modules/travel-catalog/application)',
      icon: Cpu,
      color: 'text-[#2A3E92]',
      description:
        'Orquesta los casos de uso del catálogo. Recibe la abstracción IArticleRepository por Inversión de Control (IoC).',
      artifacts: [
        'SearchArticlesByTopicUseCase.ts: Caso de uso principal para buscar por temática y mapear entidades a DTOs seguros.',
        'GetCatalogOverviewUseCase.ts: Coordina la carga inicial de revistas indexadas y temáticas clave.',
      ],
    },
    {
      title: '3. Infrastructure Layer (/src/modules/travel-catalog/infrastructure)',
      icon: Database,
      color: 'text-[#2A3E92]',
      description:
        'Implementación concreta conectada a Google Cloud SQL (PostgreSQL) usando Drizzle ORM y connection pool nativo.',
      artifacts: [
        'PostgresArticleRepository.ts: Implementa IArticleRepository, aplicando manejo de errores en dos capas sin fugar conexión.',
        'ArticleMapper.ts: Transforma tuplas relacionales (joins de articles, magazine_issues, magazines) a entidades de Dominio.',
        'schema.ts & drizzle.config.ts: Definición relacional con índices para búsqueda geográfica rápida.',
      ],
    },
    {
      title: '4. Presentation & Next.js App Router (/src/modules/.../presentation & /app)',
      icon: LayoutTemplate,
      color: 'text-[#2A3E92]',
      description:
        'Interfaz editorial moderna con Tailwind CSS, Server Actions como Composition Root y paleta St Tropaz #2A3E92 estilo Lonely Planet.',
      artifacts: [
        'app/actions/search.ts (Composition Root): Instancia el repositorio de Postgres, inyecta la dependencia en el Use Case y responde a la UI.',
        'TravelCatalogApp.tsx & componentes: Buscador interactivo por temática, portadas simuladas y modal bibliográfico.',
      ],
    },
  ];

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
        {/* Top Lonely Planet Spine Stripe: St Tropaz #2A3E92 & Gold #FFC72C */}
        <div className="h-1.5 w-full bg-[#2A3E92] flex">
          <div className="w-16 bg-[#FFC72C]" />
          <div className="flex-1 bg-[#2A3E92]" />
        </div>

        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b-2 border-[#DCE2EE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2A3E92]" />
            <h2 className="font-serif text-lg font-bold text-[#1B275E]">
              Arquitectura Limpia & Domain-Driven Design (DDD)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2A3E92] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-[#475569] leading-relaxed">
            Este proyecto sigue un enfoque desacoplado estricto guiado por el dominio (DDD Tactical Design) estructurado en 4 capas dentro del módulo <code className="bg-[#EEF2FF] px-1.5 py-0.5 rounded text-xs font-mono text-[#2A3E92] font-bold border border-[#CCD5EE]">/src/modules/travel-catalog</code>, conectado a Google Cloud SQL PostgreSQL y presentado con la identidad visual St Tropaz (#2A3E92) inspirada en las revistas clásicas de Lonely Planet.
          </p>

          <div className="space-y-5">
            {layers.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div
                  key={idx}
                  className="p-5 bg-[#F8FAFC] border-2 border-[#DCE2EE] rounded-xl space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#2A3E92]" />
                    <h3 className="text-sm font-bold text-[#1B275E] font-mono">
                      {layer.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {layer.description}
                  </p>

                  <ul className="space-y-1.5 pt-1">
                    {layer.artifacts.map((art, aIdx) => (
                      <li
                        key={aIdx}
                        className="text-xs text-[#334155] flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2A3E92] shrink-0 mt-0.5" />
                        <span>{art}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 bg-[#F8FAFC] px-6 py-3.5 border-t-2 border-[#DCE2EE] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#1B275E] bg-white border border-[#CCD5EE] rounded-lg hover:bg-[#EEF2FF] hover:text-[#2A3E92] transition-colors cursor-pointer"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
