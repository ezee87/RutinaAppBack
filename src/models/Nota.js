const mongoose = require('mongoose');

const notaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: String, required: true }, // YYYY-MM-DD
  texto: { type: String, required: true }
});

module.exports = mongoose.model('Nota', notaSchema);
