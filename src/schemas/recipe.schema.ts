import { z } from 'zod';

// ============================================
// SCHEMA: Receta (Escuela de Cocina)
// ============================================

export const createRecipeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  difficulty: z.enum(['fácil', 'media', 'difícil']),
  duration: z.number().min(1, 'La duración mínima es 1 minuto'),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export type CreateRecipeDto = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeDto = z.infer<typeof updateRecipeSchema>;
