# Biblioteca — API de préstamos

API REST de préstamos de la biblioteca de la universidad. Parcial 1 de Programación Web 2.

**Stack:** Node.js 22.18+ (ES modules), Express 5, Prisma 7.10.0 y PostgreSQL 16.

**Autor:** ALEJANDRO VILLA OSORIO · GitHub: [avilla0x](https://github.com/avilla0x)

## Levantar el proyecto desde cero

1. Crear el contenedor de PostgreSQL (puerto 5433 → 5432):

   ```bash
   docker run --name biblioteca-db -e POSTGRES_USER=biblio -e POSTGRES_PASSWORD=secreto123 -e POSTGRES_DB=biblioteca -p 5433:5432 -d postgres:16
   ```

2. Instalar dependencias (el `postinstall` ya genera el cliente de Prisma):

   ```bash
   npm install
   ```

3. Crear el archivo de entorno y ajustar la URL si tu contenedor es distinto:

   ```bash
   cp .env.example .env
   ```

4. Aplicar la migración `inicial` y generar el cliente (en Prisma 7, `migrate` no lo genera solo):

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. Cargar los datos de ejemplo (3 socios, 5 libros y 3 préstamos):

   ```bash
   npx prisma db seed
   ```

6. Arrancar la API en http://localhost:4000:

   ```bash
   npm run dev
   ```

Para volver a la base recién sembrada en cualquier momento:

```bash
npx prisma migrate reset
npx prisma db seed
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/libros` | Lista con filtros `buscar`, `disponibles` y paginación `pagina`, `porPagina` |
| GET | `/api/libros/:id` | Ver un libro |
| POST | `/api/libros` | Registrar un libro (`titulo`, `autor`, `isbn`, `ejemplares`) |
| POST | `/api/prestamos` | Prestar un libro (`socioId`, `libroId`) |
| PATCH | `/api/prestamos/:id/devolucion` | Devolver un libro |
| GET | `/api/socios/:id/prestamos` | Historial de un socio, filtrable con `?estado=ACTIVO` o `DEVUELTO` |

Los errores siempre responden en JSON: `{ "error": "..." }`, y los de validación (400) agregan `"detalles": [...]`.

## Estructura

```
src/
├── server.js        # arranca el servidor (puerto 4000)
├── app.js           # configura Express: middlewares, rutas, 404 y errores
├── db.js            # instancia única de PrismaClient
├── errores.js       # ErrorHttp y fábricas (noEncontrado, conflicto, datosInvalidos)
├── routes/          # reglas de express-validator y mapa de URLs
├── controllers/     # traducen HTTP <-> negocio; los errores van a next(error)
├── services/        # reglas de negocio y consultas; no conocen req/res
└── middlewares/     # validar.js y errores.js (manejador central)
prisma/
├── schema.prisma    # Socio, Libro, Prestamo y el enum EstadoPrestamo
├── migrations/      # migración inicial
└── seed.js          # datos de ejemplo
```

## Prueba de concurrencia

Con la API encendida y la base recién sembrada, el libro 5 tiene un solo ejemplar:

```bash
node carrera-biblioteca.mjs
```

Resultado esperado: `Aceptados: 1 · Rechazados: 9` y `Disponibles: 0`. El descuento del ejemplar es atómico: la condición `ejemplaresDisponibles > 0` va en el `WHERE` de un `updateMany` dentro de la transacción.