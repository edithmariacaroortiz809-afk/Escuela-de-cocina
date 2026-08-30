export interface Recipe {
  id: number;
  name: string;
  category: string;
  price: number;
  active: boolean;
  difficulty: 'fácil' | 'media' | 'avanzada';
  duration: number;
}

export type CreateRecipeDto = Omit<Recipe, 'id'>;
export type UpdateRecipeDto = Partial<CreateRecipeDto>;
