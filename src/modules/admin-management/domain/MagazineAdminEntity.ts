import { z } from 'zod';

export const MagazineInputSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  publisher: z.string().trim().nullable().optional(),
  country: z.string().trim().nullable().optional(),
  issn: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{3}[\dX])?$/, 'El formato de ISSN debe ser XXXX-XXXX (ej. 0027-9358)')
    .nullable()
    .optional()
    .or(z.literal('')),
  description: z.string().trim().nullable().optional(),
});

export type MagazineInput = z.infer<typeof MagazineInputSchema>;

export interface MagazineAdminDTO {
  id: number;
  name: string;
  publisher?: string | null;
  country?: string | null;
  issn?: string | null;
  description?: string | null;
  createdAt?: string | null;
  issuesCount?: number;
  articlesCount?: number;
}
