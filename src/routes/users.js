const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getUserInfo, followUser, unfollowUser, deleteUser } = require('../controllers/userController');

//GET /users/:id
//Información de un usuario
router.get('/:id', auth, getUserInfo);

//POST /users/:id/follow
//Seguir a un usuario
router.post('/:id/follow', auth, followUser);

//DELETE /users/:id/follow
//Dejar de seguir a un usuario
router.delete('/:id/follow', auth, unfollowUser);

//DELETE /users/:id
//Borrar un usuario
router.delete('/:id', auth, deleteUser);

module.exports = router;