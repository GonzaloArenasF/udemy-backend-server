
// Requires
var express = require('express');
var logger = require('winston');
var mongoose = require('mongoose');

// Inicializar variables
var puertoExpress = 3000; //Puede ser cualquier puerto disponible 
var puertoMongoDB = 27017; //Puede ser cualquier puerto disponible 
var app = express();

// Conexión a MongoDB
mongoose.connection.openUri('mongodb://localhost:' + puertoMongoDB + '/hospitalDB', ( err, res ) => {
  if (err) {
    logger.info('MongoDB con problemas: ', err);
    throw err
  } else {
    logger.info('MongoDB corriendo en puerto ' + puertoExpress + ': online');
  }
});

// Rutas
app.get( '/', (req, res, next) => {

  res.status( 400 ).json({
    ok: true,
    mensaje: 'Petición OK'
  });

});

// Escuchar peticiones
app.listen( puertoExpress, () => {
  logger.info('Express Server corriendo en puerto ' + puertoExpress + ': online');
});