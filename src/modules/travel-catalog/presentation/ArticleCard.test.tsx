import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleCard } from './ArticleCard.tsx';
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
      data-testid="article-image"
    />
  ),
}));

describe('ArticleCard Component', () => {
  const sampleArticle: ArticleDTO = {
    id: 1,
    title: 'Navegando el Nilo',
    subtitle: 'De Lúxor a Asuán en falúa tradicional',
    author: 'Howard Carter',
    photographer: 'Harry Burton',
    startPage: 24,
    endPage: 38,
    pageCount: 15,
    pageCitation: 'pp. 24–38',
    city: 'Lúxor',
    region: 'Alto Egipto',
    country: 'Egipto',
    location: 'Lúxor · Egipto',
    magazine: {
      id: 1,
      name: 'National Geographic',
      issueNumber: '290',
      year: 2019,
      month: 'Octubre',
      fullCitation: 'National Geographic · Nº 290 (Octubre 2019)',
    },
    synopsis: 'Crónica del descubrimiento de tumbas y navegación fluvial en Egipto.',
    tags: ['Egipto', 'Arqueología', 'Nilo'],
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/nile.jpg',
    catalogReference: 'National Geographic · Nº 290 (Octubre 2019) · pp. 24–38',
  };

  it('renders article card with title, author, citation, and location badge', () => {
    const handleSelect = vi.fn();
    render(<ArticleCard article={sampleArticle} onSelect={handleSelect} />);

    expect(screen.getByText('Navegando el Nilo')).toBeInTheDocument();
    expect(screen.getByText('De Lúxor a Asuán en falúa tradicional')).toBeInTheDocument();
    expect(screen.getByText('Howard Carter')).toBeInTheDocument();
    expect(screen.getByText('Lúxor · Egipto')).toBeInTheDocument();
    expect(screen.getByText('pp. 24–38')).toBeInTheDocument();
    expect(screen.getByText('Nº 290')).toBeInTheDocument();

    const card = screen.getByRole('article');
    fireEvent.click(card);
    expect(handleSelect).toHaveBeenCalledWith(sampleArticle);
  });

  it('falls back to magazine initials when cover image is absent or fails to load', () => {
    const noImageArticle: ArticleDTO = {
      ...sampleArticle,
      coverImageUrl: undefined,
      author: undefined,
      subtitle: undefined,
    };

    const { rerender } = render(<ArticleCard article={noImageArticle} onSelect={vi.fn()} />);

    // Shows NG initials fallback
    expect(screen.getByText('NG')).toBeInTheDocument();
    expect(screen.getByText('Redacción editorial')).toBeInTheDocument();

    // Rerender with image and simulate error
    rerender(<ArticleCard article={sampleArticle} onSelect={vi.fn()} />);
    const img = screen.getByTestId('article-image');
    fireEvent.error(img);

    expect(screen.getByText('NG')).toBeInTheDocument();
  });
});
