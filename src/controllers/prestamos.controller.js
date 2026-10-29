// src/controllers/prestamos.controller.js
import { matchedData } from 'express-validator';
import * as servicio from '../services/prestamos.service.js';

export async function prestar(req, res, next) {
  try {
    const { socioId, libroId } = matchedData(req);
    const prestamo = await servicio.prestar({ socioId, libroId });
    return res.status(201).json(prestamo);
  } catch (error) {
    next(error);
  }
}

export async function devolver(req, res, next) {
  try {
    const { id } = matchedData(req);
    const prestamo = await servicio.devolver(id);
    return res.json(prestamo);
  } catch (error) {
    next(error);
  }
}