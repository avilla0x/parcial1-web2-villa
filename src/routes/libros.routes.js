// src/routes/libros.routes.js
import { Router } from 'express';
import * as controlador from '../controllers/libros.controller.js';
import { validar } from '../middlewares/validar.js';
import { body, param, query } from 'express-validator';

const router = Router();

const idValido = param('id')
  .isInt({ min: 1 }).withMessage('El id debe ser entero positivo')
  .toInt();

const reglasCrear = [
  body('titulo')
    .isString().withMessage('El título debe ser texto').bail()
    .trim()
    .notEmpty().withMessage('El título es obligatorio'),

   body('autor')
    .isString().withMessage('El autor debe ser texto').bail()
    .trim()
    .notEmpty().withMessage('El autor es obligatorio'),

  body('isbn')
    .isString().withMessage('El ISBN debe ser texto').bail()
    .trim()
    .notEmpty().withMessage('El ISBN es obligatorio'), 

  body('ejemplares')
    .isInt({ min: 1, max: 50 }).withMessage('ejemplares debe ser un entero entre 1 y 50')
    .toInt(),
];

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

router.get('/:id', idValido, validar, controlador.obtener);

router.post('/', reglasCrear, validar, controlador.crear);

export default router;