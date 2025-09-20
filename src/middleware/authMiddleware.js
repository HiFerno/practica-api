const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; //Bearer TOKEN

  //token vacio
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, permiso no válido' });
  }

  //VERIFICACION DE TOKEN
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no es válido' });
  }
};