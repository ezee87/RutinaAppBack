/**
 * @swagger
 * tags:
 *   name: Metas
 *   description: Endpoints para gestión de metas
 */
/**
 * @swagger
 * /api/metas:
 *   get:
 *     summary: Obtener todas las metas del usuario
 *     tags: [Metas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de metas
 *   post:
 *     summary: Crear una meta
 *     tags: [Metas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Leer 10 páginas
 *               tipo:
 *                 type: string
 *                 enum: [numerica, binaria]
 *                 example: numerica
 *               frecuencia:
 *                 type: string
 *                 enum: [diaria, semanal]
 *                 example: diaria
 *               objetivoDiario:
 *                 type: number
 *                 example: 10
 *               objetivoSemanal:
 *                 type: number
 *                 example: 70
 *               diasSeleccionados:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["mon", "wed", "fri"]
 *     responses:
 *       201:
 *         description: Meta creada
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno
 */
/**
 * @swagger
 * /api/metas/{id}:
 *   put:
 *     summary: Actualizar una meta
 *     tags: [Metas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/MetaNumericaDiaria'
 *               - $ref: '#/components/schemas/MetaNumericaSemanal'
 *               - $ref: '#/components/schemas/MetaBinaria'
 *     responses:
 *       200:
 *         description: Meta actualizada
 *       404:
 *         description: Meta no encontrada
 *       500:
 *         description: Error interno
 *   delete:
 *     summary: Eliminar una meta
 *     tags: [Metas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meta eliminada
 *       404:
 *         description: Meta no encontrada
 *       500:
 *         description: Error interno
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const metasController = require('../controllers/metasController');
const auth = require('../middlewares/auth');

// Validaciones para crear meta
const metaValidation = [
	body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
	body('tipo').isIn(['numerica', 'binaria']).withMessage('El tipo debe ser numerica o binaria'),
	body('frecuencia')
		.custom((value, { req }) => {
			if (req.body.tipo === 'numerica' && !['diaria', 'semanal'].includes(value)) {
				throw new Error('La frecuencia debe ser diaria o semanal para metas numéricas');
			}
			if (req.body.tipo === 'binaria' && value !== undefined) {
				throw new Error('No se permite frecuencia en metas binarias');
			}
			return true;
		}),
	body('objetivoDiario')
		.custom((value, { req }) => {
			if (req.body.tipo === 'numerica' && req.body.frecuencia === 'diaria') {
				if (value === undefined) throw new Error('El objetivo diario es obligatorio para metas numéricas diarias');
				if (typeof value !== 'number') throw new Error('El objetivo diario debe ser numérico');
			}
			if (req.body.tipo === 'binaria' && value !== undefined) {
				throw new Error('No se permite objetivo diario en metas binarias');
			}
			if (req.body.tipo === 'numerica' && req.body.frecuencia === 'semanal' && value !== undefined) {
				throw new Error('No se permite objetivo diario en metas numéricas semanales');
			}
			return true;
		}),
	body('objetivoSemanal')
		.custom((value, { req }) => {
			if (req.body.tipo === 'numerica' && req.body.frecuencia === 'semanal') {
				if (value === undefined) throw new Error('El objetivo semanal es obligatorio para metas numéricas semanales');
				if (typeof value !== 'number') throw new Error('El objetivo semanal debe ser numérico');
			}
			if (req.body.tipo === 'binaria' && value !== undefined) {
				throw new Error('No se permite objetivo semanal en metas binarias');
			}
			if (req.body.tipo === 'numerica' && req.body.frecuencia === 'diaria' && value !== undefined) {
				throw new Error('No se permite objetivo semanal en metas numéricas diarias');
			}
			return true;
		}),
	body('diasSeleccionados')
		.custom((value, { req }) => {
			if (req.body.tipo === 'binaria') {
				if (!Array.isArray(value) || value.length === 0) throw new Error('Los días seleccionados son obligatorios y deben ser un array no vacío en metas binarias');
			}
			if (req.body.tipo === 'numerica' && value !== undefined) {
				throw new Error('No se permiten días seleccionados en metas numéricas');
			}
			return true;
		})
];

router.get('/', auth, metasController.getMetas);
router.post(
	'/',
	auth,
	metaValidation,
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	metasController.createMeta
);
router.put('/:id', auth, metasController.updateMeta);
router.delete('/:id', auth, metasController.deleteMeta);

module.exports = router;
