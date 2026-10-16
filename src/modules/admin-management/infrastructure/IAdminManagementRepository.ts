import {
  MagazineAdminDTO,
  MagazineInput,
} from '../domain/MagazineAdminEntity';
import {
  MagazineIssueAdminDTO,
  MagazineIssueInput,
} from '../domain/MagazineIssueAdminEntity';
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

  // Magazine Issues
  listMagazineIssues(filter?: { search?: string; magazineId?: number }): Promise<MagazineIssueAdminDTO[]>;
  getMagazineIssueById(id: number): Promise<MagazineIssueAdminDTO | null>;
  createMagazineIssue(input: MagazineIssueInput): Promise<MagazineIssueAdminDTO>;
  updateMagazineIssue(id: number, input: MagazineIssueInput): Promise<MagazineIssueAdminDTO>;
  deleteMagazineIssue(id: number): Promise<boolean>;

  // Articles
  listArticles(filter?: { search?: string; magazineId?: number }): Promise<ArticleAdminDTO[]>;
  getArticleById(id: number): Promise<ArticleAdminDTO | null>;
  createArticle(input: ArticleInput): Promise<ArticleAdminDTO>;
  updateArticle(id: number, input: ArticleInput): Promise<ArticleAdminDTO>;
  deleteArticle(id: number): Promise<boolean>;

  // Issue lookup helper (read-only for article issue selector)
  getMagazineIssuesOptions(): Promise<MagazineIssueOptionDTO[]>;
}
