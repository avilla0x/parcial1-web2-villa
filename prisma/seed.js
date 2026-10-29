// prisma/seed.js — re-ejecutable: usa upsert, nunca create.
// Flujo recomendado: `npx prisma migrate reset` (borra y aplica migraciones + corre este seed).
// prisma/seed.js
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.ts';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const socios = [
  { id: 1, nombre: 'Laura Gómez', email: 'laura@ucaldas.edu.co' },
  { id: 2, nombre: 'Andrés Ríos', email: 'andres@ucaldas.edu.co'},
  { id: 3, nombre: 'Sofía Marín', email: 'sofia@ucaldas.edu.co'},
];

const libros = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', isbn: 'ISBN-001', ejemplaresTotales: 3, ejemplaresDisponibles: 3 },
    { id: 2, titulo: 'El amor en los tiempos del cólera', autor: 'Gabriel García Márquez', isbn: 'ISBN-002', ejemplaresTotales: 2, ejemplaresDisponibles: 1 },
    { id: 3, titulo: 'Clean Code', autor: 'Robert C. Martin', isbn: 'ISBN-003', ejemplaresTotales: 1, ejemplaresDisponibles: 0 },
    { id: 4, titulo: 'Node.js Design Patterns', autor: 'Mario Casciaro', isbn: 'ISBN-004', ejemplaresTotales: 2, ejemplaresDisponibles: 1 },
    { id: 5, titulo: 'La vorágine', autor: 'José Eustasio Rivera', isbn: 'ISBN-005', ejemplaresTotales: 1, ejemplaresDisponibles: 1 },
];

const fechaLimite = new Date();
fechaLimite.setDate(fechaLimite.getDate() + 14);

const prestamos = [
    { id: 1, socioId: 3, libroId: 2, fechaLimite },
    { id: 2, socioId: 3, libroId: 3, fechaLimite },
    { id: 3, socioId: 3, libroId: 4, fechaLimite },
];

async function main() {
  for (const socio of socios) {
    await prisma.socio.upsert({
      where: { id: socio.id },
      update: {},
      create: socio,
    });
  }

  for (const libro of libros) {
    await prisma.libro.upsert({
      where: { id: libro.id },
      update: {},
      create: libro,
    });
  }

  for (const prestamo of prestamos) {
   await prisma.prestamo.upsert({
      where: { id: prestamo.id },
      update: {},
      create: prestamo,
    });
  }
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Socio"', 'id'), (SELECT MAX(id) FROM "Socio"))`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Libro"', 'id'), (SELECT MAX(id) FROM "Libro"))`;
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Prestamo"', 'id'), (SELECT MAX(id) FROM "Prestamo"))`;
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });