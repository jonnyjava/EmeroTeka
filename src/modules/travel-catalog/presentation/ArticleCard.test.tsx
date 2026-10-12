import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleCard } from './ArticleCard.tsx';
import { ArticleDTO } from '../domain/Article.ts';

// Mock next/image to render standard img tag
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onError, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={onError} {...props} data-testid="next-image" />
  ),
}));

describe('ArticleCard Component', () => {
  const baseArticle: ArticleDTO = {
    id: 1,
    title: 'Misterios de Kioto',
    subtitle: 'Templos y jardines secretos',
    author: 'Kenji Sato',
    photographer: 'Hiroshi T.',
    startPage: 14,
    endPage: 28,
    pageCount: 15,
    pageCitation: 'pp. 14–28',
    topic: {
      name: 'Kioto',
      category: 'Japón',
      subtopic: 'Kansai',
      formatted: 'Kioto · Kansai · Japón',
    },
    magazine: {
      id: 1,
      name: 'National Geographic',
      issueNumber: '210',
      year: 2021,
      month: 'Abril',
      fullCitation: 'National Geographic · Nº 210 (Abril 2021)',
      coverImageUrl: 'https://images.example.com/cover.jpg',
    },
    synopsis: 'Un viaje contemplativo por los santuarios de Kioto.',
    tags: ['Templos', 'Japón'],
    featured: true,
    coverImageUrl: 'https://images.example.com/article.jpg',
    catalogReference: 'National Geographic · Nº 210 (Abril 2021) · pp. 14–28',
  };

  it('renders article card with image, title, author, topic, and handles click', () => {
    const handleSelect = vi.fn();
    render(<ArticleCard article={baseArticle} onSelect={handleSelect} />);

    expect(screen.getByText('Misterios de Kioto')).toBeInTheDocument();
    expect(screen.getByText('Templos y jardines secretos')).toBeInTheDocument();
    expect(screen.getByText('Kenji Sato')).toBeInTheDocument();
    expect(screen.getByText('Kioto · Kansai · Japón')).toBeInTheDocument();
    expect(screen.getByText('pp. 14–28')).toBeInTheDocument();
    expect(screen.getByText('National Geographic')).toBeInTheDocument();

    const card = screen.getByRole('article');
    fireEvent.click(card);
    expect(handleSelect).toHaveBeenCalledWith(baseArticle);
  });

  it('displays fallback initials when image triggers onError', () => {
    const handleSelect = vi.fn();
    render(<ArticleCard article={baseArticle} onSelect={handleSelect} />);

    const img = screen.getByTestId('next-image');
    fireEvent.error(img);

    // Magazine initials for "National Geographic" -> "NG"
    expect(screen.getByText('NG')).toBeInTheDocument();
  });

  it('displays fallback initials and editorial author fallback when fields are missing', () => {
    const articleWithoutAuthorAndImage: ArticleDTO = {
      ...baseArticle,
      subtitle: undefined,
      author: undefined,
      coverImageUrl: undefined,
      magazine: {
        ...baseArticle.magazine,
        name: 'Lonely Planet',
      },
    };

    render(<ArticleCard article={articleWithoutAuthorAndImage} onSelect={vi.fn()} />);

    expect(screen.getByText('Redacción editorial')).toBeInTheDocument();
    // Initials for "Lonely Planet" -> "LP"
    expect(screen.getByText('LP')).toBeInTheDocument();
  });
});
