const { Pool } = require('pg'); // CONEXION DE NODE A POSTGRES
require('dotenv').config(); // CARGA VARIABLES DE ENTORNO DESDE .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL DE CONEXION A LA BASE DE DATOS DESDE VARIABLES DE ENTORNO
});

module.exports = {
  query: (text, params) => pool.query(text, params), // FUNCION PARA REALIZAR CONSULTAS A LA BASE DE DATOS
};