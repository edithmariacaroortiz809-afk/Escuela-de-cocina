# Escuela de Cocina — Procesador de Datos con Node.js

Este proyecto transforma un catálogo de recetas de una escuela de cocina en un informe procesado con Node.js + TypeScript y `async/await`.

## Dominio adaptado

En este caso el recurso principal se llama `Recipe` (receta) y el archivo de datos es `data/recipes.json`.

## Funcionalidades

- Lee datos desde un archivo JSON
- Calcula un resumen del catálogo
- Filtra por categoría usando `--category`
- Genera un reporte en `output/report.json`
- Maneja errores de archivo y categoría inexistente

## Instalación

```bash
cd week-01-nodejs_fundamentals/3-proyecto/starter
pnpm install
```

## Uso

Sin filtro:

```bash
pnpm dev
```

Con filtro por categoría:

```bash
pnpm dev -- --category postres
```

## Construcción

```bash
pnpm build
```

## Estructura

- `src/index.ts`: lógica principal del CLI
- `data/recipes.json`: catálogo de recetas
- `output/report.json`: informe generado
