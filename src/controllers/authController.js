const db = require('../config/db'); // IMPORTA LA CONFIGURACION DE LA BASE DE DATOS
const bcrypt = require('bcryptjs'); // LIBRERIA PARA HASHEAR CONTRASEÑAS
const jwt = require('jsonwebtoken'); // LIBRERIA PARA GENERAR TOKENS JWT

// CREACIÓN DE USUARIO
exports.register = async (req, res) => { 
    const { email, password } = req.body; // OBTIENE EMAIL Y PASSWORD DEL BODY
    // VERIFICAR EXISTENCIA DE USUARIO
    try {
        const salt = await bcrypt.genSalt(10); // GENERA UN SALT PARA EL HASH
        const password_hash = await bcrypt.hash(password, salt); // HASHEA LA CONTRASEÑA
        const newUser = await db.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email", // INSERTA NUEVO USUARIO EN LA BD
            [email, password_hash]
        );
        res.status(201).json(newUser.rows[0]); // RESPONDE CON EL NUEVO USUARIO
    } catch (err) {
        console.error(err.message); // MUESTRA ERROR EN CONSOLA
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};

// INICIO DE SESIÓN
exports.login = async (req, res) => { 
    const { email, password } = req.body; // OBTIENE EMAIL Y PASSWORD DEL BODY
    // VERIFICAR USUARIO Y CONTRASEÑA
    try {
        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]); // BUSCA USUARIO POR EMAIL
        // VERIFICAR SI EL USUARIO EXISTE
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Credenciales inválidas' }); // RESPONDE SI NO EXISTE
        }
        const user = userResult.rows[0]; // OBTIENE EL USUARIO
        // VERIFICAR CONTRASEÑA
        const isMatch = await bcrypt.compare(password, user.password_hash); // COMPARA CONTRASEÑAS
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' }); // RESPONDE SI NO COINCIDE
        }
        // CREAR Y ENVIAR TOKEN JWT
        const payload = { user: { id: user.id } }; // CREA PAYLOAD PARA EL TOKEN
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => { // GENERA TOKEN JWT CON EXPIRACIÓN DE 5 HORAS
            if (err) throw err; // MANEJA ERROR DE TOKEN
            res.json({ token }); // RESPONDE CON EL TOKEN
        });
    } catch (err) {
        console.error(err.message); // MUESTRA ERROR EN CONSOLA
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};