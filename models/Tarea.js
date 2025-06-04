const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  completada: { type: Boolean, default: false },
  fecha: Date,
  zona: String, 
  usuariosAsignados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }]
}, { timestamps: true });

module.exports = mongoose.model('Tarea', tareaSchema);
