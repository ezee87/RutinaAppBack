const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['numerica', 'binaria'], required: true },
  frecuencia: {
    type: String,
    enum: ['diaria', 'semanal'],
    required: function() { return this.tipo === 'numerica'; }
  },
  objetivoDiario: {
    type: Number,
    required: function() { return this.tipo === 'numerica' && this.frecuencia === 'diaria'; }
  },
  objetivoSemanal: {
    type: Number,
    required: function() { return this.tipo === 'numerica' && this.frecuencia === 'semanal'; }
  },
  diasSeleccionados: {
    type: [String],
    required: function() { return this.tipo === 'binaria'; },
    default: undefined
  },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meta', metaSchema);
