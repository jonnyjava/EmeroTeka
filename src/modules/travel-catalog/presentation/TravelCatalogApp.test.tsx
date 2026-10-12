import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TravelCatalogApp } from './TravelCatalogApp.tsx';
import { ArticleDTO } from '../domain/Article.ts';
import { MagazineSummary } from '../domain/IArticleRepository.ts';
import * as searchActions from '@/app/actions/search.ts';

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} data-testid="app-image" />
  ),
}));

// Mock search action
vi.mock('@/app/actions/search.ts', () => ({
  searchArticlesAction: vi.fn(),
}));

describe('TravelCatalogApp Presentation Orchestration', () => {
  const sampleMagazines: MagazineSummary[] = [
    {
      id: 1,
      name: 'National Geographic',
      issuesCount: 20,
      articlesCount: 80,
    },
    {
      id: 2,
      name: 'Altaïr Magazine',
      issuesCount: 10,
      articlesCount: 40,
    },
  ];

  const sampleArticle: ArticleDTO = {
    id: 10,
    title: 'Aventuras en Svalbard',
    subtitle: 'Fauna polar y glaciares árticos',
    author: 'Roald Amundsen',
    startPage: 12,
    endPage: 28,
    pageCount: 17,
    pageCitation: 'pp. 12–28',
    topic: {
      name: 'Svalbard',
      category: 'Noruega',
      formatted: 'Svalbard · Noruega',
    },
    magazine: {
      id: 1,
      name: 'National Geographic',
      issueNumber: '315',
      year: 2021,
      month: 'Noviembre',
      fullCitation: 'National Geographic · Nº 315 (Noviembre 2021)',
    },
    synopsis: 'Exploración en el archipiélago ártico bajo el sol de medianoche.',
    tags: ['Ártico', 'Glaciares'],
    featured: true,
    catalogReference: 'National Geographic · Nº 315 (Noviembre 2021) · pp. 12–28',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(searchActions.searchArticlesAction).mockResolvedValue({
      success: true,
      query: '',
      articles: [sampleArticle],
      total: 1,
      matchedTopics: ['Svalbard · Noruega'],
      isEmpty: false,
    });
  });

  it('renders initial catalog with header, search bar, articles grid, and showcase', () => {
    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle]}
        initialTopics={['Svalbard · Noruega', 'Kioto · Japón']}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Catálogo Histórico de Artículos de Viajes' })
    ).toBeInTheDocument();
    expect(screen.getByText('Aventuras en Svalbard')).toBeInTheDocument();
    expect(screen.getAllByText('Svalbard · Noruega').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Colección de Revistas y Guías Indexadas')).toBeInTheDocument();
  });

  it('opens and closes ArticleDetailModal when article card is clicked', () => {
    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle]}
      />
    );

    // Click article card
    fireEvent.click(screen.getByText('Aventuras en Svalbard'));

    expect(screen.getByText('Ficha Bibliográfica del Catálogo')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByLabelText('Cerrar ficha'));
    expect(screen.queryByText('Ficha Bibliográfica del Catálogo')).not.toBeInTheDocument();
  });

  it('opens and closes ArchitectureInfoModal from header and footer', () => {
    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle]}
      />
    );

    // Open from header nav using exact accessible name
    const headerArchBtn = screen.getByRole('button', { name: 'Arquitectura DDD' });
    fireEvent.click(headerArchBtn);

    expect(
      screen.getByText('Arquitectura Limpia & Domain-Driven Design (DDD)')
    ).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByLabelText('Cerrar modal'));
    expect(
      screen.queryByText('Arquitectura Limpia & Domain-Driven Design (DDD)')
    ).not.toBeInTheDocument();

    // Open from footer link
    const footerArchBtn = screen.getByRole('button', { name: 'Arquitectura DDD & Capas' });
    fireEvent.click(footerArchBtn);
    expect(
      screen.getByText('Arquitectura Limpia & Domain-Driven Design (DDD)')
    ).toBeInTheDocument();
  });

  it('triggers debounced search action when search query changes', async () => {
    vi.useFakeTimers();

    const searchResultArticle: ArticleDTO = {
      ...sampleArticle,
      id: 20,
      title: 'Kioto Milenario',
    };

    vi.mocked(searchActions.searchArticlesAction).mockResolvedValue({
      success: true,
      query: 'Kioto',
      articles: [searchResultArticle],
      total: 1,
      matchedTopics: ['Kioto · Japón'],
      isEmpty: false,
    });

    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle]}
      />
    );

    const input = screen.getByPlaceholderText(/buscar temática o destino/i);
    fireEvent.change(input, { target: { value: 'Kioto' } });

    // Advance debounce timer
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(searchActions.searchArticlesAction).toHaveBeenCalledWith({
      query: 'Kioto',
      magazineId: undefined,
      year: undefined,
    });

    vi.useRealTimers();
  });

  it('handles selecting magazine from showcase and resetting filters', () => {
    // Setup mock scrollIntoView for #buscador
    const buscadorElem = document.createElement('div');
    buscadorElem.id = 'buscador';
    buscadorElem.scrollIntoView = vi.fn();
    document.body.appendChild(buscadorElem);

    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle]}
      />
    );

    // Click magazine card in showcase
    const altairHeading = screen.getByRole('heading', { name: 'Altaïr Magazine' });
    fireEvent.click(altairHeading);

    // Check active filters banner or reset button
    const resetButtons = screen.getAllByRole('button', { name: /restablecer búsqueda/i });
    expect(resetButtons.length).toBeGreaterThan(0);

    // Click reset
    fireEvent.click(resetButtons[0]);

    document.body.removeChild(buscadorElem);
  });

  it('handles search action failure gracefully without replacing articles', async () => {
    vi.useFakeTimers();

    vi.mocked(searchActions.searchArticlesAction).mockResolvedValueOnce({
      success: false,
      query: 'Failed',
      articles: [],
      total: 0,
      matchedTopics: [],
      isEmpty: true,
    });

    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle]}
      />
    );

    const input = screen.getByPlaceholderText(/buscar temática o destino/i);
    fireEvent.change(input, { target: { value: 'Failed' } });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Should retain original article when response.success is false
    expect(screen.getByText('Aventuras en Svalbard')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('renders plural results count and active filters banner for multiple filters', () => {
    const article2 = { ...sampleArticle, id: 99, title: 'Segundo Artículo' };

    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle, article2]}
      />
    );

    expect(screen.getAllByText('2 resultados').length).toBeGreaterThanOrEqual(1);

    // Select year filter
    const yearSelect = screen.getByLabelText('Año de Edición');
    fireEvent.change(yearSelect, { target: { value: '2021' } });

    expect(screen.getByText(/Filtros activos:/)).toBeInTheDocument();
    expect(screen.getAllByText(/Año 2021/).length).toBeGreaterThanOrEqual(1);
  });

  it('handles search focus from header when #buscador element is not present', () => {
    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle]}
      />
    );

    const exploreButton = screen.getByRole('button', { name: /explorar archivo/i });
    expect(() => fireEvent.click(exploreButton)).not.toThrow();
  });

  it('scrolls into view and focuses search input when Buscar Temática is clicked in header', () => {
    const scrollMock = vi.fn();
    const buscadorDiv = document.createElement('div');
    buscadorDiv.id = 'buscador';
    buscadorDiv.scrollIntoView = scrollMock;
    document.body.appendChild(buscadorDiv);

    render(
      <TravelCatalogApp
        initialMagazines={sampleMagazines}
        initialArticles={[sampleArticle]}
      />
    );

    const searchNavBtn = screen.getByRole('button', { name: /explorar archivo/i });
    fireEvent.click(searchNavBtn);

    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(buscadorDiv);
  });
});
