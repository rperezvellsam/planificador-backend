const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea.js');

// Obtener todas las tareas (sin requerir login)
router.get('/', async (req, res) => {
  try {
    const tareas = await Tarea.find().sort({ createdAt: -1 });
    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear tarea
router.post('/', async (req, res) => {
  try {
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.status(201).json(tarea);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// Actualizar tarea
router.patch('/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tarea);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

module.exports = router;
