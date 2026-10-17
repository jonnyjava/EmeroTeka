import { z } from 'zod';

export const MagazineIssueInputSchema = z.object({
  magazineId: z.number().int().positive('Debes seleccionar una revista'),
  issueNumber: z.string().trim().min(1, 'El número de edición es obligatorio'),
  year: z.number().int().min(1800, 'Año inválido').max(2100, 'Año inválido'),
  month: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || Number.isNaN(val) ? null : Number(val)),
    z.number().int().min(1).max(12).nullable().optional()
  ),
  title: z.string().trim().nullable().optional().or(z.literal('')),
  coverImageUrl: z.string().trim().nullable().optional().or(z.literal('')),
});

export type MagazineIssueInput = z.infer<typeof MagazineIssueInputSchema>;

export interface MagazineIssueAdminDTO {
  id: number;
  magazineId: number;
  magazineName: string;
  issueNumber: string;
  year: number;
  month?: number | null;
  title?: string | null;
  coverImageUrl?: string | null;
  createdAt?: string | null;
  articlesCount?: number;
}
