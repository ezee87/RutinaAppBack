const mongoose = require('mongoose');

const progresoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meta: { type: mongoose.Schema.Types.ObjectId, ref: 'Meta', required: true },
  fecha: { type: String, required: true }, // YYYY-MM-DD
  valor: { type: mongoose.Schema.Types.Mixed, required: true }, // number o boolean
  nota: { type: String }
});

module.exports = mongoose.model('Progreso', progresoSchema);
