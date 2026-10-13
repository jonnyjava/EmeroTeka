import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArchitectureInfoModal } from './ArchitectureInfoModal.tsx';

describe('ArchitectureInfoModal Component', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <ArchitectureInfoModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders all 4 DDD layers, descriptions, and closes on close button or backdrop click', () => {
    const handleClose = vi.fn();
    render(<ArchitectureInfoModal isOpen={true} onClose={handleClose} />);

    expect(
      screen.getByText('Arquitectura Limpia & Domain-Driven Design (DDD)')
    ).toBeInTheDocument();

    expect(screen.getByText(/1\. Domain Layer/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Application Layer/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Infrastructure Layer/)).toBeInTheDocument();
    expect(screen.getByText(/4\. Presentation & Next\.js App Router/)).toBeInTheDocument();

    // Close button in header
    const closeHeaderBtn = screen.getByLabelText('Cerrar modal');
    fireEvent.click(closeHeaderBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Close button in footer
    const footerBtn = screen.getByRole('button', { name: 'Entendido' });
    fireEvent.click(footerBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Backdrop click
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(handleClose).toHaveBeenCalledTimes(3);

    // Click inside modal should not trigger close
    const modalHeading = screen.getByText(
      'Arquitectura Limpia & Domain-Driven Design (DDD)'
    );
    fireEvent.click(modalHeading);
    expect(handleClose).toHaveBeenCalledTimes(3);
  });
});
