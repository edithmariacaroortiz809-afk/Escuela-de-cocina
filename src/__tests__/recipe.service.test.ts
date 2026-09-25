import { AppError } from '../errors/AppError.js';

jest.mock('../models/recipe.model.js', () => ({
  Recipe: {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

import { Recipe } from '../models/recipe.model.js';
import * as recipeService from '../services/recipe.service.js';

const mockedRecipe = Recipe as unknown as {
  find: jest.Mock;
  findOne: jest.Mock;
  findById: jest.Mock;
  create: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
};

describe('RecipeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('retorna todas las recetas activas (camino feliz)', async () => {
      const sortMock = jest.fn().mockResolvedValue([{ name: 'Tacos' }, { name: 'Pasta' }]);
      mockedRecipe.find.mockReturnValue({ sort: sortMock });

      const result = await recipeService.findAll();

      expect(mockedRecipe.find).toHaveBeenCalledWith({ active: true });
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toHaveLength(2);
    });

    it('aplica el filtro de dificultad cuando se especifica', async () => {
      const sortMock = jest.fn().mockResolvedValue([{ name: 'Tacos', difficulty: 'fácil' }]);
      mockedRecipe.find.mockReturnValue({ sort: sortMock });

      const result = await recipeService.findAll({ difficulty: 'fácil' });

      expect(mockedRecipe.find).toHaveBeenCalledWith({ active: true, difficulty: 'fácil' });
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('retorna la receta cuando existe', async () => {
      mockedRecipe.findById.mockResolvedValue({ _id: '1', name: 'Tacos' });

      const result = await recipeService.findById('1');

      expect(mockedRecipe.findById).toHaveBeenCalledWith('1');
      expect(result).toMatchObject({ name: 'Tacos' });
    });

    it('lanza AppError 404 si no existe', async () => {
      mockedRecipe.findById.mockResolvedValue(null);

      await expect(recipeService.findById('missing-id')).rejects.toBeInstanceOf(AppError);
      await expect(recipeService.findById('missing-id')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('create', () => {
    const dto = { name: 'Tacos', price: 10, difficulty: 'fácil' as const, duration: 20 };

    it('crea la receta con datos válidos', async () => {
      mockedRecipe.findOne.mockResolvedValue(null);
      mockedRecipe.create.mockResolvedValue({ _id: '1', ...dto, createdBy: 'user-1' });

      const result = await recipeService.create(dto, 'user-1');

      expect(mockedRecipe.findOne).toHaveBeenCalledWith({ name: dto.name });
      expect(mockedRecipe.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: dto.name, createdBy: 'user-1' })
      );
      expect(result.name).toBe('Tacos');
    });

    it('lanza AppError 409 si el nombre ya existe', async () => {
      mockedRecipe.findOne.mockResolvedValue({ _id: 'x', name: 'Tacos' });

      await expect(recipeService.create(dto, 'user-1')).rejects.toMatchObject({ statusCode: 409 });
      expect(mockedRecipe.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('actualiza la receta cuando el solicitante es el dueño', async () => {
      mockedRecipe.findById.mockResolvedValue({ _id: '1', createdBy: 'user-1' });
      mockedRecipe.findByIdAndUpdate.mockResolvedValue({ _id: '1', name: 'Nuevo nombre' });

      const result = await recipeService.update('1', { name: 'Nuevo nombre' }, 'user-1', 'user');

      expect(mockedRecipe.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { name: 'Nuevo nombre' },
        { new: true, runValidators: true }
      );
      expect(result.name).toBe('Nuevo nombre');
    });

    it('permite actualizar a un admin aunque no sea el dueño', async () => {
      mockedRecipe.findById.mockResolvedValue({ _id: '1', createdBy: 'other-user' });
      mockedRecipe.findByIdAndUpdate.mockResolvedValue({ _id: '1', name: 'Nuevo nombre' });

      const result = await recipeService.update('1', { name: 'Nuevo nombre' }, 'admin-1', 'admin');

      expect(result.name).toBe('Nuevo nombre');
    });

    it('lanza AppError 404 si no existe', async () => {
      mockedRecipe.findById.mockResolvedValue(null);

      await expect(
        recipeService.update('missing-id', { name: 'X' }, 'user-1', 'user')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('lanza AppError 403 si no es dueño ni admin', async () => {
      mockedRecipe.findById.mockResolvedValue({ _id: '1', createdBy: 'other-user' });

      await expect(
        recipeService.update('1', { name: 'X' }, 'user-1', 'user')
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockedRecipe.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('elimina la receta cuando existe', async () => {
      mockedRecipe.findByIdAndDelete.mockResolvedValue({ _id: '1', name: 'Tacos' });

      const result = await recipeService.remove('1');

      expect(mockedRecipe.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result.name).toBe('Tacos');
    });

    it('lanza AppError 404 si no existe', async () => {
      mockedRecipe.findByIdAndDelete.mockResolvedValue(null);

      await expect(recipeService.remove('missing-id')).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
