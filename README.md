# Semana 06 — API REST con MongoDB + Mongoose

## Dominio: Escuela de Cocina

API REST para gestionar recetas de cocina, construida con Express 5, TypeScript, Mongoose y MongoDB.

### Entidades

- **Categoría** (`Category`) — entidad secundaria, sin referencias.
  - `name` (string, único, requerido)
  - `description` (string, opcional)
- **Receta** (`Recipe`) — entidad principal, referencia a `Category`.
  - `name` (string, único, requerido)
  - `description` (string, opcional)
  - `price` (number, requerido)
  - `difficulty` (`fácil` | `media` | `difícil`, requerido)
  - `duration` (number, minutos, requerido)
  - `category` (ObjectId → `Category`, requerido)

### Endpoints

**Categorías** (`/api/v1/categories`)
- `GET    /api/v1/categories` — listar todas
- `GET    /api/v1/categories/:id` — obtener por ID
- `POST   /api/v1/categories` — crear
- `PUT    /api/v1/categories/:id` — actualizar
- `DELETE /api/v1/categories/:id` — eliminar

**Recetas** (`/api/v1/recipes`)
- `GET    /api/v1/recipes?page=1&limit=10` — listar con paginación + populate de categoría
- `GET    /api/v1/recipes/:id` — obtener con populate de categoría
- `POST   /api/v1/recipes` — crear (valida que el `category` sea un ObjectId válido)
- `PUT    /api/v1/recipes/:id` — actualizar
- `DELETE /api/v1/recipes/:id` — eliminar

### Manejo de errores

- `400` — ID inválido (CastError) o datos inválidos (Zod)
- `404` — recurso no encontrado
- `409` — valor duplicado en campo único (`name`)

## Cómo ejecutar

```bash
docker compose up -d
cp .env.example .env
pnpm install
pnpm seed
pnpm dev
```

## Evidencia

Ver capturas en [`capturas-de-pantalla/`](./capturas-de-pantalla):

- `01-get-populate.png` — `GET /api/v1/recipes` con la categoría populada
- `02-post-201.png` — `POST /api/v1/recipes` exitoso
- `03-post-400.png` — `POST /api/v1/recipes` con ID de categoría inválido
- `04-post-409.png` — `POST /api/v1/categories` con nombre duplicado
