const Meta = require('../models/Meta');

exports.getMetas = async (req, res) => {
  try {
    const metas = await Meta.find({ usuario: req.userId });
    res.json(metas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener metas' });
  }
};

exports.createMeta = async (req, res) => {
  try {
    const meta = await Meta.create({ ...req.body, usuario: req.userId });
    res.status(201).json(meta);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear meta' });
  }
};

exports.updateMeta = async (req, res) => {
  try {
    const meta = await Meta.findOneAndUpdate({ _id: req.params.id, usuario: req.userId }, req.body, { new: true });
    if (!meta) return res.status(404).json({ error: 'Meta no encontrada' });
    res.json(meta);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar meta' });
  }
};

exports.deleteMeta = async (req, res) => {
  try {
    const meta = await Meta.findOneAndDelete({ _id: req.params.id, usuario: req.userId });
    if (!meta) return res.status(404).json({ error: 'Meta no encontrada' });
    res.json({ message: 'Meta eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar meta' });
  }
};
