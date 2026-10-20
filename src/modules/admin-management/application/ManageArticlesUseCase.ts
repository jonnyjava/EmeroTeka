import {
  ArticleAdminDTO,
  ArticleInput,
  ArticleInputSchema,
  MagazineIssueOptionDTO,
} from '../domain/ArticleAdminEntity';
import { IAdminManagementRepository } from '../infrastructure/IAdminManagementRepository';

export class ManageArticlesUseCase {
  constructor(private readonly repository: IAdminManagementRepository) {}

  async list(filter?: { search?: string; magazineId?: number }): Promise<ArticleAdminDTO[]> {
    return await this.repository.listArticles(filter);
  }

  async getById(id: number): Promise<ArticleAdminDTO | null> {
    return await this.repository.getArticleById(id);
  }

  async create(input: unknown): Promise<ArticleAdminDTO> {
    const validated = ArticleInputSchema.parse(input);
    return await this.repository.createArticle(validated);
  }

  async update(id: number, input: unknown): Promise<ArticleAdminDTO> {
    if (!id || id <= 0) {
      throw new Error('ID de artículo inválido.');
    }
    const validated = ArticleInputSchema.parse(input);
    return await this.repository.updateArticle(id, validated);
  }

  async delete(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de artículo inválido.');
    }
    return await this.repository.deleteArticle(id);
  }

  async getIssueOptions(): Promise<MagazineIssueOptionDTO[]> {
    return await this.repository.getMagazineIssuesOptions();
  }

  async getTags(): Promise<string[]> {
    return await this.repository.listTags();
  }
}
