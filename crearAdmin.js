const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('./models/Usuario');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const hash = await bcrypt.hash('repema', 10);
  const admin = new Usuario({
    nombre: 'Administrador',
    email: 'rperez@vellsam.com',
    contraseña: hash,
    rol: 'admin'
  });

  await admin.save();
  console.log('✅ Admin creado con éxito');
  mongoose.disconnect();
}).catch(err => console.error(err));
