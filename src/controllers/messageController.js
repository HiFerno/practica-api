const db = require('../config/db'); // IMPORTA LA CONFIGURACION DE LA BASE DE DATOS

// CREAR UN MENSAJE
exports.createMessage = async (req, res) => {
    const { content } = req.body; // OBTIENE EL CONTENIDO DEL BODY
    // VALIDACION DEL CONTENIDO
    try {
        const newMessage = await db.query(
            "INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING *", // INSERTA NUEVO MENSAJE EN LA BD
            [req.user.id, content]
        );
        res.status(201).json(newMessage.rows[0]); // RESPONDE CON EL NUEVO MENSAJE
    } catch (err) {
        console.error(err.message); // MUESTRA ERROR EN CONSOLA
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};

// OBTENER LOS ÚLTIMOS 10 MENSAJES
exports.getLatestMessages = async (req, res) => {
    // VALIDACION DE AUTENTICACION
    try {
        const messages = await db.query(
            `SELECT m.id, m.content, m.created_at, u.email 
             FROM messages m 
             JOIN users u ON m.user_id = u.id 
             ORDER BY m.created_at DESC 
             LIMIT 10` // CONSULTA LOS ÚLTIMOS 10 MENSAJES
        );
        res.json(messages.rows); // RESPONDE CON LOS MENSAJES
    } catch (err) {
        console.error(err.message); // MUESTRA ERROR EN CONSOLA
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};

// OBTENER TODOS LOS MENSAJES DE UN USUARIO ESPECÍFICO
exports.getMessagesByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // OBTIENE EL userId DE LOS PARÁMETROS DE LA RUTA
        const messages = await db.query(
            `SELECT m.id, m.content, m.created_at, u.email 
             FROM messages m 
             JOIN users u ON m.user_id = u.id 
             WHERE m.user_id = $1 
             ORDER BY m.created_at DESC`, // CONSULTA MENSAJES DEL USUARIO
            [userId]
        );
        
        if (messages.rows.length === 0) {
            // RETORNO DE ARRAY VACÍO O MENSAJE
            return res.status(404).json({ msg: 'No se encontraron mensajes para este usuario o el usuario no existe.' }); // RESPONDE SI NO HAY MENSAJES
        }

        res.json(messages.rows); // RESPONDE CON LOS MENSAJES DEL USUARIO
    } catch (err) {
        console.error(err.message); // MUESTRA ERROR EN CONSOLA
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};

// OBTENER MENSAJES DE USUARIOS SEGUIDOS
exports.getFollowedUsersMessages = async (req, res) => {
    try {
        const messages = await db.query(
            `SELECT m.id, m.content, m.created_at, u.email
             FROM messages m
             JOIN users u ON m.user_id = u.id
             WHERE m.user_id IN (SELECT following_id FROM followers WHERE follower_id = $1)
             ORDER BY m.created_at DESC`, // CONSULTA MENSAJES DE USUARIOS SEGUIDOS
            [req.user.id]
        );
        res.json(messages.rows); // RESPONDE CON LOS MENSAJES
    } catch (err) {
        console.error(err.message); // MUESTRA ERROR EN CONSOLA
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};

// BÚSQUEDA DE MENSAJES POR COINCIDENCIA DE TEXTO
exports.searchMessages = async (req, res) => {
    const { term } = req.query; // OBTIENE EL TÉRMINO DE BÚSQUEDA DEL QUERY
    if (!term) {
        return res.status(400).json({ msg: 'El término de búsqueda es requerido' }); // RESPONDE SI NO HAY TÉRMINO
    }
    try {
        const messages = await db.query(
            `SELECT m.id, m.content, m.created_at, u.email
             FROM messages m JOIN users u ON m.user_id = u.id
             WHERE m.content ILIKE $1
             ORDER BY m.created_at DESC`, // CONSULTA MENSAJES QUE COINCIDAN CON EL TÉRMINO
            [`%${term}%`]
        );
        res.json(messages.rows); // RESPONDE CON LOS MENSAJES ENCONTRADOS
    } catch (err) {
        console.error(err.message); // MUESTRA ERROR EN CONSOLA
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};