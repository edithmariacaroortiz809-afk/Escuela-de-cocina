import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import { User } from '../models/user.model.js';
import { Recipe } from '../models/recipe.model.js';
import { signAccessToken } from '../utils/jwt.js';
import { connect, clearDatabase, closeDatabase } from './testDb.js';

describe('Recipe routes (integration)', () => {
  let userToken: string;
  let adminToken: string;
  let userId: string;

  const validRecipe = {
    name: 'Tacos al pastor',
    description: 'Receta tradicional mexicana',
    price: 12.5,
    difficulty: 'media',
    duration: 30,
  };

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  beforeEach(async () => {
    const user = await User.create({
      name: 'Usuario Test',
      email: 'user@test.com',
      password: 'hashed-password',
      role: 'user',
    });
    const admin = await User.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'hashed-password',
      role: 'admin',
    });

    userId = user._id.toString();
    userToken = signAccessToken({ sub: userId, email: user.email, role: 'user' });
    adminToken = signAccessToken({ sub: admin._id.toString(), email: admin.email, role: 'admin' });
  });

  describe('GET /api/v1/recipes', () => {
    it('retorna 200 con un array vacío inicialmente', async () => {
      const res = await request(app).get('/api/v1/recipes');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('retorna 200 con las recetas creadas', async () => {
      await Recipe.create({ ...validRecipe, createdBy: userId });

      const res = await request(app).get('/api/v1/recipes');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/v1/recipes', () => {
    it('retorna 201 con datos válidos y token', async () => {
      const res = await request(app)
        .post('/api/v1/recipes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validRecipe);

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe(validRecipe.name);
    });

    it('retorna 422 con datos inválidos', async () => {
      const res = await request(app)
        .post('/api/v1/recipes')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'A' });

      expect(res.status).toBe(422);
    });

    it('retorna 401 con un token inválido', async () => {
      const res = await request(app)
        .post('/api/v1/recipes')
        .set('Authorization', 'Bearer token-falso')
        .send(validRecipe);

      expect(res.status).toBe(401);
    });

    it('retorna 401 sin token', async () => {
      const res = await request(app).post('/api/v1/recipes').send(validRecipe);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/recipes/:id', () => {
    it('retorna 200 con una receta existente', async () => {
      const recipe = await Recipe.create({ ...validRecipe, createdBy: userId });

      const res = await request(app).get(`/api/v1/recipes/${recipe._id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(validRecipe.name);
    });

    it('retorna 404 con un ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).get(`/api/v1/recipes/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/recipes/:id', () => {
    it('retorna 200 con datos válidos', async () => {
      const recipe = await Recipe.create({ ...validRecipe, createdBy: userId });

      const res = await request(app)
        .patch(`/api/v1/recipes/${recipe._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 15 });

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(15);
    });

    it('retorna 403 si intenta actualizar la receta de otro usuario', async () => {
      const recipe = await Recipe.create({ ...validRecipe, createdBy: 'otro-usuario' });

      const res = await request(app)
        .patch(`/api/v1/recipes/${recipe._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 15 });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/recipes/:id', () => {
    it('retorna 200 al eliminar como admin', async () => {
      const recipe = await Recipe.create({ ...validRecipe, createdBy: userId });

      const res = await request(app)
        .delete(`/api/v1/recipes/${recipe._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect([200, 204]).toContain(res.status);
    });

    it('retorna 403 si no es admin', async () => {
      const recipe = await Recipe.create({ ...validRecipe, createdBy: userId });

      const res = await request(app)
        .delete(`/api/v1/recipes/${recipe._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('retorna 404 con un ID inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .delete(`/api/v1/recipes/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
