# Pruebas con curl — API de recetas

## 1) Listar recetas

```bash
curl -s http://localhost:3000/api/v1/recipes
```

Salida esperada:

```json
{
  "success": true,
  "data": [
    {"id":1,"name":"Paella Valenciana","category":"platos principales","price":24.5,"active":true,"difficulty":"media","duration":45},
    {"id":2,"name":"Risotto de setas","category":"platos principales","price":22,"active":true,"difficulty":"media","duration":40},
    {"id":3,"name":"Tarta de manzana","category":"postres","price":11.5,"active":true,"difficulty":"fácil","duration":55},
    {"id":4,"name":"Gazpacho andaluz","category":"sopas","price":13.5,"active":true,"difficulty":"fácil","duration":20}
  ]
}
```

## 2) Crear receta

```bash
curl -sS -X POST http://localhost:3000/api/v1/recipes \
  -H "Content-Type: application/json" \
  --data '{"name":"Flan casero","category":"postres","price":12.8,"active":true,"difficulty":"fácil","duration":50}'
```

Salida esperada:

```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Flan casero",
    "category": "postres",
    "price": 12.8,
    "active": true,
    "difficulty": "fácil",
    "duration": 50
  }
}
```

## 3) Obtener receta por ID

```bash
curl -sS http://localhost:3000/api/v1/recipes/1
```

## 4) Actualizar receta

```bash
curl -sS -X PUT http://localhost:3000/api/v1/recipes/1 \
  -H "Content-Type: application/json" \
  --data '{"price":14.5,"active":false}'
```

## 5) Eliminar receta

```bash
curl -sS -X DELETE http://localhost:3000/api/v1/recipes/1 -i
```

Salida esperada:

```text
HTTP/1.1 204 No Content
```

## 6) Ruta inexistente

```bash
curl -sS -i http://localhost:3000/api/v1/recipes/999
```

Salida esperada:

```text
HTTP/1.1 404 Not Found
```
