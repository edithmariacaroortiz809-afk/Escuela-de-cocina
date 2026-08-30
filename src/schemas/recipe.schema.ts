import { z } from 'zod';

export const createRecipeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').trim(),
  category: z.string().min(2, 'La categoría es obligatoria').trim(),
  price: z.number().positive('El precio debe ser mayor que 0'),
  active: z.boolean(),
  difficulty: z.enum(['fácil', 'media', 'avanzada']),
  duration: z.number().int().positive('La duración debe ser un entero positivo'),
});

export const updateRecipeSchema = createRecipeSchema.partial();
export const recipeIdSchema = z.coerce.number().int().positive('El id debe ser un entero positivo');
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
