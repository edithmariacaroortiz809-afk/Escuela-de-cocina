import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from '../types.js';

const recipes: Recipe[] = [
  { id: 1, name: 'Paella Valenciana', category: 'platos principales', price: 24.5, active: true, difficulty: 'media', duration: 45 },
  { id: 2, name: 'Risotto de setas', category: 'platos principales', price: 22, active: true, difficulty: 'media', duration: 40 },
  { id: 3, name: 'Tarta de manzana', category: 'postres', price: 11.5, active: true, difficulty: 'fácil', duration: 55 },
  { id: 4, name: 'Gazpacho andaluz', category: 'sopas', price: 13.5, active: true, difficulty: 'fácil', duration: 20 },
];

let nextId = recipes.length + 1;

export const recipesRepository = {
  async getAll(): Promise<Recipe[]> { return recipes.map((recipe) => ({ ...recipe })); },
  async getById(id: number): Promise<Recipe | undefined> {
    const recipe = recipes.find((item) => item.id === id);
    return recipe ? { ...recipe } : undefined;
  },
  async create(data: CreateRecipeDto): Promise<Recipe> {
    const recipe = { id: nextId++, ...data };
    recipes.push(recipe);
    return { ...recipe };
  },
  async update(id: number, data: UpdateRecipeDto): Promise<Recipe | undefined> {
    const index = recipes.findIndex((recipe) => recipe.id === id);
    if (index === -1) return undefined;
    recipes[index] = { ...recipes[index], ...data };
    return { ...recipes[index] };
  },
  async remove(id: number): Promise<boolean> {
    const index = recipes.findIndex((recipe) => recipe.id === id);
    if (index === -1) return false;
    recipes.splice(index, 1);
    return true;
  },
};
