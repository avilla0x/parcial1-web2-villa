// src/services/libros.service.js
import { prisma } from '../db.js';

export async function listar({ buscar, disponibles, pagina, porPagina }) {
  const condiciones = [];
  if (buscar) {
    condiciones.push({
      OR: [
        { titulo: { contains: buscar, mode: 'insensitive' } },
        { autor: { contains: buscar, mode: 'insensitive' } },
      ],
    });
  }
  if (disponibles) condiciones.push({ ejemplaresDisponibles: { gt: 0 } });

  const where = condiciones.length ? { AND: condiciones } : undefined;

  const [datos, total] = await Promise.all([
    prisma.libro.findMany({
      where,
      orderBy: { titulo: 'asc' },
      skip: (pagina - 1) * porPagina,
      take: porPagina,
    }),
    prisma.libro.count({ where }),
  ]);

  return {
    datos,
    paginacion: {
      pagina,
      porPagina,
      total,
      totalPaginas: Math.ceil(total / porPagina),
    },
  };
}