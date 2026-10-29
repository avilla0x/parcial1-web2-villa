// src/controllers/libros.controller.js
import { matchedData } from 'express-validator';
import * as servicio from '../services/libros.service.js';

export async function listar(req, res, next) {
  try {
    const { buscar, disponibles, pagina = 1, porPagina = 10 } = matchedData(req);
    const resultado = await servicio.listar({
      buscar,
      disponibles: disponibles === 'true',
      pagina,
      porPagina
    });

    return res.json(resultado);
  } catch (error) {
    next(error);
  }
}