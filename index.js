const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tareasRoutes = require('./routes/tareas.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tareas', tareasRoutes);

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(port, () => console.log(`Servidor en puerto ${port}`));
  })
  .catch(err => console.error(err));
