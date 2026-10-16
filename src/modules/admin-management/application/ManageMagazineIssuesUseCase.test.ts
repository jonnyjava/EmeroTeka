import { describe, it, expect, vi } from 'vitest';
import { ManageMagazineIssuesUseCase } from './ManageMagazineIssuesUseCase';
import { IAdminManagementRepository } from '../infrastructure/IAdminManagementRepository';
import { MagazineIssueAdminDTO } from '../domain/MagazineIssueAdminEntity';

class MockAdminRepository implements Partial<IAdminManagementRepository> {
  async listMagazineIssues(): Promise<MagazineIssueAdminDTO[]> {
    return [
      {
        id: 1,
        magazineId: 1,
        magazineName: 'National Geographic',
        issueNumber: '542',
        year: 2026,
        month: 'Octubre',
        title: 'Especial Ártico',
        articlesCount: 5,
      },
    ];
  }
  async createMagazineIssue(input: any): Promise<MagazineIssueAdminDTO> {
    return {
      id: 2,
      magazineId: input.magazineId,
      magazineName: 'National Geographic',
      issueNumber: input.issueNumber,
      year: input.year,
      month: input.month,
      title: input.title,
      articlesCount: 0,
    };
  }
  async deleteMagazineIssue(id: number): Promise<boolean> {
    return id > 0;
  }
}

describe('ManageMagazineIssuesUseCase', () => {
  it('should list magazine issues', async () => {
    const repo = new MockAdminRepository() as IAdminManagementRepository;
    const useCase = new ManageMagazineIssuesUseCase(repo);
    const issues = await useCase.list();
    expect(issues).toHaveLength(1);
    expect(issues[0].issueNumber).toBe('542');
  });

  it('should create a magazine issue with valid input', async () => {
    const repo = new MockAdminRepository() as IAdminManagementRepository;
    const useCase = new ManageMagazineIssuesUseCase(repo);
    const created = await useCase.create({
      magazineId: 1,
      issueNumber: '543',
      year: 2026,
      month: 'Noviembre',
      title: 'Desiertos del Mundo',
    });
    expect(created.id).toBe(2);
    expect(created.issueNumber).toBe('543');
  });

  it('should throw error on invalid create input', async () => {
    const repo = new MockAdminRepository() as IAdminManagementRepository;
    const useCase = new ManageMagazineIssuesUseCase(repo);
    await expect(
      useCase.create({
        magazineId: 0,
        issueNumber: '',
        year: 2026,
      })
    ).rejects.toThrow();
  });
});
