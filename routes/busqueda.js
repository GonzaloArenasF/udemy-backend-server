/**
 * Definición de rutas de búsqueda
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var express = require('express');

var app = express();

var Hospital  = require('../models/hospital');
var Medico    = require('../models/medico');
var Usuario   = require('../models/usuario');

/**
 * Busca en todas las colecciones
 */
app.get( '/:busqueda', (req, res, next) => { 

  var regex = new RegExp(req.params.busqueda, 'i');

  Promise.all( [
    buscarHospitales(regex),
    buscarMedicos(regex),
    buscarUsuarios(regex),
  ]).then( respuestas => {

    res.status( 200 ).json({
      ok          : true,
      hospitales  : respuestas[0],
      medicos     : respuestas[1],
      usuarios    : respuestas[2]
    });

  });

});

/**
 * Busca en una colección determinada
 */
app.get ( '/:coleccion/:busqueda', (req, res, next) => {

  var coleccion = req.params.coleccion;
  var regex     = new RegExp(req.params.busqueda, 'i');
  var promesa   = null;

  switch (coleccion) {
    
    case 'hospital':
      promesa = buscarHospitales(regex);
    break;

    case 'medico':
      promesa = buscarMedicos(regex);
    break;

    case 'usuario':
      promesa = buscarUsuarios(regex);
    break;

    default:

      return res.status(400).json({ // Bad Request
        ok      : false,
        mensaje : 'No existe la colección ' + coleccion
      });

    break;

  }

  // Obtención de resultados
  promesa.then( resultado => {
    res.status( 200 ).json({
      ok          : true,
      [coleccion] : resultado
    });
  });

});

/**
 * Búsqueda en hospitales
 * @param {*} regex 
 */
function buscarHospitales (regex) {

  return new Promise ( (resolve, reject) => {

    Hospital.find( { nombre: regex })
      .populate('usuario', 'nombre email')
      .exec( (err, hospitales) => {
    
      if (err) { reject('Error al buscar en hospitales', err); }
      else { resolve(hospitales) }

    });

  });

}

/**
 * Búsqueda en médicos
 * @param {*} regex 
 */
function buscarMedicos (regex) {

  return new Promise ( (resolve, reject) => {

    Medico.find( { nombre: regex })
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec( (err, medicos) => {
    
      if (err) { reject('Error al buscar en médicos', err); }
      else { resolve(medicos) }

    });

  });

}

/**
 * Búsqueda en usuarios
 * @param {*} regex 
 */
function buscarUsuarios (regex) {

  return new Promise ( (resolve, reject) => {

    Usuario.find( {}, 'nombre email role' )
      .or ([
        { 'nombre': regex },
        { 'email': regex }
      ])
      .exec( (err, usuarios) => {

        if (err) { reject('Error al buscar en usuarios', err); }
        else { resolve(usuarios) }

      });

  });

}

module.exports = app;