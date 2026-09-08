import 'dotenv/config';
import { connectDB } from './lib/mongoose.js';
import { Category } from './models/category.model.js';
import { Recipe } from './models/recipe.model.js';
import mongoose from 'mongoose';

async function seed() {
  await connectDB();

  await Recipe.deleteMany({});
  await Category.deleteMany({});

  const [entradas, postres, sopas] = await Category.insertMany([
    { name: 'Entradas', description: 'Platos para abrir el apetito' },
    { name: 'Postres', description: 'Dulces y repostería' },
    { name: 'Sopas', description: 'Caldos y sopas tradicionales' },
  ]);

  await Recipe.insertMany([
    {
      name: 'Ceviche de pescado',
      description: 'Pescado fresco marinado en limón',
      price: 25000,
      difficulty: 'media',
      duration: 30,
      category: entradas._id,
    },
    {
      name: 'Tres leches',
      description: 'Pastel bañado en tres tipos de leche',
      price: 15000,
      difficulty: 'fácil',
      duration: 60,
      category: postres._id,
    },
    {
      name: 'Ajiaco santafereño',
      description: 'Sopa de pollo con papas y guascas',
      price: 20000,
      difficulty: 'difícil',
      duration: 90,
      category: sopas._id,
    },
  ]);

  console.log('Seed completado');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
