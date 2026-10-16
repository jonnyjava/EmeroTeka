import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAdminMagazinesAction,
  createAdminMagazineAction,
  updateAdminMagazineAction,
  deleteAdminMagazineAction,
  getAdminArticlesAction,
  getAdminIssueOptionsAction,
  createAdminArticleAction,
  updateAdminArticleAction,
  deleteAdminArticleAction,
} from './admin';
import { ManageMagazinesUseCase } from '@/src/modules/admin-management/application/ManageMagazinesUseCase';
import { ManageArticlesUseCase } from '@/src/modules/admin-management/application/ManageArticlesUseCase';
import { MagazineAdminDTO } from '@/src/modules/admin-management/domain/MagazineAdminEntity';
import { ArticleAdminDTO, MagazineIssueOptionDTO } from '@/src/modules/admin-management/domain/ArticleAdminEntity';

vi.mock('@/src/modules/admin-management/application/ManageMagazinesUseCase');
vi.mock('@/src/modules/admin-management/application/ManageArticlesUseCase');
vi.mock('@/src/modules/admin-management/infrastructure/PostgresAdminManagementRepository');

describe('Server Actions: admin.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Magazines Actions', () => {
    it('getAdminMagazinesAction returns success response with magazines', async () => {
      const mockMags = [{ id: 1, name: 'National Geographic' }];
      vi.spyOn(ManageMagazinesUseCase.prototype, 'list').mockResolvedValueOnce(mockMags as unknown as MagazineAdminDTO[]);

      const res = await getAdminMagazinesAction('nat');
      expect(res.success).toBe(true);
      expect(res.data).toEqual(mockMags);
    });

    it('getAdminMagazinesAction catches error and returns failure', async () => {
      vi.spyOn(ManageMagazinesUseCase.prototype, 'list').mockRejectedValueOnce(new Error('DB failure'));

      const res = await getAdminMagazinesAction();
      expect(res.success).toBe(false);
      expect(res.error).toBe('DB failure');
    });

    it('createAdminMagazineAction creates magazine successfully', async () => {
      const created = { id: 2, name: 'Geo' };
      vi.spyOn(ManageMagazinesUseCase.prototype, 'create').mockResolvedValueOnce(created as unknown as MagazineAdminDTO);

      const res = await createAdminMagazineAction({ name: 'Geo' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual(created);
    });

    it('updateAdminMagazineAction updates magazine successfully', async () => {
      const updated = { id: 3, name: 'Altair' };
      vi.spyOn(ManageMagazinesUseCase.prototype, 'update').mockResolvedValueOnce(updated as unknown as MagazineAdminDTO);

      const res = await updateAdminMagazineAction(3, { name: 'Altair' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual(updated);
    });

    it('deleteAdminMagazineAction deletes magazine successfully', async () => {
      vi.spyOn(ManageMagazinesUseCase.prototype, 'delete').mockResolvedValueOnce(true);

      const res = await deleteAdminMagazineAction(4);
      expect(res.success).toBe(true);
      expect(res.data).toBe(true);
    });
  });

  describe('Articles Actions', () => {
    it('getAdminArticlesAction returns success response with articles', async () => {
      const mockArticles = [{ id: 10, title: 'Machu Picchu' }];
      vi.spyOn(ManageArticlesUseCase.prototype, 'list').mockResolvedValueOnce(mockArticles as unknown as ArticleAdminDTO[]);

      const res = await getAdminArticlesAction({ search: 'machu' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual(mockArticles);
    });

    it('getAdminIssueOptionsAction returns issue options', async () => {
      const mockOptions = [{ id: 1, label: 'NatGeo 2024' }];
      vi.spyOn(ManageArticlesUseCase.prototype, 'getIssueOptions').mockResolvedValueOnce(mockOptions as unknown as MagazineIssueOptionDTO[]);

      const res = await getAdminIssueOptionsAction();
      expect(res.success).toBe(true);
      expect(res.data).toEqual(mockOptions);
    });

    it('createAdminArticleAction creates article successfully', async () => {
      const created = { id: 20, title: 'Petra' };
      vi.spyOn(ManageArticlesUseCase.prototype, 'create').mockResolvedValueOnce(created as unknown as ArticleAdminDTO);

      const res = await createAdminArticleAction({ title: 'Petra' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual(created);
    });

    it('updateAdminArticleAction updates article successfully', async () => {
      const updated = { id: 20, title: 'Petra Edit' };
      vi.spyOn(ManageArticlesUseCase.prototype, 'update').mockResolvedValueOnce(updated as unknown as ArticleAdminDTO);

      const res = await updateAdminArticleAction(20, { title: 'Petra Edit' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual(updated);
    });

    it('deleteAdminArticleAction deletes article successfully', async () => {
      vi.spyOn(ManageArticlesUseCase.prototype, 'delete').mockResolvedValueOnce(true);

      const res = await deleteAdminArticleAction(20);
      expect(res.success).toBe(true);
      expect(res.data).toBe(true);
    });
  });
});
