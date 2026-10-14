import {
  MagazineAdminDTO,
  MagazineInput,
} from '../domain/MagazineAdminEntity';
import {
  ArticleAdminDTO,
  ArticleInput,
  MagazineIssueOptionDTO,
} from '../domain/ArticleAdminEntity';

export interface IAdminManagementRepository {
  // Magazines
  listMagazines(search?: string): Promise<MagazineAdminDTO[]>;
  getMagazineById(id: number): Promise<MagazineAdminDTO | null>;
  createMagazine(input: MagazineInput): Promise<MagazineAdminDTO>;
  updateMagazine(id: number, input: MagazineInput): Promise<MagazineAdminDTO>;
  deleteMagazine(id: number): Promise<boolean>;

  // Articles
  listArticles(filter?: { search?: string; magazineId?: number }): Promise<ArticleAdminDTO[]>;
  getArticleById(id: number): Promise<ArticleAdminDTO | null>;
  createArticle(input: ArticleInput): Promise<ArticleAdminDTO>;
  updateArticle(id: number, input: ArticleInput): Promise<ArticleAdminDTO>;
  deleteArticle(id: number): Promise<boolean>;

  // Issue lookup helper (read-only for article issue selector)
  getMagazineIssuesOptions(): Promise<MagazineIssueOptionDTO[]>;
}
