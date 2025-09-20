const express = require('express');
const cors = require('cors');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); //IMPORTA SWAGGER
const swaggerDocument = YAML.load('./swagger.yaml'); //CARGA EL ARCHIVO YAML



const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Para poder recibir JSONs en el body



//DEFINICION DE RUTAS
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/messages', require('./routes/messages'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));