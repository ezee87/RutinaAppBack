/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     MetaNumericaDiaria:
 *       type: object
 *       required:
 *         - nombre
 *         - tipo
 *         - frecuencia
 *         - objetivoDiario
 *       properties:
 *         nombre:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [numerica]
 *         frecuencia:
 *           type: string
 *           enum: [diaria]
 *         objetivoDiario:
 *           type: number
 *     MetaNumericaSemanal:
 *       type: object
 *       required:
 *         - nombre
 *         - tipo
 *         - frecuencia
 *         - objetivoSemanal
 *       properties:
 *         nombre:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [numerica]
 *         frecuencia:
 *           type: string
 *           enum: [semanal]
 *         objetivoSemanal:
 *           type: number
 *     MetaBinaria:
 *       type: object
 *       required:
 *         - nombre
 *         - tipo
 *         - diasSeleccionados
 *       properties:
 *         nombre:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [binaria]
 *         diasSeleccionados:
 *           type: array
 *           items:
 *             type: string
 *     Progreso:
 *       type: object
 *       required:
 *         - meta
 *         - fecha
 *         - valor
 *       properties:
 *         meta:
 *           type: string
 *         fecha:
 *           type: string
 *           format: date
 *         valor:
 *           type: string
 *         nota:
 *           type: string
 *     Nota:
 *       type: object
 *       required:
 *         - fecha
 *         - texto
 *       properties:
 *         fecha:
 *           type: string
 *           format: date
 *         texto:
 *           type: string
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Configuración de CORS segura para producción
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Logs HTTP
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rutina App Backend API',
      version: '1.0.0',
      description: 'Documentación de la API para rutina-app',
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 4000) }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/metas', require('./routes/metas'));
app.use('/api/progresos', require('./routes/progresos'));
app.use('/api/notas', require('./routes/notas'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión:', err));

app.get('/', (req, res) => {
  res.send('API rutina-app-backend funcionando');
});

module.exports = app;
