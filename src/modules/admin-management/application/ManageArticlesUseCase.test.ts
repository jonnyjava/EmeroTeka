import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManageArticlesUseCase } from './ManageArticlesUseCase';
import { IAdminManagementRepository } from '../infrastructure/IAdminManagementRepository';
import { ArticleAdminDTO, MagazineIssueOptionDTO } from '../domain/ArticleAdminEntity';

describe('ManageArticlesUseCase', () => {
  let mockRepo: IAdminManagementRepository;
  let useCase: ManageArticlesUseCase;

  beforeEach(() => {
    mockRepo = {
      listMagazines: vi.fn(),
      getMagazineById: vi.fn(),
      createMagazine: vi.fn(),
      updateMagazine: vi.fn(),
      deleteMagazine: vi.fn(),
      listArticles: vi.fn(),
      getArticleById: vi.fn(),
      createArticle: vi.fn(),
      updateArticle: vi.fn(),
      deleteArticle: vi.fn(),
      getMagazineIssuesOptions: vi.fn(),
    };
    useCase = new ManageArticlesUseCase(mockRepo);
  });

  it('lists articles through repository with filter', async () => {
    const articles = [{ id: 1, title: 'Expedición al Ártico' }] as unknown as ArticleAdminDTO[];
    vi.mocked(mockRepo.listArticles).mockResolvedValueOnce(articles);

    const result = await useCase.list({ search: 'ártico', magazineId: 2 });
    expect(mockRepo.listArticles).toHaveBeenCalledWith({ search: 'ártico', magazineId: 2 });
    expect(result).toEqual(articles);
  });

  it('creates article when valid input is provided', async () => {
    const input = {
      magazineId: 1,
      issueId: 5,
      title: 'Tesoros de Kioto',
      country: 'Japón',
      startPage: 12,
      endPage: 25,
      synopsis: 'Explorando templos milenarios y jardines zen en la antigua capital.',
    };
    const created = { id: 10, ...input } as unknown as ArticleAdminDTO;
    vi.mocked(mockRepo.createArticle).mockResolvedValueOnce(created);

    const result = await useCase.create(input);
    expect(mockRepo.createArticle).toHaveBeenCalled();
    expect(result).toEqual(created);
  });

  it('throws validation error when article page range is inverted', async () => {
    const invalidInput = {
      magazineId: 1,
      issueId: 5,
      title: 'Tesoros de Kioto',
      country: 'Japón',
      startPage: 50,
      endPage: 25,
      synopsis: 'Explorando templos milenarios y jardines zen en la antigua capital.',
    };
    await expect(useCase.create(invalidInput)).rejects.toThrow();
  });

  it('updates article when valid id and input are provided', async () => {
    const updateData = {
      magazineId: 1,
      issueId: 5,
      title: 'Tesoros de Kioto Actualizados',
      country: 'Japón',
      startPage: 12,
      endPage: 26,
      synopsis: 'Explorando templos milenarios y jardines zen en la antigua capital.',
    };
    const updated = { id: 10, ...updateData } as unknown as ArticleAdminDTO;
    vi.mocked(mockRepo.updateArticle).mockResolvedValueOnce(updated);

    const result = await useCase.update(10, updateData);
    expect(mockRepo.updateArticle).toHaveBeenCalledWith(10, expect.objectContaining({ title: 'Tesoros de Kioto Actualizados' }));
    expect(result).toEqual(updated);
  });

  it('deletes article through repository', async () => {
    vi.mocked(mockRepo.deleteArticle).mockResolvedValueOnce(true);

    const result = await useCase.delete(12);
    expect(mockRepo.deleteArticle).toHaveBeenCalledWith(12);
    expect(result).toBe(true);
  });

  it('fetches issue options through repository', async () => {
    const issues = [{ id: 1, magazineId: 1, label: 'NatGeo 2024' }] as unknown as MagazineIssueOptionDTO[];
    vi.mocked(mockRepo.getMagazineIssuesOptions).mockResolvedValueOnce(issues);

    const result = await useCase.getIssueOptions();
    expect(mockRepo.getMagazineIssuesOptions).toHaveBeenCalled();
    expect(result).toEqual(issues);
  });
});
