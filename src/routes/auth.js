const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

//POST /auth/register
//Crear usuario
router.post('/register', register);

//POST /auth/login
//Iniciar sesión
router.post('/login', login);

module.exports = router;