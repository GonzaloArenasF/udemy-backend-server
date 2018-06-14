/**
 * Definición de rutas
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var express = require('express');
var path    = require('path');
var fs      = require('fs');

var app = express();

app.get( '/:tipo/:img', (req, res, next) => {

  let tipo  = req.params.tipo;
  let img   = req.params.img;

  let pathOrigenImagen    = '../uploads/' + tipo + '/' + img;
  let pathOrigenNoImagen  = '../uploads/no-image.png';
  let pathImagen          = path.resolve( __dirname,  pathOrigenImagen);
  let pathNoImagen        = path.resolve( __dirname,  pathOrigenNoImagen);

  if ( fs.existsSync( pathImagen ) ) {
    res.sendFile( pathImagen );
  } else {
    res.sendFile( pathNoImagen );
  }

});

module.exports = app;