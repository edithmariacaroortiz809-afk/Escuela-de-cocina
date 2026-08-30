# Escuela de Cocina - Semana 5

API REST de recetas migrada de memoria a PostgreSQL usando Prisma ORM.

## Dominio y entidades

- Dominio: Escuela de Cocina
- Recurso principal: `Recipe`
- Recurso relacionado: `Category`
- Relación: una categoría tiene muchas recetas y cada receta pertenece a una categoría.

```text
Category (1) -------- (N) Recipe
   id                     id
   name                   name
                          price
                          active
                          difficulty
                          duration
                          categoryId
```

## Requisitos implementados

- Prisma con modelos UUID `Category` y `Recipe`.
- Migración versionada en `prisma/migrations/`.
- Seed idempotente con 3 categorías y 5 recetas.
- CRUD paginado en `/api/v1/recipes`.
- Detalle incluyendo la categoría relacionada.
- Validación Zod para creación, actualización, IDs y paginación.
- `P2025` como `404` y `P2002` como `409`, gestionados por `errorHandler`.

## Instalación y ejecución

```bash
pnpm install
copy .env.example .env
docker compose up -d
pnpm prisma:generate
pnpm prisma:migrate --name init
pnpm prisma:seed
pnpm dev
```

La API queda disponible en `http://localhost:3000`.

## Endpoints

- `GET /api/v1/recipes?page=1&limit=10` - listado paginado.
- `GET /api/v1/recipes/:id` - detalle con categoría.
- `POST /api/v1/recipes` - crea una receta y responde `201`.
- `PUT /api/v1/recipes/:id` - actualiza una receta.
- `DELETE /api/v1/recipes/:id` - elimina y responde `204`.

Ejemplo de creación:

```json
{
  "name": "Crema catalana",
  "description": "Postre tradicional.",
  "price": 9.5,
  "active": true,
  "difficulty": "media",
  "duration": 35,
  "categoryId": "UUID_DE_POSTRES"
}
```

Las capturas están documentadas en [capturas-de-pantalla/README.md](./capturas-de-pantalla/README.md).
