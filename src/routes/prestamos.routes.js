// src/routes/prestamos.routes.js
import { Router } from 'express';
import { body, param } from 'express-validator';
import * as controlador from '../controllers/prestamos.controller.js';
import { validar } from '../middlewares/validar.js';

const router = Router();

const idValido = param('id')
  .isInt({ min: 1 }).withMessage('El id debe ser entero positivo')
  .toInt();
  const reglasPrestar = [
  body('socioId')
    .isInt({ min: 1 }).withMessage('socioId debe ser un entero positivo')
    .toInt(),
  body('libroId')
    .isInt({ min: 1 }).withMessage('libroId debe ser un entero positivo')
    .toInt(),
];
   router.post('/', reglasPrestar, validar, controlador.prestar);
   router.patch('/:id/devolucion', idValido, validar, controlador.devolver);
export default router;