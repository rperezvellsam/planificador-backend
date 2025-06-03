const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea.js');

const verificarToken = require('../middlewares/auth');
router.get('/', verificarToken, async (req, res) => {
  const tareas = await Tarea.find({ usuario: req.usuario.id }).sort({ createdAt: -1 });
  res.json(tareas);
});

router.get('/', async (req, res) => {
  const tareas = await Tarea.find().sort({ createdAt: -1 });
  res.json(tareas);
});

router.post('/', async (req, res) => {
  const tarea = new Tarea(req.body);
  await tarea.save();
  res.status(201).json(tarea);
});

router.patch('/:id', async (req, res) => {
  const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tarea);
});

router.delete('/:id', async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
