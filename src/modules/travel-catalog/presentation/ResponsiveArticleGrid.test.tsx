import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveArticleGrid } from './ResponsiveArticleGrid.tsx';
import { ArticleDTO } from '../domain/Article.ts';

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onError, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={onError}
      {...props}
      data-testid="grid-image"
    />
  ),
}));

describe('ResponsiveArticleGrid Component', () => {
  const sampleArticle1: ArticleDTO = {
    id: 1,
    title: 'Travesía por el Sahara',
    subtitle: 'Dunas infinitas de Erg Chebbi',
    author: 'Théodore Monod',
    startPage: 10,
    endPage: 24,
    pageCount: 15,
    pageCitation: 'pp. 10–24',
    magazine: {
      id: 1,
      name: 'Lonely Planet Magazine',
      issueNumber: '88',
      year: 2021,
      month: 'Mayo',
      fullCitation: 'Lonely Planet Magazine · Nº 88 (Mayo 2021)',
      coverImageUrl: 'https://images.unsplash.com/sahara.jpg',
    },
    synopsis: 'Exploración del desierto del Sahara marroquí.',
    tags: ['Desierto', 'Sahara'],
    featured: true,
    catalogReference: 'Lonely Planet Magazine · Nº 88 (Mayo 2021) · pp. 10–24',
  };

  const sampleArticle2: ArticleDTO = {
    id: 2,
    title: 'Kioto y sus Templos Ocultos',
    startPage: 30,
    endPage: 45,
    pageCount: 16,
    pageCitation: 'pp. 30–45',
    magazine: {
      id: 2,
      name: 'National Geographic',
      issueNumber: '412',
      year: 2023,
      fullCitation: 'National Geographic · Nº 412 (2023)',
    },
    synopsis: 'Meditación en santuarios de montaña en Kansai.',
    tags: ['Japón', 'Templos'],
    featured: false,
    catalogReference: 'National Geographic · Nº 412 (2023) · pp. 30–45',
  };

  it('renders grid with multiple magazine cards and triggers selection', () => {
    const handleSelect = vi.fn();
    render(
      <ResponsiveArticleGrid
        articles={[sampleArticle1, sampleArticle2]}
        onSelectArticle={handleSelect}
      />
    );

    expect(screen.getByText('Travesía por el Sahara')).toBeInTheDocument();
    expect(screen.getByText('Kioto y sus Templos Ocultos')).toBeInTheDocument();
    expect(screen.getByText('Lonely Planet Magazine · pp. 10–24')).toBeInTheDocument();
    expect(screen.getByText('National Geographic · pp. 30–45')).toBeInTheDocument();
    expect(screen.getByText('LP Official')).toBeInTheDocument();

    const firstCardTitle = screen.getByText('Travesía por el Sahara');
    fireEvent.click(firstCardTitle);
    expect(handleSelect).toHaveBeenCalledWith(sampleArticle1);
  });

  it('renders empty state when articles array is empty and allows resetting filters', () => {
    const handleReset = vi.fn();
    render(
      <ResponsiveArticleGrid
        articles={[]}
        onSelectArticle={vi.fn()}
        onClearFilters={handleReset}
      />
    );

    expect(
      screen.getByText('No hay artículos indexados para esta búsqueda')
    ).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /restablecer filtros/i });
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('renders fallback icon and simulated styling when cover image fails', () => {
    render(
      <ResponsiveArticleGrid
        articles={[sampleArticle1]}
        onSelectArticle={vi.fn()}
      />
    );

    const img = screen.getByTestId('grid-image');
    fireEvent.error(img);

    expect(screen.getAllByText('Lonely Planet Magazine').length).toBeGreaterThanOrEqual(1);
  });
});
