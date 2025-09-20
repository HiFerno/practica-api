const express = require('express'); // IMPORTA EXPRESS
const router = express.Router(); // CREA EL ROUTER DE EXPRESS
const { register, login } = require('../controllers/authController'); // IMPORTA LOS CONTROLADORES DE AUTENTICACION

// POST /auth/register
// CREAR USUARIO
router.post('/register', register); // RUTA PARA REGISTRAR USUARIO

// POST /auth/login
// INICIAR SESIÓN
router.post('/login', login); // RUTA PARA INICIAR SESIÓN

module.exports = router; // EXPORTA EL ROUTER