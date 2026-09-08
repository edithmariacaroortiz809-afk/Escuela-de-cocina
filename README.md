# Semana 07 — API REST con Autenticación JWT

## Dominio: Escuela de Cocina

API REST para gestionar recetas de cocina con autenticación completa usando JWT, Express 5, TypeScript, Mongoose y MongoDB.

### Entidades

- **Usuario** (`User`) — autenticación con email/password, roles
- **Receta** (`Recipe`) — entidad principal protegida, requiere autenticación

### Endpoints

**Autenticación** (`/api/v1/auth`)
- `POST /api/v1/auth/register` — registrar usuario
- `POST /api/v1/auth/login` — iniciar sesión (devuelve cookies HttpOnly)
- `GET /api/v1/auth/me` — perfil del usuario autenticado (protegida)
- `POST /api/v1/auth/refresh` — renovar access token (rotación)
- `POST /api/v1/auth/logout` — cerrar sesión

**Recetas** (`/api/v1/recipes`) — Todas protegidas con JWT
- `GET /api/v1/recipes` — listar todas
- `GET /api/v1/recipes/:id` — obtener por ID
- `POST /api/v1/recipes` — crear (requiere autenticación)
- `PATCH /api/v1/recipes/:id` — actualizar parcialmente
- `DELETE /api/v1/recipes/:id` — eliminar

### Manejo de errores

- `400` — Datos inválidos (Zod) o ID inválido
- `401` — No autenticado (sin token o token inválido)
- `404` — Recurso no encontrado
- `409` — Email o nombre de receta duplicado

### Seguridad implementada

- Contraseñas hasheadas con bcrypt (salt rounds 10)
- Access tokens (15 min) y refresh tokens (7 días)
- Cookies HttpOnly para tokens (nunca en localStorage)
- Rotación de refresh tokens
- Rutas protegidas con middleware de autenticación

## Cómo ejecutar

```bash
docker compose up -d
cp .env.example .env
# Editar .env con tus secrets JWT
pnpm install
pnpm dev
```

## Evidencia

Ver capturas en [`capturas-de-pantalla/`](./capturas-de-pantalla):

- `01-register.png` — Registro exitoso
- `02-login.png` — Login con cookies HttpOnly
- `03-get-recipes-auth.png` — Listar recetas autenticado
- `04-create-recipe.png` — Crear receta (201)
- `05-401-sin-auth.png` — Acceso sin token (401)
- `06-refresh.png` — Refresh token exitoso
- `07-logout.png` — Logout y cookies limpiadas

## Evidencia

Ver capturas en [`capturas-de-pantalla/`](./capturas-de-pantalla):

- `01-get-populate.png` — `GET /api/v1/recipes` con la categoría populada
- `02-post-201.png` — `POST /api/v1/recipes` exitoso
- `03-post-400.png` — `POST /api/v1/recipes` con ID de categoría inválido
- `04-post-409.png` — `POST /api/v1/categories` con nombre duplicado
