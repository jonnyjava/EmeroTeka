import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManageMagazinesUseCase } from './ManageMagazinesUseCase';
import { IAdminManagementRepository } from '../infrastructure/IAdminManagementRepository';

describe('ManageMagazinesUseCase', () => {
  let mockRepo: IAdminManagementRepository;
  let useCase: ManageMagazinesUseCase;

  beforeEach(() => {
    mockRepo = {
      listMagazines: vi.fn(),
      getMagazineById: vi.fn(),
      createMagazine: vi.fn(),
      updateMagazine: vi.fn(),
      deleteMagazine: vi.fn(),
      listMagazineIssues: vi.fn(),
      getMagazineIssueById: vi.fn(),
      createMagazineIssue: vi.fn(),
      updateMagazineIssue: vi.fn(),
      deleteMagazineIssue: vi.fn(),
      listArticles: vi.fn(),
      getArticleById: vi.fn(),
      createArticle: vi.fn(),
      updateArticle: vi.fn(),
      deleteArticle: vi.fn(),
      getMagazineIssuesOptions: vi.fn(),
    };
    useCase = new ManageMagazinesUseCase(mockRepo);
  });

  it('lists magazines through repository', async () => {
    const mags = [
      { id: 1, name: 'National Geographic' },
      { id: 2, name: 'Geo' },
    ];
    vi.mocked(mockRepo.listMagazines).mockResolvedValueOnce(mags);

    const result = await useCase.list('geo');
    expect(mockRepo.listMagazines).toHaveBeenCalledWith('geo');
    expect(result).toEqual(mags);
  });

  it('creates magazine when valid input is provided', async () => {
    const input = {
      name: 'Viajar Magazine',
      publisher: 'Grupo Zeta',
      country: 'España',
    };
    const created = { id: 3, ...input };
    vi.mocked(mockRepo.createMagazine).mockResolvedValueOnce(created);

    const result = await useCase.create(input);
    expect(mockRepo.createMagazine).toHaveBeenCalled();
    expect(result).toEqual(created);
  });

  it('throws validation error when creating magazine with invalid name', async () => {
    const invalidInput = { name: 'A' };
    await expect(useCase.create(invalidInput)).rejects.toThrow();
  });

  it('updates magazine when valid id and input are provided', async () => {
    const updateData = { name: 'Altaïr Revista' };
    const updated = { id: 4, name: 'Altaïr Revista' };
    vi.mocked(mockRepo.updateMagazine).mockResolvedValueOnce(updated);

    const result = await useCase.update(4, updateData);
    expect(mockRepo.updateMagazine).toHaveBeenCalledWith(4, expect.objectContaining({ name: 'Altaïr Revista' }));
    expect(result).toEqual(updated);
  });

  it('throws error when updating with invalid id', async () => {
    await expect(useCase.update(0, { name: 'Valid Name' })).rejects.toThrow('ID de revista inválido.');
  });

  it('deletes magazine through repository', async () => {
    vi.mocked(mockRepo.deleteMagazine).mockResolvedValueOnce(true);

    const result = await useCase.delete(5);
    expect(mockRepo.deleteMagazine).toHaveBeenCalledWith(5);
    expect(result).toBe(true);
  });
});
