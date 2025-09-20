const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    createMessage,
    getLatestMessages, 
    getFollowedUsersMessages, 
    searchMessages,
    getMessagesByUser
} = require('../controllers/messageController');

//POST /messages
// @desc    Crear un mensaje [protegido]
router.post('/', auth, createMessage);

//GET /messages/latest
//Obtener últimos 10 mensajes
router.get('/latest', getLatestMessages);

//GET /messages/followed
//Obtener mensajes de usuarios seguidos [protegido]
router.get('/followed', auth, getFollowedUsersMessages);

//GET /messages/search
//Buscar mensajes por texto
router.get('/search', searchMessages);

//GET /messages/user/:userId 
//Mensajes específicos de un usuario
router.get('/user/:userId', getMessagesByUser);


module.exports = router;