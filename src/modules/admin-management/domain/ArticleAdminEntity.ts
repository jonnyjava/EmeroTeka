import { z } from 'zod';

export const ArticleInputSchema = z
  .object({
    magazineId: z.number().int().positive('Debes seleccionar una revista'),
    issueId: z.number().int().positive('Debes seleccionar una edición / issue'),
    title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres'),
    subtitle: z.string().trim().nullable().optional(),
    author: z.string().trim().nullable().optional(),
    startPage: z.number().int().positive('La página de inicio debe ser mayor a 0'),
    endPage: z.number().int().positive('La página final debe ser mayor a 0'),
    synopsis: z.string().trim().min(10, 'La sinopsis debe tener al menos 10 canisters'), // wait, min 10
    tags: z.string().trim().nullable().optional(),
    featured: z.boolean().default(false),
  })
  .refine((data) => data.endPage >= data.startPage, {
    message: 'La página final no puede ser menor que la página de inicio',
    path: ['endPage'],
  });

export type ArticleInput = z.infer<typeof ArticleInputSchema>;

export interface ArticleAdminDTO {
  id: number;
  magazineId: number;
  magazineName: string;
  issueId: number;
  issueNumber: string;
  issueYear: number;
  issueMonth?: number | null;
  title: string;
  subtitle?: string | null;
  author?: string | null;
  startPage: number;
  endPage: number;
  synopsis: string;
  tags?: string | null;
  featured: boolean;
  createdAt?: string | null;
}

export interface MagazineIssueOptionDTO {
  id: number;
  magazineId: number;
  magazineName: string;
  issueNumber: string;
  year: number;
  month?: number | null;
  label: string;
}
