// src/services/socios.service.js
import { prisma } from '../db.js';
import { noEncontrado } from '../errores.js';

export async function listarPrestamos(socioId, estado) {
  const socio = await prisma.socio.findUnique({
    where: { id: socioId },
  });

  if (!socio) {
    throw noEncontrado('Socio');
  }

  return prisma.prestamo.findMany({
    where: {
      socioId,
      ...(estado && { estado }),   // solo filtra por estado si vino
    },
    orderBy: [{ fechaPrestamo: 'desc' }, { id: 'desc' }],
    include: {
      libro: {
        select: {
          id: true,
          titulo: true,
          autor: true,
        },
      },
    },
  });
}