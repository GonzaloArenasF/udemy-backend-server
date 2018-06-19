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

// Control CORS
// Esto es temporal. Debemos usar https://github.com/expressjs/cors :TODO
app.use( function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow.Methos", "PSOT, GET, PUT, DELETE, OPTIONS");
  next();
});

//
// Body Parser
//
app.use(bodyParser.urlencoded({ extended: false }));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                           // parse application/json

// Rutas
app.use('/busqueda', require('./routes/busqueda'));
app.use('/download', require('./routes/download'));
app.use('/hospital', require('./routes/hospital'));
app.use('/login', require('./routes/login'));
app.use('/medico', require('./routes/medico'));
app.use('/uploads', require('./routes/uploads'));
app.use('/usuario', require('./routes/usuario'));
app.use('/', require('./routes/app'));

// Escuchar peticiones
app.listen( puertoExpress, () => {
  logger.info('Express Server corriendo en puerto ' + puertoExpress + ': online');
});

// Conexión a MongoDB
mongoose.connection.openUri('mongodb://localhost:' + puertoMongoDB + '/hospitalDB', ( err, res ) => {
  if (err) {
    logger.info('MongoDB con problemas: ', err);
    throw err
  } else {
    logger.info('MongoDB corriendo en puerto ' + puertoMongoDB + ': online');
  }
});