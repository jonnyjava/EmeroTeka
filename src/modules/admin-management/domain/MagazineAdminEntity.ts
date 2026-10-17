import { z } from 'zod';

export const MagazineInputSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  publisher: z.string().trim().nullable().optional(),
  country: z.string().trim().nullable().optional(),
});

export type MagazineInput = z.infer<typeof MagazineInputSchema>;

export interface MagazineAdminDTO {
  id: number;
  name: string;
  publisher?: string | null;
  country?: string | null;
  createdAt?: string | null;
  issuesCount?: number;
  articlesCount?: number;
}
