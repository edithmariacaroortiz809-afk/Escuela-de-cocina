import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createRecipeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0),
  difficulty: z.enum(['fácil', 'media', 'difícil']),
  duration: z.number().min(1),
  category: z.string().regex(objectIdRegex, 'ID de categoría inválido'),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
