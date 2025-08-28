// Controlador para Progresos
const Progreso = require('../models/Progreso');

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
  const nuevoProgreso = new Progreso({ ...req.body, usuario: req.userId });
    await nuevoProgreso.save();
    res.status(201).json(nuevoProgreso);
  } catch (error) {
    console.error('Error al crear progreso:', error);
    res.status(500).json({ message: 'Error al crear progreso', detalle: error.message, error });
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
