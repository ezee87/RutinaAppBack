const Nota = require('../models/Nota');

exports.getNotas = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtro = { usuario: req.userId };
    if (desde && hasta) filtro.fecha = { $gte: desde, $lte: hasta };
    const notas = await Nota.find(filtro);
    res.json(notas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener notas' });
  }
};

exports.createNota = async (req, res) => {
  try {
    const nota = await Nota.create({ ...req.body, usuario: req.userId });
    res.status(201).json(nota);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear nota' });
  }
};

exports.updateNota = async (req, res) => {
  try {
    const nota = await Nota.findOneAndUpdate({ _id: req.params.id, usuario: req.userId }, req.body, { new: true });
    if (!nota) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json(nota);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar nota' });
  }
};

exports.deleteNota = async (req, res) => {
  try {
    const nota = await Nota.findOneAndDelete({ _id: req.params.id, usuario: req.userId });
    if (!nota) return res.status(404).json({ error: 'Nota no encontrada' });
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar nota' });
  }
};
