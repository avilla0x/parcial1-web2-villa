// src/controllers/libros.controller.js
import { matchedData } from 'express-validator';
import * as servicio from '../services/libros.service.js';

export async function crear(req, res, next) {
  try {
    const { titulo, autor, isbn, ejemplares } = matchedData(req);
    
    const libro = await servicio.crear({
      titulo,
      autor,
      isbn,
      ejemplares
    });

    return res.status(201).json(libro);
  } catch (error) {
    next(error);
  }
}

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

export async function obtener(req, res, next){
  try{
    const libro = await servicio.buscarPorId(Number(req.params.id));
    res.json(libro);
  } catch (error){
    next(error);
  }
}