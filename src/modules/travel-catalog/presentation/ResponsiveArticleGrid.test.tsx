import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveArticleGrid } from './ResponsiveArticleGrid.tsx';
import { ArticleDTO } from '../domain/Article.ts';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onError, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={onError} {...props} data-testid="grid-image" />
  ),
}));

describe('ResponsiveArticleGrid Component', () => {
  const createMockArticle = (overrides: Partial<ArticleDTO> = {}): ArticleDTO => ({
    id: 1,
    title: 'Misterios de Samarcanda',
    subtitle: 'Ruta de la Seda y cúpulas turquesas',
    author: 'Marco Polo',
    startPage: 24,
    endPage: 32,
    pageCount: 9,
    pageCitation: 'pp. 24–32',
    topic: {
      name: 'Samarcanda',
      category: 'Uzbekistán',
      formatted: 'Samarcanda · Uzbekistán',
    },
    magazine: {
      id: 1,
      name: 'National Geographic',
      issueNumber: '112',
      year: 2021,
      month: 'Julio',
      fullCitation: 'National Geographic · Nº 112 (Julio 2021)',
    },
    synopsis: 'La joya de la Ruta de la Seda y sus mezquitas históricas.',
    tags: ['Historia', 'Asia Central'],
    featured: true,
    coverImageUrl: 'https://images.example.com/cover.jpg',
    catalogReference: 'National Geographic · Nº 112 (Julio 2021) · pp. 24–32',
    ...overrides,
  });

  it('renders empty state and calls onClearFilters when clicked', () => {
    const handleClear = vi.fn();
    render(
      <ResponsiveArticleGrid
        articles={[]}
        onSelectArticle={vi.fn()}
        onClearFilters={handleClear}
      />
    );

    expect(
      screen.getByText('No hay artículos indexados para esta temática')
    ).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: 'Restablecer filtros' });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('renders grid with articles and handles article selection', () => {
    const handleSelect = vi.fn();
    const article = createMockArticle();

    render(
      <ResponsiveArticleGrid
        articles={[article]}
        onSelectArticle={handleSelect}
      />
    );

    expect(screen.getByText('Misterios de Samarcanda')).toBeInTheDocument();
    expect(screen.getByText('Samarcanda · Uzbekistán')).toBeInTheDocument();
    expect(screen.getByText('pp. 24–32')).toBeInTheDocument();
    expect(screen.getByText('Julio 2021')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Misterios de Samarcanda'));
    expect(handleSelect).toHaveBeenCalledWith(article);
  });

  it('covers magazine branding variants: Lonely Planet, Condé Nast, GEO, Altaïr, and generic', () => {
    const lpArticle = createMockArticle({
      id: 2,
      magazine: { id: 2, name: 'Lonely Planet Magazine', issueNumber: '5', year: 2020 },
      author: undefined,
      subtitle: undefined,
    });
    const condeArticle = createMockArticle({
      id: 3,
      magazine: { id: 3, name: 'Condé Nast Traveler', issueNumber: '8', year: 2020, month: 'Enero' },
    });
    const geoArticle = createMockArticle({
      id: 4,
      magazine: { id: 4, name: 'GEO España', issueNumber: '12', year: 2019, month: 'Mayo' },
    });
    const altairArticle = createMockArticle({
      id: 5,
      magazine: { id: 5, name: 'Altaïr', issueNumber: '90', year: 2018 },
    });
    const genericArticle = createMockArticle({
      id: 6,
      magazine: { id: 6, name: 'Revista Viajes Clásicos', issueNumber: '1', year: 2017 },
    });

    render(
      <ResponsiveArticleGrid
        articles={[lpArticle, condeArticle, geoArticle, altairArticle, genericArticle]}
        onSelectArticle={vi.fn()}
      />
    );

    expect(screen.getByText('LP Official')).toBeInTheDocument();
    expect(screen.getByText('Año 2020')).toBeInTheDocument(); // LP has no month -> "Año 2020"
    expect(screen.getByText('Redacción editorial')).toBeInTheDocument(); // LP author undefined
    expect(screen.getByText('Condé Nast Traveler')).toBeInTheDocument();
    expect(screen.getByText('GEO España')).toBeInTheDocument();
    expect(screen.getByText('Altaïr')).toBeInTheDocument();
    expect(screen.getByText('Revista Viajes Clásicos')).toBeInTheDocument();
  });

  it('handles image error fallback inside IndexedMagazineCard', () => {
    const article = createMockArticle({ id: 10 });
    render(
      <ResponsiveArticleGrid
        articles={[article]}
        onSelectArticle={vi.fn()}
      />
    );

    const img = screen.getByTestId('grid-image');
    fireEvent.error(img);

    // After image error, fallback view renders magazine name
    expect(screen.getAllByText('National Geographic')).toHaveLength(2); // Top badge and fallback center
  });
});
