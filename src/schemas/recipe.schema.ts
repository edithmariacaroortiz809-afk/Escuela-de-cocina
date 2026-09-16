import { z } from 'zod';

const recipeFields = {
  name: z.string().min(2).max(200).regex(/^[^<>]*$/, 'El nombre no puede contener HTML'),
  description: z.string().max(1000).regex(/^[^<>]*$/, 'La descripción no puede contener HTML').optional(),
  price: z.number().min(0),
  difficulty: z.enum(['fácil', 'media', 'difícil']),
  duration: z.number().int().min(1),
};

export const createRecipeSchema = z.object({ body: z.object(recipeFields) });
export const updateRecipeSchema = z.object({
  body: z.object({ ...recipeFields, active: z.boolean().optional() }).partial(),
});

export type CreateRecipeDto = z.infer<typeof createRecipeSchema>['body'];
export type UpdateRecipeDto = z.infer<typeof updateRecipeSchema>['body'];
