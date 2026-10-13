import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogHeader } from './CatalogHeader.tsx';

describe('CatalogHeader Component', () => {
  it('renders branding, links, article counter, and triggers search focus and architecture modal', () => {
    const handleSearchFocus = vi.fn();
    const handleOpenArchitecture = vi.fn();

    render(
      <CatalogHeader
        onSearchFocus={handleSearchFocus}
        onOpenArchitecture={handleOpenArchitecture}
        totalArticles={128}
      />
    );

    expect(screen.getByText('Archivia')).toBeInTheDocument();
    expect(screen.getByText('Viaggi')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();

    // Click 'Explorar Destinos' nav link
    const searchNav = screen.getByText('Explorar Destinos');
    fireEvent.click(searchNav);
    expect(handleSearchFocus).toHaveBeenCalledTimes(1);

    // Click primary action button 'Explorar Archivo'
    const exploreBtn = screen.getByRole('button', { name: /explorar archivo/i });
    fireEvent.click(exploreBtn);
    expect(handleSearchFocus).toHaveBeenCalledTimes(2);

    // Click 'Arquitectura DDD' button
    const archBtn = screen.getByRole('button', { name: /arquitectura ddd/i });
    fireEvent.click(archBtn);
    expect(handleOpenArchitecture).toHaveBeenCalledTimes(1);
  });

  it('scrolls into view when Hemeroteca de Revistas link is clicked', () => {
    const scrollMock = vi.fn();
    const revistasDiv = document.createElement('div');
    revistasDiv.id = 'revistas';
    revistasDiv.scrollIntoView = scrollMock;
    document.body.appendChild(revistasDiv);

    render(
      <CatalogHeader
        onSearchFocus={vi.fn()}
        onOpenArchitecture={vi.fn()}
        totalArticles={50}
      />
    );

    const hemerotecaLink = screen.getByText('Hemeroteca de Revistas');
    fireEvent.click(hemerotecaLink);

    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(revistasDiv);
  });
});
