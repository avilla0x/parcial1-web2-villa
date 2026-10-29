// src/services/libros.service.js
import { prisma } from '../db.js';
import { conflicto, noEncontrado } from '../errores.js';

export async function crear({titulo , autor, isbn, ejemplares}){
    const libroExistente = await prisma.libro.findUnique({
        where: { isbn },
    });

    if (libroExistente){
        throw conflicto('Ya existe un libro con ese ISBN');
    }
   return prisma.libro.create({
    data: {
      titulo,
      autor,
      isbn,
      ejemplaresTotales: ejemplares,
      ejemplaresDisponibles: ejemplares,
    },
  }); 
}

export async function buscarPorId(id) {
  const libro = await prisma.libro.findUnique({ where: { id } });
  if (!libro) throw noEncontrado('Libro');
  return libro;
}

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