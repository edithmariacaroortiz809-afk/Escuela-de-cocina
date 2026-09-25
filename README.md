# Semana 09 — Pruebas de API REST

Construido sobre la API de Semana 08 (RBAC y capas de seguridad).

## Dominio: Escuela de Cocina

API REST para gestionar recetas con autenticación JWT y capas de seguridad usando Express, TypeScript, Mongoose y MongoDB.

## Seguridad aplicada

- Helmet agrega headers de seguridad, incluido `X-Content-Type-Options: nosniff`.
- CORS usa whitelist y credenciales; no acepta `*`.
- Rate limiting global: 100 solicitudes cada 15 minutos.
- Rate limiting de autenticación: 5 solicitudes cada 15 minutos.
- `express-mongo-sanitize` bloquea operadores NoSQL en entradas.
- Errores de producción no exponen stack traces.

## Roles y permisos

| Operación | Invitado | Usuario autenticado | Admin |
|---|---:|---:|---:|
| Listar recetas | Sí | Sí | Sí |
| Ver receta | Sí | Sí | Sí |
| Crear receta | No | Sí | Sí |
| Actualizar receta propia | No | Sí | Sí |
| Actualizar receta ajena | No | No | Sí |
| Eliminar receta | No | No | Sí |

## Endpoints

### Salud y autenticación

- `GET /api/v1/health` — público.
- `POST /api/v1/auth/register` — registro, limitado por rate limiter.
- `POST /api/v1/auth/login` — login con cookies HttpOnly, limitado por rate limiter.
- `GET /api/v1/auth/me` — usuario autenticado.
- `POST /api/v1/auth/refresh` — renovar access token.
- `POST /api/v1/auth/logout` — cerrar sesión.

### Recetas

- `GET /api/v1/recipes` — público.
- `GET /api/v1/recipes/:id` — público.
- `POST /api/v1/recipes` — autenticado.
- `PATCH /api/v1/recipes/:id` — dueño autenticado o admin.
- `DELETE /api/v1/recipes/:id` — solo admin.

## Modelo de receta

- `name`: nombre único de la receta.
- `description`: descripción opcional.
- `price`: precio no negativo.
- `difficulty`: `fácil`, `media` o `difícil`.
- `duration`: duración en minutos.
- `createdBy`: usuario propietario.
- `active`: disponibilidad de la receta.

## Ejecución

```bash
docker compose up -d
copy .env.example .env
pnpm install
pnpm dev
```

Configura en `.env` dos secretos JWT diferentes: `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET`.

## Pruebas (Semana 09)

Suite de pruebas con Jest, Supertest y MongoDB Memory Server sobre el dominio de recetas.

```bash
pnpm test              # ejecutar todos los tests
pnpm test:watch        # modo watch
pnpm test:coverage     # reporte de cobertura → coverage/index.html
```

Las variables de entorno para pruebas están en `.env.test` (secretos JWT ficticios; no se usa una base de datos real, `mongodb-memory-server` levanta una en memoria).

### Archivos de prueba

- `src/__tests__/recipe.service.test.ts` — unitarias del servicio de recetas con `jest.mock()` sobre el modelo Mongoose: listar (con y sin filtro), buscar por ID (+404), crear (+409 por nombre duplicado), actualizar (+404, +403 si no es dueño ni admin) y eliminar (+404).
- `src/__tests__/auth.service.test.ts` — unitarias del servicio de autenticación con mocks de `bcrypt`, el repositorio de usuarios y las utilidades JWT: registro (+409), login (+401), refresh de tokens (+401), logout y `getMe` (+404).
- `src/__tests__/recipe.routes.test.ts` — integración de `/api/v1/recipes` con Supertest + MongoDB Memory Server: 200/201/401/403/404/422 según el caso.
- `src/__tests__/auth.routes.test.ts` — integración de `/api/v1/auth`, `/api/v1/users/dashboard` y `/api/v1/health`.

### Resultado

- 45 tests, 4 suites, todos pasando.
- Cobertura: 92.8% statements · 73.3% branches · 97.5% functions · 95.6% lines (umbral exigido: 80/70/80/80 en `jest.config.ts`).

## Evidencia

Las capturas están en [`capturas-de-pantalla/`](./capturas-de-pantalla).
