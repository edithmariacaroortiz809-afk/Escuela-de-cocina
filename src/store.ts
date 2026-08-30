import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from './types.js';

const recipes: Recipe[] = [
  { id: 1, name: 'Paella Valenciana', category: 'platos principales', price: 24.5, active: true, difficulty: 'media', duration: 45 },
  { id: 2, name: 'Risotto de setas', category: 'platos principales', price: 22, active: true, difficulty: 'media', duration: 40 },
  { id: 3, name: 'Tarta de manzana', category: 'postres', price: 11.5, active: true, difficulty: 'fácil', duration: 55 },
  { id: 4, name: 'Gazpacho andaluz', category: 'sopas', price: 13.5, active: true, difficulty: 'fácil', duration: 20 },
];

let nextId = recipes.length + 1;

export const store = {
  getAll(): Recipe[] {
    return [...recipes];
  },

  getById(id: number): Recipe | undefined {
    return recipes.find((recipe) => recipe.id === id);
  },

  create(data: CreateRecipeDto): Recipe {
    const newRecipe: Recipe = {
      id: nextId++,
      ...data,
    };

    recipes.push(newRecipe);
    return newRecipe;
  },

  update(id: number, data: UpdateRecipeDto): Recipe | undefined {
    const index = recipes.findIndex((recipe) => recipe.id === id);

    if (index === -1) {
      return undefined;
    }

    const updatedRecipe = {
      ...recipes[index],
      ...data,
    };

    recipes[index] = updatedRecipe;
    return updatedRecipe;
  },

  remove(id: number): boolean {
    const index = recipes.findIndex((recipe) => recipe.id === id);

    if (index === -1) {
      return false;
    }

    recipes.splice(index, 1);
    return true;
  },
};
