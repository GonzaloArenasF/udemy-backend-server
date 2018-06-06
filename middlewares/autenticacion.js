/**
 * Definición de rutas de usuarios
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var logger  = require('winston');
var jwt     = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

/**
 * Verificar token
 */
exports.verificarToken = (req, res, next) => {

  var token = req.query.token;

  jwt.verify( token, SEED, (err, decoded) => {

    if (err) {
      logger.error('Error al comprobar el token: ', err);
      return res.status(401).json({ // Unauthorized
        ok: false,
        mensaje: 'Error al comprobar el token',
        errors: err
      });
    }

    req.usuario = decoded.usuario;

    next();

  });

}