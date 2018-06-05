/**
 * INIT
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

// Requires
var express    = require('express');
var logger     = require('winston');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var puertoExpress = 3000; //Puede ser cualquier puerto disponible 
var puertoMongoDB = 27017; //Puede ser cualquier puerto disponible 
var app           = express();

// Conexión a MongoDB
mongoose.connection.openUri('mongodb://localhost:' + puertoMongoDB + '/hospitalDB', ( err, res ) => {
  if (err) {
    logger.info('MongoDB con problemas: ', err);
    throw err
  } else {
    logger.info('MongoDB corriendo en puerto ' + puertoExpress + ': online');
  }
});

//
// Body Parser
//
app.use(bodyParser.urlencoded({ extended: false }));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                           // parse application/json

// Rutas
var appRoutes = require('./routes/app');
app.use('/', appRoutes);
var usuarioRoutes = require('./routes/usuario');
app.use('/usuario', usuarioRoutes);

// Escuchar peticiones
app.listen( puertoExpress, () => {
  logger.info('Express Server corriendo en puerto ' + puertoExpress + ': online');
});