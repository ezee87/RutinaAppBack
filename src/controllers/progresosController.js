// Controlador para Progresos
const Progreso = require('../models/Progreso');
const mongoose = require('mongoose');

// Obtener todos los progresos del usuario autenticado
exports.getProgresos = async (req, res) => {
  try {
  const progresos = await Progreso.find({ usuario: req.userId });
    res.json(progresos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener progresos', error });
  }
};

// Crear un nuevo progreso
exports.createProgreso = async (req, res) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!req.userId) return res.status(401).json({ message: 'Usuario no autenticado' });

    // Logging para debugging
    console.log('createProgreso - userId:', req.userId);
    console.log('createProgreso - body:', req.body);

    // Validar que la meta enviada sea un ObjectId válido
    const { meta } = req.body;
    if (!meta || !mongoose.Types.ObjectId.isValid(meta)) {
      return res.status(400).json({ message: 'Id de meta inválido' });
    }

    // Verificar que la meta exista
    const Meta = require('../models/Meta');
    const metaDoc = await Meta.findById(meta);
    if (!metaDoc) {
      return res.status(400).json({ message: 'Meta no encontrada' });
    }

    // (Opcional) Verificar que la meta pertenezca al usuario
    if (metaDoc.usuario.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para agregar progreso a esta meta' });
    }

    const nuevoProgreso = new Progreso({ ...req.body, usuario: req.userId });
    await nuevoProgreso.save();
    res.status(201).json(nuevoProgreso);
  } catch (error) {
    console.error('Error al crear progreso:', error);
    // Enviar un mensaje más descriptivo al cliente, pero no exponer toda la traza
    res.status(500).json({ message: 'Error al crear progreso', detalle: error.message });
  }
};

// Actualizar un progreso existente
exports.updateProgreso = async (req, res) => {
  try {
    const progreso = await Progreso.findOneAndUpdate(
      { _id: req.params.id, usuario: req.userId },
      req.body,
      { new: true }
    );
    if (!progreso) return res.status(404).json({ message: 'Progreso no encontrado' });
    res.json(progreso);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar progreso', error });
  }
};

// Eliminar un progreso
exports.deleteProgreso = async (req, res) => {
  try {
  const progreso = await Progreso.findOneAndDelete({ _id: req.params.id, usuario: req.userId });
    if (!progreso) return res.status(404).json({ message: 'Progreso no encontrado' });
    res.json({ message: 'Progreso eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar progreso', error });
  }
};
