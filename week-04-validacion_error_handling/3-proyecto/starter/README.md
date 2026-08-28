# Escuela de Cocina - Semana 4

API REST de recetas con validación, errores estructurados y logging profesional.

## Dominio y recurso

- Dominio: Escuela de Cocina
- Recurso principal: Recipe
- Ruta base: `/api/v1/recipes`

## Validaciones

Zod valida `name`, `category`, `price`, `active`, `difficulty` y `duration` al crear recetas. La actualización acepta campos opcionales mediante `.partial()`. El parámetro `:id` usa un entero positivo coercionado y el listado valida `page` y `limit` para la paginación.

## Arquitectura

`routes -> controllers -> services -> repositories`

El servicio concentra la lógica de negocio y lanza `AppError` cuando una receta no existe. `notFound` se registra antes de `errorHandler`, que distingue errores Zod, `AppError` y errores inesperados.

## Logging

Winston usa formato colorizado y nivel `http` en desarrollo, formato JSON y nivel `warn` en producción. Morgan envía las peticiones a Winston. En producción se guarda `logs/error.log`.

## Ejecución

```bash
pnpm install
pnpm dev
```

Para compilar:

```bash
pnpm build
```

## Evidencias

Consulta [capturas-de-pantalla/README.md](./capturas-de-pantalla/README.md) para los nombres de las capturas requeridas.
