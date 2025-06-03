const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

// Obtener tareas solo para el usuario autenticado
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const tareas = await Tarea.find({ usuariosAsignados: decoded.id }).sort({ createdAt: -1 });
    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear tarea asignada por admin
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.rol !== 'admin') return res.status(403).json({ error: 'Solo administradores' });

    const { titulo, descripcion, fecha, usuariosAsignados } = req.body;
    const tarea = new Tarea({ titulo, descripcion, fecha, usuariosAsignados });
    await tarea.save();
    res.status(201).json(tarea);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// Actualizar tarea (admin o dueño)
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
// Ver todas las tareas (solo admin)
router.get('/todas', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.rol !== 'admin') return res.status(403).json({ error: 'Solo administradores' });

    const tareas = await Tarea.find().populate('usuariosAsignados', 'nombre email');
    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tareas (admin)' });
  }
});

module.exports = router;
