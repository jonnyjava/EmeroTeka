import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MagazineShowcase } from './MagazineShowcase.tsx';
import { MagazineSummary } from '../domain/IArticleRepository.ts';

describe('MagazineShowcase Component', () => {
  const sampleMagazines: MagazineSummary[] = [
    {
      id: 1,
      name: 'National Geographic',
      publisher: 'RBA',
      country: 'España',
      issuesCount: 15,
      articlesCount: 60,
    },
    {
      id: 2,
      name: 'Lonely Planet Magazine',
      publisher: 'Lonely Planet Publications',
      country: undefined,
      issuesCount: 8,
      articlesCount: 32,
    },
  ];

  it('renders magazines list and allows selecting a magazine', () => {
    const handleSelectMagazine = vi.fn();
    render(
      <MagazineShowcase
        magazines={sampleMagazines}
        selectedMagazineId={undefined}
        onSelectMagazine={handleSelectMagazine}
      />
    );

    expect(screen.getByText('Colección de Revistas y Guías Indexadas')).toBeInTheDocument();
    expect(screen.getByText('National Geographic')).toBeInTheDocument();
    expect(screen.getByText('Lonely Planet Magazine')).toBeInTheDocument();
    expect(screen.getByText('Internacional')).toBeInTheDocument(); // Country fallback for LP
    expect(screen.getByText('Referente Guías')).toBeInTheDocument(); // Lonely Planet special badge

    // Click on National Geographic card
    fireEvent.click(screen.getByText('National Geographic'));
    expect(handleSelectMagazine).toHaveBeenCalledWith(1);
  });

  it('renders active filter state and handles unselecting', () => {
    const handleSelectMagazine = vi.fn();
    render(
      <MagazineShowcase
        magazines={sampleMagazines}
        selectedMagazineId={1}
        onSelectMagazine={handleSelectMagazine}
      />
    );

    expect(screen.getByText('Ver todas las publicaciones')).toBeInTheDocument();
    expect(screen.getByText('Filtro activo')).toBeInTheDocument();

    // Click "Ver todas las publicaciones"
    fireEvent.click(screen.getByText('Ver todas las publicaciones'));
    expect(handleSelectMagazine).toHaveBeenCalledWith(undefined);

    // Clicking the already selected card unselects it
    fireEvent.click(screen.getByText('National Geographic'));
    expect(handleSelectMagazine).toHaveBeenCalledWith(undefined);
  });

  it('renders Lonely Planet magazine when it is the selected one', () => {
    render(
      <MagazineShowcase
        magazines={sampleMagazines}
        selectedMagazineId={2}
        onSelectMagazine={vi.fn()}
      />
    );

    expect(screen.getByText('Referente Guías')).toBeInTheDocument();
    expect(screen.getByText('Filtro activo')).toBeInTheDocument();
  });
});
