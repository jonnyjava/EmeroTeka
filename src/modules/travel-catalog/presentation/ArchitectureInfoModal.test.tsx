import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArchitectureInfoModal } from './ArchitectureInfoModal.tsx';

describe('ArchitectureInfoModal Component', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <ArchitectureInfoModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal content and triggers onClose callbacks', () => {
    const handleClose = vi.fn();
    render(<ArchitectureInfoModal isOpen={true} onClose={handleClose} />);

    expect(
      screen.getByText('Arquitectura Limpia & Domain-Driven Design (DDD)')
    ).toBeInTheDocument();
    expect(screen.getByText(/1. Domain Layer/)).toBeInTheDocument();
    expect(screen.getByText(/2. Application Layer/)).toBeInTheDocument();
    expect(screen.getByText(/3. Infrastructure Layer/)).toBeInTheDocument();
    expect(screen.getByText(/4. Presentation & Next.js App Router/)).toBeInTheDocument();

    // Backdrop click
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Top close button
    const closeBtn = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Bottom close button
    const bottomBtn = screen.getByRole('button', { name: 'Cerrar Ventana' });
    fireEvent.click(bottomBtn);
    expect(handleClose).toHaveBeenCalledTimes(3);
  });
});
