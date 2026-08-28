import { z } from 'zod';

export const recipeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  category: z.string().min(2, 'La categoría es obligatoria'),
  price: z.number().positive('El precio debe ser mayor que 0'),
  active: z.boolean(),
  difficulty: z.enum(['fácil', 'media', 'avanzada']),
  duration: z.number().int().positive('La duración debe ser un número entero positivo'),
});

export const updateRecipeSchema = recipeSchema.partial();
