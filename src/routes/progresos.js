/**
 * @swagger
 * tags:
 *   name: Progresos
 *   description: Endpoints para gestión de progresos
 */
/**
 * @swagger
 * /api/progresos:
 *   get:
 *     summary: Obtener todos los progresos del usuario
 *     tags: [Progresos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de progresos
 *   post:
 *     summary: Crear un progreso
 *     tags: [Progresos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meta:
 *                 type: string
 *                 example: 64ecb2f1a1b2c3d4e5f6a7b8
 *               fecha:
 *                 type: string
 *                 example: 2025-08-28
 *               valor:
 *                 type: string
 *                 example: 10
 *               nota:
 *                 type: string
 *                 example: "Leí antes de dormir"
 *     responses:
 *       201:
 *         description: Progreso creado
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno
 */
/**
 * @swagger
 * /api/progresos/{id}:
 *   put:
 *     summary: Actualizar un progreso
 *     tags: [Progresos]
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
 *             $ref: '#/components/schemas/Progreso'
 *     responses:
 *       200:
 *         description: Progreso actualizado
 *       404:
 *         description: Progreso no encontrado
 *       500:
 *         description: Error interno
 *   delete:
 *     summary: Eliminar un progreso
 *     tags: [Progresos]
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
 *         description: Progreso eliminado
 *       404:
 *         description: Progreso no encontrado
 *       500:
 *         description: Error interno
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const progresosController = require('../controllers/progresosController');
const auth = require('../middlewares/auth');

const progresoValidation = [
	body('meta').notEmpty().withMessage('El id de la meta es obligatorio'),
	body('fecha').notEmpty().withMessage('La fecha es obligatoria').isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD'),
	body('valor').notEmpty().withMessage('El valor es obligatorio'),
	body('nota').optional().isString().withMessage('La nota debe ser texto')
];

router.get('/', auth, progresosController.getProgresos);
router.post(
	'/',
	auth,
	progresoValidation,
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	progresosController.createProgreso
);
router.put('/:id', auth, progresosController.updateProgreso);
router.delete('/:id', auth, progresosController.deleteProgreso);

module.exports = router;
