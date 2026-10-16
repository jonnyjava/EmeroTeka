import {
  MagazineIssueAdminDTO,
  MagazineIssueInput,
  MagazineIssueInputSchema,
} from '../domain/MagazineIssueAdminEntity';
import { IAdminManagementRepository } from '../infrastructure/IAdminManagementRepository';

export class ManageMagazineIssuesUseCase {
  constructor(private readonly repository: IAdminManagementRepository) {}

  async list(filter?: { search?: string; magazineId?: number }): Promise<MagazineIssueAdminDTO[]> {
    return await this.repository.listMagazineIssues(filter);
  }

  async getById(id: number): Promise<MagazineIssueAdminDTO | null> {
    return await this.repository.getMagazineIssueById(id);
  }

  async create(input: unknown): Promise<MagazineIssueAdminDTO> {
    const validated = MagazineIssueInputSchema.parse(input);
    return await this.repository.createMagazineIssue(validated);
  }

  async update(id: number, input: unknown): Promise<MagazineIssueAdminDTO> {
    if (!id || id <= 0) {
      throw new Error('ID de edición inválido.');
    }
    const validated = MagazineIssueInputSchema.parse(input);
    return await this.repository.updateMagazineIssue(id, validated);
  }

  async delete(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de edición inválido.');
    }
    return await this.repository.deleteMagazineIssue(id);
  }
}
