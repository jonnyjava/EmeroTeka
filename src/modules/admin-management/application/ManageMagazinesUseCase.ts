import {
  MagazineAdminDTO,
  MagazineInput,
  MagazineInputSchema,
} from '../domain/MagazineAdminEntity';
import { IAdminManagementRepository } from '../infrastructure/IAdminManagementRepository';

export class ManageMagazinesUseCase {
  constructor(private readonly repository: IAdminManagementRepository) {}

  async list(search?: string): Promise<MagazineAdminDTO[]> {
    return await this.repository.listMagazines(search);
  }

  async getById(id: number): Promise<MagazineAdminDTO | null> {
    return await this.repository.getMagazineById(id);
  }

  async create(input: unknown): Promise<MagazineAdminDTO> {
    const validated = MagazineInputSchema.parse(input);
    return await this.repository.createMagazine(validated);
  }

  async update(id: number, input: unknown): Promise<MagazineAdminDTO> {
    if (!id || id <= 0) {
      throw new Error('ID de revista inválido.');
    }
    const validated = MagazineInputSchema.parse(input);
    return await this.repository.updateMagazine(id, validated);
  }

  async delete(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de revista inválido.');
    }
    return await this.repository.deleteMagazine(id);
  }
}
