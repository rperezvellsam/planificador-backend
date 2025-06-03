const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router = express.Router();

// Middleware para verificar token y rol de admin
const verificarAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Solo administradores' });
    }
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

// Ruta para que el admin cree un nuevo usuario
router.post('/crear-usuario', verificarAdmin, async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'Ya existe el usuario' });

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevo = new Usuario({ nombre, email, contraseña: hash, rol });
    await nuevo.save();
    res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevo });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error interno', error: err });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    console.log('INTENTO DE LOGIN:', email);
    console.log('Body recibido:', req.body);

    const usuario = await Usuario.findOne({ email });
    console.log('Usuario encontrado:', usuario);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    console.log('¿Contraseña correcta?', match);

    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, usuario });
  } catch (error) {
    console.error('ERROR EN LOGIN:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

module.exports = router;
