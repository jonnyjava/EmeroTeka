import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MagazineIssueManagementSection } from './MagazineIssueManagementSection';

vi.mock('@/app/actions/admin', () => ({
  getAdminMagazineIssuesAction: vi.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: 1,
        magazineId: 1,
        magazineName: 'National Geographic',
        issueNumber: '542',
        year: 2026,
        month: 'Octubre',
        title: 'Especial Ártico',
        coverImageUrl: '/images/mag_nat_geo_1791410371610.jpg',
        articlesCount: 4,
      },
    ],
  }),
  getAdminMagazinesAction: vi.fn().mockResolvedValue({
    success: true,
    data: [
      { id: 1, name: 'National Geographic', publisher: 'NG Society' },
    ],
  }),
}));

describe('MagazineIssueManagementSection', () => {
  it('renders issue management section header and table items', async () => {
    render(<MagazineIssueManagementSection />);

    expect(screen.getByTestId('magazine-issue-management-section')).toBeDefined();
    expect(screen.getByTestId('magazine-issue-create-btn')).toBeDefined();

    // Wait for async load
    const issueRow = await screen.findByTestId('magazine-issue-row-1');
    expect(issueRow).toBeDefined();
    expect(screen.getByText('Nº 542')).toBeDefined();
    expect(screen.getAllByText('National Geographic').length).toBeGreaterThan(0);
  });
});
