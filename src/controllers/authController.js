const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ error: 'Email ya registrado' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, passwordHash });
    res.status(201).json({ message: 'Usuario registrado', user: { id: user._id, nombre, email } });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar usuario', detalle: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, nombre: user.nombre, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
