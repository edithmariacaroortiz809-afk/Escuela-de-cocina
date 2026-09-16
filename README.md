# Semana 08 — API segura con RBAC y capas de seguridad

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

## Evidencia

Las capturas están en [`capturas-de-pantalla/`](./capturas-de-pantalla).
