const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  completada: { type: Boolean, default: false },
  fecha: Date,
  usuario: String
}, { timestamps: true });

module.exports = mongoose.model('Tarea', tareaSchema);
