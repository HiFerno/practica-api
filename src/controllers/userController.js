const db = require('../config/db');

// Información de usuario 
exports.getUserInfo = async (req, res) => {
    try {
        const user = await db.query("SELECT id, email, created_at FROM users WHERE id = $1", [req.params.id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
};

// Seguir a un usuario
exports.followUser = async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.id;
    try {
        if (followerId == followingId) return res.status(400).json({ msg: 'No puedes seguirte a ti mismo' });
        await db.query("INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)", [followerId, followingId]);
        res.json({ msg: 'Usuario seguido correctamente' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
};

// Dejar de seguir a un usuario
exports.unfollowUser = async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.id;
    try {
        await db.query("DELETE FROM followers WHERE follower_id = $1 AND following_id = $2", [followerId, followingId]);
        res.json({ msg: 'Dejaste de seguir al usuario' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
};

// Borrar usuario
exports.deleteUser = async (req, res) => {
    //VERIFICACION QUE EL USUARIO SOLO PUEDE BORRARSE A SI MISMO
    if (req.user.id != req.params.id) {
        return res.status(403).json({ msg: 'Acción no autorizada' });
    }
    try {
        await db.query("DELETE FROM users WHERE id = $1", [req.user.id]);
        res.json({ msg: 'Usuario eliminado permanentemente' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
};