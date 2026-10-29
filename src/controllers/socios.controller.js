// src/controllers/socios.controller.js
import { matchedData } from 'express-validator';
import * as servicio from '../services/socios.service.js';

export async function listarPrestamos(req, res, next) {
  try {
    const { id, estado } = matchedData(req);
    const prestamos = await servicio.listarPrestamos(id, estado);
    return res.json(prestamos);
  } catch (error) {
    next(error);
  }
}