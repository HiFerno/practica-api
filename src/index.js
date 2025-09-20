const express = require('express'); // IMPORTA EXPRESS
const cors = require('cors'); // IMPORTA CORS
require('dotenv').config(); // CARGA VARIABLES DE ENTORNO

const swaggerUi = require('swagger-ui-express'); // IMPORTA SWAGGER UI
const YAML = require('yamljs'); // IMPORTA YAMLJS
const swaggerDocument = YAML.load('./swagger.yaml'); // CARGA EL ARCHIVO SWAGGER YAML

const app = express(); // CREA LA INSTANCIA DE EXPRESS

// MIDDLEWARES
app.use(cors()); // HABILITA CORS
app.use(express.json()); // PERMITE RECIBIR JSON EN EL BODY

// DEFINICION DE RUTAS
app.use('/auth', require('./routes/auth')); // RUTAS DE AUTENTICACION
app.use('/users', require('./routes/users')); // RUTAS DE USUARIOS
app.use('/messages', require('./routes/messages')); // RUTAS DE MENSAJES
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // RUTA DE DOCUMENTACION SWAGGER

const PORT = process.env.PORT || 3000; // DEFINE EL PUERTO

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`)); // INICIA EL SERVIDOR