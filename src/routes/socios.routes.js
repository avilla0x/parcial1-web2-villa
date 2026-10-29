// src/routes/socios.routes.js
import { Router } from 'express';
import { param, query } from 'express-validator';
import * as controlador from '../controllers/socios.controller.js';
import { validar } from '../middlewares/validar.js';

const router = Router();

const idValido = param('id')
  .isInt({ min: 1 }).withMessage('El id debe ser entero positivo')
  .toInt();

const reglasPrestamos = [
  idValido,
  query('estado')
    .optional()
     .isIn(['ACTIVO', 'DEVUELTO'])
    .withMessage("El estado debe ser 'ACTIVO' o 'DEVUELTO'"),
];

router.get('/:id/prestamos', reglasPrestamos, validar, controlador.listarPrestamos);

export default router;