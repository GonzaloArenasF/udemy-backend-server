/**
 * Definición de rutas
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var express = require('express');

var app = express();

app.get( '/', (req, res, next) => {

  res.status( 400 ).json({
    ok: true,
    mensaje: 'Petición OK'
  });

});

module.exports = app;