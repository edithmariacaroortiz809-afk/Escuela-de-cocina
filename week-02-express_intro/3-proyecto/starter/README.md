# API de recetas — Escuela de Cocina

Este proyecto implementa una API REST con Express 5 y TypeScript para gestionar recetas dentro de una escuela de cocina.

## Dominio adaptado

- Recurso principal: Recipe
- Ruta base: /api/v1/recipes
- Datos de ejemplo: nombre, categoría, precio, estado activo, dificultad y duración

## Funcionalidades

- Listar todas las recetas
- Obtener una receta por ID
- Crear una nueva receta
- Actualizar una receta existente
- Eliminar una receta
- Manejo centralizado de errores
- Middleware de logging personalizado
- Handler 404 para rutas inexistentes

## Estructura del proyecto

```text
starter/
├── package.json
├── tsconfig.json
├── .env.example
├── pnpm-workspace.yaml
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── types.ts
│   ├── store.ts
│   └── routes/
│       └── recipes.routes.ts
└── README.md
```

## Requisitos

- Node.js 20+
- pnpm

## Instalación

```bash
cd week-02-express_intro/3-proyecto/starter
pnpm install
```

## Ejecución

```bash
pnpm dev
```

La API queda disponible en:

```text
http://localhost:3000
```

## Endpoints

### GET /api/v1/recipes

Obtiene todas las recetas.

### GET /api/v1/recipes/:id

Obtiene una receta por ID.

### POST /api/v1/recipes

Crea una nueva receta.

Ejemplo de body:

```json
{
  "name": "Flan casero",
  "category": "postres",
  "price": 12.8,
  "active": true,
  "difficulty": "fácil",
  "duration": 50
}
```

### PUT /api/v1/recipes/:id

Actualiza una receta completa o parcial.

### DELETE /api/v1/recipes/:id

Elimina una receta y responde con 204.

## Códigos HTTP usados

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 500 Internal Server Error

## Middlewares implementados

- express.json()
- logger personalizado
- 404 handler
- error handler global

## Pruebas rápidas con curl

```bash
curl http://localhost:3000/api/v1/recipes
curl http://localhost:3000/api/v1/recipes/1
curl -X POST http://localhost:3000/api/v1/recipes \
  -H "Content-Type: application/json" \
  -d '{"name":"Flan casero","category":"postres","price":12.8,"active":true,"difficulty":"fácil","duration":50}'
curl -X PUT http://localhost:3000/api/v1/recipes/1 \
  -H "Content-Type: application/json" \
  -d '{"price":14.5,"active":false}'
curl -X DELETE http://localhost:3000/api/v1/recipes/1
```

## Observaciones de diseño

- El almacenamiento es en memoria para cumplir con el requisito del bootcamp.
- La lógica de CRUD se encapsula en el store.
- La API usa rutas organizadas por recurso.
- Los errores se centralizan para mantener una respuesta uniforme.

## Evidencias

Las capturas de las pruebas están documentadas en [capturas-de-pantalla/README.md](./capturas-de-pantalla/README.md).

## Estado final

La API ya está funcionando y responde correctamente en la terminal con los endpoints CRUD necesarios.
