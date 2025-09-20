const jwt = require('jsonwebtoken'); // IMPORTA LA LIBRERIA JSONWEBTOKEN

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // OBTIENE EL TOKEN DEL HEADER AUTHORIZATION (BEARER TOKEN)

  // TOKEN VACÍO
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, permiso no válido' }); // RESPONDE SI NO HAY TOKEN
  }

  // VERIFICACION DE TOKEN
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // VERIFICA Y DECODIFICA EL TOKEN
    req.user = decoded.user; // ASIGNA EL USUARIO DECODIFICADO AL REQUEST
    next(); // CONTINÚA AL SIGUIENTE MIDDLEWARE
  } catch (err) {
    res.status(401).json({ msg: 'Token no es válido' }); // RESPONDE SI EL TOKEN NO ES VÁLIDO
  }
};