import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type Recipe = {
  id: number;
  name: string;
  category: string;
  price: number;
  active: boolean;
  difficulty: string;
  duration: number;
  ingredients: string[];
};

type Summary = {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
  mostExpensive: Recipe | null;
  cheapest: Recipe | null;
  categories: string[];
};

type Report = {
  generatedAt: string;
  filter: string | null;
  summary: Summary;
  items: Recipe[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../data/recipes.json');
const outputPath = path.resolve(__dirname, '../output/report.json');

function getCategoryFilter(): string | null {
  const args = process.argv.slice(2);
  const categoryIndex = args.findIndex((arg) => arg === '--category');

  if (categoryIndex === -1) {
    return null;
  }

  const value = args[categoryIndex + 1];
  return value && !value.startsWith('--') ? value.trim() : null;
}

function calculateSummary(items: Recipe[]): Summary {
  const total = items.length;
  const active = items.filter((item) => item.active).length;
  const inactive = total - active;
  const averagePrice = total > 0 ? items.reduce((sum, item) => sum + item.price, 0) / total : 0;
  const mostExpensive = items.length > 0 ? [...items].sort((a, b) => b.price - a.price)[0] : null;
  const cheapest = items.length > 0 ? [...items].sort((a, b) => a.price - b.price)[0] : null;
  const categories = [...new Set(items.map((item) => item.category))].sort();

  return {
    total,
    active,
    inactive,
    averagePrice,
    mostExpensive,
    cheapest,
    categories,
  };
}

async function readRecipes(): Promise<Recipe[]> {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const parsedData: unknown = JSON.parse(data);

    if (!Array.isArray(parsedData)) {
      throw new Error('El archivo JSON no contiene un arreglo de recetas.');
    }

    return parsedData as Recipe[];
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === 'ENOENT') {
      console.error(`No se encontró el archivo de datos: ${dataPath}`);
      console.error('Verifica que el archivo data/recipes.json exista.');
      process.exit(1);
    }

    console.error('Error al leer el archivo de recetas:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function generateReport(): Promise<void> {
  const recipes = await readRecipes();
  const categoryFilter = getCategoryFilter();

  const filteredRecipes = categoryFilter
    ? recipes.filter((recipe) => recipe.category.toLowerCase() === categoryFilter.toLowerCase())
    : recipes;

  if (categoryFilter && filteredRecipes.length === 0) {
    const availableCategories = [...new Set(recipes.map((recipe) => recipe.category))].sort();
    console.warn(`La categoría "${categoryFilter}" no existe.`);
    console.warn(`Categorías disponibles: ${availableCategories.join(', ')}`);
  }

  const summary = calculateSummary(filteredRecipes);
  const report: Report = {
    generatedAt: new Date().toISOString(),
    filter: categoryFilter,
    summary,
    items: filteredRecipes,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n=== Resumen del catálogo ===');
  console.log(`Total de recetas: ${summary.total}`);
  console.log(`Recetas activas: ${summary.active}`);
  console.log(`Recetas inactivas: ${summary.inactive}`);
  console.log(`Precio promedio: $${summary.averagePrice.toFixed(2)}`);
  console.log(`Receta más cara: ${summary.mostExpensive ? `${summary.mostExpensive.name} ($${summary.mostExpensive.price.toFixed(2)})` : 'N/A'}`);
  console.log(`Receta más barata: ${summary.cheapest ? `${summary.cheapest.name} ($${summary.cheapest.price.toFixed(2)})` : 'N/A'}`);
  console.log(`Categorías: ${summary.categories.join(', ') || 'N/A'}`);
  console.log(`\nReporte generado en: ${path.relative(process.cwd(), outputPath)}`);
}

generateReport().catch((error) => {
  console.error('Error inesperado:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
