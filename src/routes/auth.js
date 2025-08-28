const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               email:
 *                 type: string
 *                 example: juan@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno
 */
router.post(
	'/register',
	[
		body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
		body('email').isEmail().withMessage('Email inválido'),
		body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Error de validación o credenciales
 *       500:
 *         description: Error interno
 */
router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Email inválido'),
		body('password').notEmpty().withMessage('La contraseña es obligatoria')
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
	authController.login
);

module.exports = router;
