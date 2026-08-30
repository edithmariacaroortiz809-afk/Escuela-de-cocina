import { z } from 'zod';

const recipeFields = {
  name: z.string().min(2).trim(),
  description: z.string().max(500).trim().optional(),
  price: z.coerce.number().positive(),
  active: z.boolean().default(true),
  difficulty: z.enum(['fácil', 'media', 'avanzada']),
  duration: z.coerce.number().int().positive(),
  categoryId: z.string().uuid(),
};

export const createRecipeSchema = z.object(recipeFields);
export const updateRecipeSchema = z.object(recipeFields).partial();
export const recipeIdSchema = z.string().uuid();
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
