import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'platos principales', description: 'Recetas completas para el plato fuerte.' },
    { name: 'postres', description: 'Preparaciones dulces.' },
    { name: 'sopas', description: 'Recetas líquidas y reconfortantes.' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }

  const categoryByName = Object.fromEntries(
    (await prisma.category.findMany()).map((category) => [category.name, category.id]),
  );

  const recipes = [
    { name: 'Paella Valenciana', description: 'Arroz tradicional con verduras y azafrán.', price: 24.5, difficulty: 'media', duration: 45, categoryId: categoryByName['platos principales'] },
    { name: 'Risotto de setas', description: 'Risotto cremoso con setas de temporada.', price: 22, difficulty: 'media', duration: 40, categoryId: categoryByName['platos principales'] },
    { name: 'Tarta de manzana', description: 'Tarta casera con manzana y canela.', price: 11.5, difficulty: 'fácil', duration: 55, categoryId: categoryByName['postres'] },
    { name: 'Flan casero', description: 'Flan suave de vainilla.', price: 12.8, difficulty: 'fácil', duration: 50, categoryId: categoryByName['postres'] },
    { name: 'Gazpacho andaluz', description: 'Sopa fría de tomate y hortalizas.', price: 13.5, difficulty: 'fácil', duration: 20, categoryId: categoryByName['sopas'] },
  ];

  for (const recipe of recipes) {
    await prisma.recipe.upsert({
      where: { name: recipe.name },
      update: recipe,
      create: recipe,
    });
  }

  console.log(`Seed completado: ${categories.length} categorías y ${recipes.length} recetas.`);
}

main()
  .catch((error) => {
    console.error('Error en el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
