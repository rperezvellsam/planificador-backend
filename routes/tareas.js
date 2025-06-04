const express = require('express');
const router = express.Router();
const Tarea = require('../models/Tarea.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

// Obtener tareas asignadas al usuario autenticado
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('📥 GET /tareas → Usuario:', decoded);

    const tareas = await Tarea.find({
      usuariosAsignados: { $exists: true, $in: [decoded.id] }
    }).sort({ createdAt: -1 });

    res.json(tareas);
  } catch (err) {
    console.error('🔥 Error en GET /tareas:', err.message);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Obtener todas las tareas (solo admin)
router.get('/todas', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🔍 GET /tareas/todas → decoded:', decoded);

    if (decoded.rol !== 'admin') return res.status(403).json({ error: 'Solo administradores' });

    const tareas = await Tarea.find().populate('usuariosAsignados', 'nombre email');
    res.json(tareas);
  } catch (err) {
    console.error('🔥 Error en GET /tareas/todas:', err.message);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear nueva tarea (solo admin)
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🛠 POST /tareas → decoded:', decoded);
    console.log('📦 Body recibido:', req.body);

    if (decoded.rol !== 'admin') return res.status(403).json({ error: 'Solo administradores' });

    const { titulo, descripcion, fecha, zona, usuariosAsignados } = req.body;
    if (!titulo || !fecha || !usuariosAsignados) {
      console.log('❌ Campos incompletos en body:', req.body);
      return res.status(400).json({ error: 'Campos incompletos' });
    }

    const tarea = new Tarea({ titulo, descripcion, fecha, zona, usuariosAsignados });
    await tarea.save();
    res.status(201).json(tarea);
  } catch (err) {
    console.error('🔥 Error en POST /tareas:', err.message);
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
