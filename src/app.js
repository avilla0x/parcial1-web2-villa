// src/app.js — configura Express (sin arrancarlo)
import express from 'express';
import morgan from 'morgan';
import { manejarErrores } from './middlewares/errores.js';
import librosRouter from './routes/libros.routes.js';

const app = express();


app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => res.json({ nombre: 'Biblioteca API', version: '1.0' }));
app.use('/api/libros', librosRouter);

// 404 para rutas inexistentes (después de todas las rutas)
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador de errores: SIEMPRE el último
app.use(manejarErrores);

export default app;
