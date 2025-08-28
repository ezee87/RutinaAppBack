/**
 * @swagger
 * tags:
 *   name: Notas
 *   description: Endpoints para gestión de notas
 */
/**
 * @swagger
 * /api/notas:
 *   get:
 *     summary: Obtener todas las notas del usuario
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notas
 *   post:
 *     summary: Crear una nota
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 example: 2025-08-28
 *               texto:
 *                 type: string
 *                 example: "Hoy me sentí motivado"
 *     responses:
 *       201:
 *         description: Nota creada
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno
 */
/**
 * @swagger
 * /api/notas/{id}:
 *   put:
 *     summary: Actualizar una nota
 *     tags: [Notas]
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
 *             $ref: '#/components/schemas/Nota'
 *     responses:
 *       200:
 *         description: Nota actualizada
 *       404:
 *         description: Nota no encontrada
 *       500:
 *         description: Error interno
 *   delete:
 *     summary: Eliminar una nota
 *     tags: [Notas]
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
 *         description: Nota eliminada
 *       404:
 *         description: Nota no encontrada
 *       500:
 *         description: Error interno
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const notasController = require('../controllers/notasController');
const auth = require('../middlewares/auth');

const notaValidation = [
	body('fecha').notEmpty().withMessage('La fecha es obligatoria').isISO8601().withMessage('La fecha debe tener formato YYYY-MM-DD'),
	body('texto').notEmpty().withMessage('El texto es obligatorio').isString().withMessage('El texto debe ser una cadena')
];

router.get('/', auth, notasController.getNotas);
router.post(
	'/',
	auth,
	notaValidation,
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	notasController.createNota
);
router.put('/:id', auth, notasController.updateNota);
router.delete('/:id', auth, notasController.deleteNota);

module.exports = router;
