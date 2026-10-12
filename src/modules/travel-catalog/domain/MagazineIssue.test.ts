import { describe, it, expect } from 'vitest';
import { MagazineIssue } from './MagazineIssue.ts';

describe('MagazineIssue Entity', () => {
  const currentYear = new Date().getFullYear();

  describe('Creation and Invariants', () => {
    it('creates a valid MagazineIssue with minimal fields', () => {
      const issue = MagazineIssue.create({
        id: 1,
        magazineId: 10,
        magazineName: 'National Geographic',
        issueNumber: '145',
        year: 2020,
      });

      expect(issue.id).toBe(1);
      expect(issue.magazineId).toBe(10);
      expect(issue.magazineName).toBe('National Geographic');
      expect(issue.issueNumber).toBe('145');
      expect(issue.year).toBe(2020);
      expect(issue.month).toBeUndefined();
      expect(issue.volume).toBeUndefined();
      expect(issue.title).toBeUndefined();
      expect(issue.coverImageUrl).toBeUndefined();
    });

    it('creates a valid MagazineIssue with all optional fields and trims whitespace', () => {
      const issue = MagazineIssue.create({
        id: 2,
        magazineId: 20,
        magazineName: '  Altaïr  ',
        issueNumber: ' 88 ',
        year: 2018,
        month: '  Septiembre  ',
        volume: '  Vol. 12  ',
        title: '  Ruta de la Seda  ',
        coverImageUrl: '  https://example.com/cover.jpg  ',
      });

      expect(issue.magazineName).toBe('Altaïr');
      expect(issue.issueNumber).toBe('88');
      expect(issue.month).toBe('Septiembre');
      expect(issue.volume).toBe('Vol. 12');
      expect(issue.title).toBe('Ruta de la Seda');
      expect(issue.coverImageUrl).toBe('https://example.com/cover.jpg');
    });

    it('throws error when magazineName is empty or only whitespace', () => {
      expect(() =>
        MagazineIssue.create({
          id: 1,
          magazineId: 10,
          magazineName: '',
          issueNumber: '12',
          year: 2021,
        })
      ).toThrow('MagazineIssue invariant violation: magazineName cannot be empty.');

      expect(() =>
        MagazineIssue.create({
          id: 1,
          magazineId: 10,
          magazineName: '   ',
          issueNumber: '12',
          year: 2021,
        })
      ).toThrow('MagazineIssue invariant violation: magazineName cannot be empty.');
    });

    it('throws error when issueNumber is empty or only whitespace', () => {
      expect(() =>
        MagazineIssue.create({
          id: 1,
          magazineId: 10,
          magazineName: 'GEO',
          issueNumber: '',
          year: 2021,
        })
      ).toThrow('MagazineIssue invariant violation: issueNumber cannot be empty.');

      expect(() =>
        MagazineIssue.create({
          id: 1,
          magazineId: 10,
          magazineName: 'GEO',
          issueNumber: '   ',
          year: 2021,
        })
      ).toThrow('MagazineIssue invariant violation: issueNumber cannot be empty.');
    });

    it('throws error when year is below 1850 or above currentYear + 1', () => {
      expect(() =>
        MagazineIssue.create({
          id: 1,
          magazineId: 10,
          magazineName: 'Condé Nast Traveler',
          issueNumber: '1',
          year: 1849,
        })
      ).toThrow('MagazineIssue invariant violation: year must be between 1850');

      expect(() =>
        MagazineIssue.create({
          id: 1,
          magazineId: 10,
          magazineName: 'Condé Nast Traveler',
          issueNumber: '1',
          year: currentYear + 2,
        })
      ).toThrow('MagazineIssue invariant violation: year must be between 1850');
    });
  });

  describe('Full Citation (getFullCitation)', () => {
    it('formats citation without volume and without month', () => {
      const issue = MagazineIssue.create({
        id: 1,
        magazineId: 1,
        magazineName: 'Viajes National Geographic',
        issueNumber: '210',
        year: 2021,
      });

      expect(issue.getFullCitation()).toBe('Viajes National Geographic · Nº 210 (2021)');
    });

    it('formats citation with volume and month', () => {
      const issue = MagazineIssue.create({
        id: 1,
        magazineId: 1,
        magazineName: 'National Geographic',
        issueNumber: '4',
        volume: 'Vol. 186',
        month: 'Octubre',
        year: 1994,
      });

      expect(issue.getFullCitation()).toBe(
        'National Geographic · Vol. 186, Nº 4 (Octubre 1994)'
      );
    });
  });

  describe('Serialization (toJSON)', () => {
    it('serializes issue to JSON with full citation', () => {
      const issue = MagazineIssue.create({
        id: 5,
        magazineId: 3,
        magazineName: 'Lonely Planet Magazine',
        issueNumber: '42',
        year: 2019,
        month: 'Julio',
        volume: 'Año IV',
        title: 'Especial Japón',
        coverImageUrl: 'https://images.example.com/cover.jpg',
      });

      expect(issue.toJSON()).toEqual({
        id: 5,
        magazineId: 3,
        magazineName: 'Lonely Planet Magazine',
        issueNumber: '42',
        year: 2019,
        month: 'Julio',
        volume: 'Año IV',
        title: 'Especial Japón',
        coverImageUrl: 'https://images.example.com/cover.jpg',
        fullCitation: 'Lonely Planet Magazine · Año IV, Nº 42 (Julio 2019)',
      });
    });
  });
});
