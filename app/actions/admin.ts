'use server';

import { PostgresAdminManagementRepository } from '@/src/modules/admin-management/infrastructure/PostgresAdminManagementRepository';
import { ManageMagazinesUseCase } from '@/src/modules/admin-management/application/ManageMagazinesUseCase';
import { ManageMagazineIssuesUseCase } from '@/src/modules/admin-management/application/ManageMagazineIssuesUseCase';
import { ManageArticlesUseCase } from '@/src/modules/admin-management/application/ManageArticlesUseCase';
import { MagazineAdminDTO } from '@/src/modules/admin-management/domain/MagazineAdminEntity';
import { MagazineIssueAdminDTO } from '@/src/modules/admin-management/domain/MagazineIssueAdminEntity';
import {
  ArticleAdminDTO,
  MagazineIssueOptionDTO,
} from '@/src/modules/admin-management/domain/ArticleAdminEntity';

// Composition root for Admin Management Server Actions
const adminRepository = new PostgresAdminManagementRepository();
const manageMagazinesUseCase = new ManageMagazinesUseCase(adminRepository);
const manageMagazineIssuesUseCase = new ManageMagazineIssuesUseCase(adminRepository);
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

// ===================== MAGAZINE ISSUES ACTIONS =====================

export async function getAdminMagazineIssuesAction(filter?: {
  search?: string;
  magazineId?: number;
}): Promise<ServerActionResponse<MagazineIssueAdminDTO[]>> {
  try {
    const data = await manageMagazineIssuesUseCase.list(filter);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener ediciones de revistas.';
    console.error('getAdminMagazineIssuesAction error:', error);
    return { success: false, error: message };
  }
}

export async function createAdminMagazineIssueAction(
  input: unknown
): Promise<ServerActionResponse<MagazineIssueAdminDTO>> {
  try {
    const data = await manageMagazineIssuesUseCase.create(input);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear la edición.';
    console.error('createAdminMagazineIssueAction error:', error);
    return { success: false, error: message };
  }
}

export async function updateAdminMagazineIssueAction(
  id: number,
  input: unknown
): Promise<ServerActionResponse<MagazineIssueAdminDTO>> {
  try {
    const data = await manageMagazineIssuesUseCase.update(id, input);
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al actualizar la edición.';
    console.error('updateAdminMagazineIssueAction error:', error);
    return { success: false, error: message };
  }
}

export async function deleteAdminMagazineIssueAction(
  id: number
): Promise<ServerActionResponse<boolean>> {
  try {
    const success = await manageMagazineIssuesUseCase.delete(id);
    return { success: true, data: success };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al eliminar la edición.';
    console.error('deleteAdminMagazineIssueAction error:', error);
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

export async function getAdminTagsAction(): Promise<ServerActionResponse<string[]>> {
  try {
    const data = await manageArticlesUseCase.getTags();
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener etiquetas.';
    console.error('getAdminTagsAction error:', error);
    return { success: false, error: message };
  }
}

