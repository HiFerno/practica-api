const db = require('../config/db'); // IMPORTA LA CONFIGURACION DE LA BASE DE DATOS
const bcrypt = require('bcryptjs'); // LIBRERIA PARA HASHEAR CONTRASEÑAS
const jwt = require('jsonwebtoken'); // LIBRERIA PARA GENERAR TOKENS JWT

// Creación de usuario
exports.register = async (req, res) => { 
    const { email, password } = req.body;
    //VERIFICAR EXISTENCIA DE USUARIO
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const newUser = await db.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
            [email, password_hash]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};

// Inicio de sesión
exports.login = async (req, res) => { 
    const { email, password } = req.body;
    //VERIFICAR USUARIO Y CONTRASEÑA
    try {
        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        //VERIFICAR SI EL USUARIO EXISTE
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        const user = userResult.rows[0];
        //VERIFICAR CONTRASEÑA
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        //CREAR Y ENVIAR TOKEN JWT
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => { //expiracion de 5 horas
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};