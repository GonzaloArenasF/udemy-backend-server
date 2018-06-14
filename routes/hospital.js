/**
 * Definición de rutas de CRUD de hospitales
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var express = require('express');
var logger  = require('winston');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');

var app  = express();

var mdAut = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');

/**
 * GET : Listar todos los hospitales
 */
app.get( '/', (req, res, next) => {

  var inicio  = (req.query.inicio) ? Number(req.query.inicio) : 0;
  var cuantos = (req.query.cuantos) ? Number(req.query.cuantos) : 10;

  Hospital.find({})
    .populate('usuario', 'nombre email')
    .skip(inicio)
    .limit(cuantos)
    .exec(
      (err, hospitales) => {

      if (err) {
        logger.error('Error al rescatar hospital: ', err);
        return res.status(500).json({ // Internal Server Error
          ok: false,
          mensaje: 'Error al rescatar hospital',
          errors: err
        });
      }

      Hospital.count( {}, (err, cantidad) => {

        if (err) {
          logger.error('Error al rescatar la cantidad de médicos: ', err);
          return res.status(500).json({ // Internal Server Error
            ok: false,
            mensaje: 'Error al rescatar la cantidad de médicos',
            errors: err
          });
        }

        res.status(200).json({
          ok          : true,
          total       : cantidad,
          hospitales  : hospitales
        });

      });

  });

});

/**
 * POST: Insertar hospitales
 */
app.post( '/', mdAut.verificarToken, (req, res) => {

  var body = req.body;

  var hospital = new Hospital({
    nombre    : body.nombre,
    img       : body.img,
    usuario   : req.usuario._id
  });

  hospital.save( (err, hospitalGuardado) => {

    if (err) {
      logger.error('Error al crear hospital ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'Error al crear hospital',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
      usuarioLogueado: req.usuario // Indica el usuario que realizó la operación
    });
    
  });

});

/**
 * PUT : Actualizar hospitales
 */
app.put( '/:id', mdAut.verificarToken, (req, res) => {

  var id    = req.params.id;
  var body  = req.body;

  Hospital.findById( id, (err, hospital) => {

    if (err) {
      logger.error('Error al buscar hospital ', err);
      return res.status(500).json({ // Internal Server Error
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err
      });
    }

    if ( !hospital ) {
      logger.error('El hospital no existe ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'El hospital no existe',
        errors: err
      });
    }

    hospital.nombre   = body.nombre;
    hospital.img      = body.img;
    hospital.usuario  = req.usuario._id;

    hospital.save( (err, hospitalGuardado) => {

      if (err) {
        logger.error('Error al actualizar hospital ', err);
        return res.status(400).json({ // Bad Request
          ok: false,
          mensaje: 'Error al actualizar hospital',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado,
        usuarioLogueado: req.usuario
      });

    });

  });

});


/**
 * DELETE : Borrar hospital
 */
app.delete('/:id', mdAut.verificarToken, (req, res) => {

  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

    if (err) {
      logger.error('Error al borrar hospital ', err);
      return res.status(500).json({ // Internal Server Error
        ok: false,
        mensaje: 'Error al borrar hospital',
        errors: err
      });
    }

    if (!hospitalBorrado) {
      logger.error('No existe el hospital ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'No existe el hospital',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado,
      usuarioLogueado: req.usuario
    });

  });

});

module.exports = app;