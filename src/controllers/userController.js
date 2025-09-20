const db = require('../config/db'); // IMPORTA LA CONFIGURACION DE LA BASE DE DATOS

// INFORMACIÓN DE USUARIO 
exports.getUserInfo = async (req, res) => {
    try {
        const user = await db.query("SELECT id, email, created_at FROM users WHERE id = $1", [req.params.id]); // CONSULTA USUARIO POR ID
        if (user.rows.length === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' }); // RESPONDE SI NO ENCUENTRA USUARIO
        }
        res.json(user.rows[0]); // RESPONDE CON LA INFORMACIÓN DEL USUARIO
    } catch (err) {
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};

// SEGUIR A UN USUARIO
exports.followUser = async (req, res) => {
    const followerId = req.user.id; // OBTIENE ID DEL USUARIO QUE SIGUE
    const followingId = req.params.id; // OBTIENE ID DEL USUARIO A SEGUIR
    try {
        if (followerId == followingId) return res.status(400).json({ msg: 'No puedes seguirte a ti mismo' }); // VALIDA QUE NO SE SIGA A SÍ MISMO
        await db.query("INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)", [followerId, followingId]); // INSERTA RELACIÓN DE SEGUIMIENTO
        res.json({ msg: 'Usuario seguido correctamente' }); // RESPONDE ÉXITO
    } catch (err) {
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};

// DEJAR DE SEGUIR A UN USUARIO
exports.unfollowUser = async (req, res) => {
    const followerId = req.user.id; // OBTIENE ID DEL USUARIO QUE DEJA DE SEGUIR
    const followingId = req.params.id; // OBTIENE ID DEL USUARIO A DEJAR DE SEGUIR
    try {
        await db.query("DELETE FROM followers WHERE follower_id = $1 AND following_id = $2", [followerId, followingId]); // ELIMINA RELACIÓN DE SEGUIMIENTO
        res.json({ msg: 'Dejaste de seguir al usuario' }); // RESPONDE ÉXITO
    } catch (err) {
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};

// BORRAR USUARIO
exports.deleteUser = async (req, res) => {
    // VERIFICACION QUE EL USUARIO SOLO PUEDE BORRARSE A SI MISMO
    if (req.user.id != req.params.id) {
        return res.status(403).json({ msg: 'Acción no autorizada' }); // RESPONDE SI NO ESTÁ AUTORIZADO
    }
    try {
        await db.query("DELETE FROM users WHERE id = $1", [req.user.id]); // ELIMINA USUARIO DE LA BASE DE DATOS
        res.json({ msg: 'Usuario eliminado permanentemente' }); // RESPONDE ÉXITO
    } catch (err) {
        res.status(500).send('Error en el servidor'); // RESPONDE ERROR DE SERVIDOR
    }
};