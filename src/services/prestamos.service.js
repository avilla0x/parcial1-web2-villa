// src/services/prestamos.service.js
import { prisma } from '../db.js';
import { conflicto, noEncontrado } from '../errores.js';

const MAX_PRESTAMOS_ACTIVOS = 3;
const DIAS_PRESTAMO = 14;

export async function prestar({ socioId, libroId }) {
  return prisma.$transaction(async (tx) => {

    const socio = await tx.socio.findUnique({ where: { id: socioId } });
    if (!socio) throw noEncontrado('Socio');

  
    const libro = await tx.libro.findUnique({ where: { id: libroId } });
    if (!libro) throw noEncontrado('Libro');

    const activos = await tx.prestamo.count({
      where: { socioId, estado: 'ACTIVO' },
    });
    if (activos >= MAX_PRESTAMOS_ACTIVOS) {
      throw conflicto('El socio ya tiene 3 préstamos activos');
    }

    const descuento = await tx.libro.updateMany({
      where: { id: libroId, ejemplaresDisponibles: { gt: 0 } },
      data: { ejemplaresDisponibles: { decrement: 1 } },
    });
    if (descuento.count === 0) {
      throw conflicto('No hay ejemplares disponibles de este libro');
    }

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + DIAS_PRESTAMO);

    return tx.prestamo.create({
      data: { socioId, libroId, fechaLimite },
      include: { libro: { select: { id: true, titulo: true } } },
    });
  });
}

export async function devolver(id) {
  return prisma.$transaction(async (tx) => {
    const prestamo = await tx.prestamo.findUnique({
      where: { id },
    });
    if (!prestamo) {
      throw noEncontrado('Préstamo');
    }
    if (prestamo.estado === 'DEVUELTO') {
      throw conflicto('El préstamo ya fue devuelto');
    }
    await tx.libro.update({
      where: { id: prestamo.libroId },
      data: {
        ejemplaresDisponibles: {
          increment: 1,
        },
      },
    });
    return tx.prestamo.update({
      where: { id },
      data: {
        estado: 'DEVUELTO',
        fechaDevolucion: new Date(),
      },
    });
  });
}

