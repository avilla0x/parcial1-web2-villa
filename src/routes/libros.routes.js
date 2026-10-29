// src/routes/libros.routes.js
import { Router } from 'express';
import { query } from 'express-validator';
import * as controlador from '../controllers/libros.controller.js';
import { validar } from '../middlewares/validar.js';

const router = Router();

const reglasListar = [
  query('buscar')
    .optional()
    .isString().withMessage('buscar debe ser texto')
    .trim(),
  query('disponibles')
    .optional()
    .isIn(['true', 'false'])
    .withMessage("disponibles debe ser 'true' o 'false'"),

  query('pagina')
    .optional()
    .isInt({ min: 1 })
    .withMessage('pagina debe ser un entero mayor o igual a 1')
    .toInt(),

  query('porPagina')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('porPagina debe ser un entero entre 1 y 20')
    .toInt(),
];

router.get('/', reglasListar, validar, controlador.listar);

export default router;