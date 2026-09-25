import request from 'supertest';
import { app } from '../app.js';
import { connect, clearDatabase, closeDatabase } from './testDb.js';

describe('Auth & health routes (integration)', () => {
  const credentials = { name: 'Ana Pérez', email: 'ana@test.com', password: 'Password1' };

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('GET /api/v1/health retorna 200', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  describe('POST /api/v1/auth/register', () => {
    it('retorna 201 con datos válidos', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(credentials);

      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe(credentials.email);
    });

    it('retorna 422 con una contraseña débil', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...credentials, password: 'weak' });

      expect(res.status).toBe(422);
    });

    it('retorna 409 si el email ya está registrado', async () => {
      await request(app).post('/api/v1/auth/register').send(credentials);

      const res = await request(app).post('/api/v1/auth/register').send(credentials);

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('retorna 200 y un accessToken con credenciales válidas', async () => {
      await request(app).post('/api/v1/auth/register').send(credentials);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: credentials.email, password: credentials.password });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('retorna 401 con contraseña incorrecta', async () => {
      await request(app).post('/api/v1/auth/register').send(credentials);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: credentials.email, password: 'Incorrecta1' });

      expect(res.status).toBe(401);
    });
  });

  describe('flujo autenticado (login → me → dashboard → refresh → logout)', () => {
    it('permite acceder a rutas protegidas y refrescar el token', async () => {
      const agent = request.agent(app);
      await agent.post('/api/v1/auth/register').send(credentials);

      const loginRes = await agent
        .post('/api/v1/auth/login')
        .send({ email: credentials.email, password: credentials.password });
      const accessToken = loginRes.body.accessToken as string;

      const meRes = await agent.get('/api/v1/auth/me').set('Authorization', `Bearer ${accessToken}`);
      expect(meRes.status).toBe(200);
      expect(meRes.body.data.email).toBe(credentials.email);

      const dashboardRes = await agent
        .get('/api/v1/users/dashboard')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(dashboardRes.status).toBe(200);

      const refreshRes = await agent.post('/api/v1/auth/refresh');
      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.accessToken).toBeDefined();

      const logoutRes = await agent
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(logoutRes.status).toBe(200);
    });

    it('retorna 401 en rutas protegidas sin token', async () => {
      const meRes = await request(app).get('/api/v1/auth/me');
      expect(meRes.status).toBe(401);

      const dashboardRes = await request(app).get('/api/v1/users/dashboard');
      expect(dashboardRes.status).toBe(401);
    });

    it('retorna 401 al refrescar sin cookie', async () => {
      const res = await request(app).post('/api/v1/auth/refresh');
      expect(res.status).toBe(401);
    });
  });
});
