import { prisma } from '../lib/prisma.js';
import type { CreateRecipeInput, UpdateRecipeInput } from '../schemas/recipes.schema.js';

const includeCategory = { category: true } as const;

export const recipesRepository = {
  async findMany(skip: number, take: number) {
    const [data, total] = await prisma.$transaction([
      prisma.recipe.findMany({ skip, take, include: includeCategory, orderBy: { createdAt: 'asc' } }),
      prisma.recipe.count(),
    ]);
    return { data, total };
  },
  findById(id: string) {
    return prisma.recipe.findUnique({ where: { id }, include: includeCategory });
  },
  create(data: CreateRecipeInput) {
    return prisma.recipe.create({ data, include: includeCategory });
  },
  update(id: string, data: UpdateRecipeInput) {
    return prisma.recipe.update({ where: { id }, data, include: includeCategory });
  },
  remove(id: string) {
    return prisma.recipe.delete({ where: { id } });
  },
};
