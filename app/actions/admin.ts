'use server';

import { PostgresAdminManagementRepository } from '@/src/modules/admin-management/infrastructure/PostgresAdminManagementRepository';
import { ManageMagazinesUseCase } from '@/src/modules/admin-management/application/ManageMagazinesUseCase';
import { ManageArticlesUseCase } from '@/src/modules/admin-management/application/ManageArticlesUseCase';
import { MagazineAdminDTO } from '@/src/modules/admin-management/domain/MagazineAdminEntity';
import {
  ArticleAdminDTO,
  MagazineIssueOptionDTO,
} from '@/src/modules/admin-management/domain/ArticleAdminEntity';

// Composition root for Admin Management Server Actions
const adminRepository = new PostgresAdminManagementRepository();
const manageMagazinesUseCase = new ManageMagazinesUseCase(adminRepository);
const manageArticlesUseCase = new ManageArticlesUseCase(adminRepository);

export interface ServerActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===================== MAGAZINES ACTIONS =====================

export async function getAdminMagazinesAction(
  search?: string
): Promise<ServerActionResponse<MagazineAdminDTO[]>> {
  try {
    const data = await manageMagazinesUseCase.list(search);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener revistas.';
    console.error('getAdminMagazinesAction error:', error);
    return { success: false, error: message };
  }
}

export async function createAdminMagazineAction(
  input: unknown
): Promise<ServerActionResponse<MagazineAdminDTO>> {
  try {
    const data = await manageMagazinesUseCase.create(input);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear la revista.';
    console.error('createAdminMagazineAction error:', error);
    return { success: false, error: message };
  }
}

export async function updateAdminMagazineAction(
  id: number,
  input: unknown
): Promise<ServerActionResponse<MagazineAdminDTO>> {
  try {
    const data = await manageMagazinesUseCase.update(id, input);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar la revista.';
    console.error('updateAdminMagazineAction error:', error);
    return { success: false, error: message };
  }
}

export async function deleteAdminMagazineAction(
  id: number
): Promise<ServerActionResponse<boolean>> {
  try {
    const success = await manageMagazinesUseCase.delete(id);
    return { success: true, data: success };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al eliminar la revista.';
    console.error('deleteAdminMagazineAction error:', error);
    return { success: false, error: message };
  }
}

// ===================== ARTICLES ACTIONS =====================

export async function getAdminArticlesAction(filter?: {
  search?: string;
  magazineId?: number;
}): Promise<ServerActionResponse<ArticleAdminDTO[]>> {
  try {
    const data = await manageArticlesUseCase.list(filter);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener artículos.';
    console.error('getAdminArticlesAction error:', error);
    return { success: false, error: message };
  }
}

export async function getAdminIssueOptionsAction(): Promise<
  ServerActionResponse<MagazineIssueOptionDTO[]>
> {
  try {
    const data = await manageArticlesUseCase.getIssueOptions();
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener ediciones.';
    console.error('getAdminIssueOptionsAction error:', error);
    return { success: false, error: message };
  }
}

export async function createAdminArticleAction(
  input: unknown
): Promise<ServerActionResponse<ArticleAdminDTO>> {
  try {
    const data = await manageArticlesUseCase.create(input);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear el artículo.';
    console.error('createAdminArticleAction error:', error);
    return { success: false, error: message };
  }
}

export async function updateAdminArticleAction(
  id: number,
  input: unknown
): Promise<ServerActionResponse<ArticleAdminDTO>> {
  try {
    const data = await manageArticlesUseCase.update(id, input);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el artículo.';
    console.error('updateAdminArticleAction error:', error);
    return { success: false, error: message };
  }
}

export async function deleteAdminArticleAction(
  id: number
): Promise<ServerActionResponse<boolean>> {
  try {
    const success = await manageArticlesUseCase.delete(id);
    return { success: true, data: success };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el artículo.';
    console.error('deleteAdminArticleAction error:', error);
    return { success: false, error: message };
  }
}
