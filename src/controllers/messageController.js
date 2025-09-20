const db = require('../config/db');

// Crear un mensaje
exports.createMessage = async (req, res) => {
    const { content } = req.body;
    //VALIDACION DEL CONTENIDO
    try {
        const newMessage = await db.query(
            "INSERT INTO messages (user_id, content) VALUES ($1, $2) RETURNING *",
            [req.user.id, content]
        );
        res.status(201).json(newMessage.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};

// Obtener los últimos 10 mensajes
exports.getLatestMessages = async (req, res) => {
    //VALIDACION DE AUTENTICACION
    try {
        const messages = await db.query(
            `SELECT m.id, m.content, m.created_at, u.email 
             FROM messages m 
             JOIN users u ON m.user_id = u.id 
             ORDER BY m.created_at DESC 
             LIMIT 10`
        );
        res.json(messages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};


// Obtener todos los mensajes de un usuario específico
exports.getMessagesByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Obtener userId de los parámetros de la ruta
        const messages = await db.query(
            `SELECT m.id, m.content, m.created_at, u.email 
             FROM messages m 
             JOIN users u ON m.user_id = u.id 
             WHERE m.user_id = $1 
             ORDER BY m.created_at DESC`,
            [userId]
        );
        
        if (messages.rows.length === 0) {
            //RETORNO DE ARRAY VACIO O MENSAJE
            return res.status(404).json({ msg: 'No se encontraron mensajes para este usuario o el usuario no existe.' });
        }

        res.json(messages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};


// Obtener mensajes de usuarios seguidos
exports.getFollowedUsersMessages = async (req, res) => {
    try {
        const messages = await db.query(
            `SELECT m.id, m.content, m.created_at, u.email
             FROM messages m
             JOIN users u ON m.user_id = u.id
             WHERE m.user_id IN (SELECT following_id FROM followers WHERE follower_id = $1)
             ORDER BY m.created_at DESC`,
            [req.user.id]
        );
        res.json(messages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};

// Búsqueda de mensajes por coincidencia de texto
exports.searchMessages = async (req, res) => {
    const { term } = req.query;
    if (!term) {
        return res.status(400).json({ msg: 'El término de búsqueda es requerido' });
    }
    try {
        const messages = await db.query(
            `SELECT m.id, m.content, m.created_at, u.email
             FROM messages m JOIN users u ON m.user_id = u.id
             WHERE m.content ILIKE $1
             ORDER BY m.created_at DESC`,
            [`%${term}%`]
        );
        res.json(messages.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};