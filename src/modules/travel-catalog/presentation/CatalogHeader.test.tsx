import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogHeader } from './CatalogHeader.tsx';

describe('CatalogHeader Component', () => {
  it('renders branding, links, article counter, and triggers search focus', () => {
    const handleSearchFocus = vi.fn();

    render(
      <CatalogHeader
        onSearchFocus={handleSearchFocus}
        totalArticles={128}
      />
    );

    expect(screen.getByText('Emero.tk')).toBeInTheDocument();
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

    // Ensure Arquitectura DDD link is no longer present
    expect(screen.queryByText(/arquitectura ddd/i)).not.toBeInTheDocument();
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
        totalArticles={50}
      />
    );

    const hemerotecaLink = screen.getByText('Hemeroteca de Revistas');
    fireEvent.click(hemerotecaLink);

    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(revistasDiv);
  });
});
