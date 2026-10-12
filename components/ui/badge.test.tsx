import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge.tsx';

describe('UI Badge Component', () => {
  it('renders default badge with children text', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-[#2A3E92]');
  });

  it('renders secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText('Secondary');
    expect(badge).toHaveClass('bg-[#EEF2FF]');
  });

  it('renders destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-red-600');
  });

  it('renders outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText('Outline');
    expect(badge).toHaveClass('border-[#CCD5EE]');
  });

  it('renders stTropaz and lpGold variants', () => {
    const { rerender } = render(<Badge variant="stTropaz">St Tropaz</Badge>);
    expect(screen.getByText('St Tropaz')).toHaveClass('bg-[#2A3E92]');

    rerender(<Badge variant="stTropazLight">St Tropaz Light</Badge>);
    expect(screen.getByText('St Tropaz Light')).toHaveClass('bg-[#EEF2FF]');

    rerender(<Badge variant="lpGold">Gold</Badge>);
    expect(screen.getByText('Gold')).toHaveClass('bg-[#FFC72C]');
  });

  it('supports custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });
});
