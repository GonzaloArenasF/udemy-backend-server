/**
 * Definición de rutas de CRUD de medicos
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var express = require('express');
var logger  = require('winston');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');

var app  = express();

var mdAut = require('../middlewares/autenticacion');

var Medico = require('../models/medico');

/**
 * GET : Listar todos los hospitales
 */
app.get( '/', (req, res, next) => {

  Medico.find({})
    .populate('usuario', 'nombre email')
    .populate('hospital', 'nombre')
    .exec(
      (err, medicos) => {

      if (err) {
        logger.error('Error al rescatar médico: ', err);
        return res.status(500).json({ // Internal Server Error
          ok: false,
          mensaje: 'Error al rescatar médico',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        medicos: medicos
      });

  });

});

/**
 * POST: Insertar medico
 */
app.post( '/', mdAut.verificarToken, (req, res) => {

  var body = req.body;

  var medico = new Medico({
    nombre    : body.nombre,
    img       : body.img,
    usuario   : req.usuario._id,
    hospital  : body.hospital
  });

  medico.save( (err, medicoGuardado) => {

    if (err) {
      logger.error('Error al crear medico ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'Error al crear medico',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      medico: medicoGuardado,
      usuarioLogueado: req.usuario // Indica el usuario que realizó la operación
    });
    
  });

});

/**
 * PUT : Actualizar medico
 */
app.put( '/:id', mdAut.verificarToken, (req, res) => {

  var id    = req.params.id;
  var body  = req.body;

  Medico.findById( id, (err, medico) => {

    if (err) {
      logger.error('Error al buscar medico ', err);
      return res.status(500).json({ // Internal Server Error
        ok: false,
        mensaje: 'Error al buscar medico',
        errors: err
      });
    }

    if ( !medico ) {
      logger.error('El medico no existe ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'El medico no existe',
        errors: err
      });
    }

    medico.nombre   = body.nombre;
    medico.img      = body.img;
    medico.usuario  = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save( (err, medicoGuardado) => {

      if (err) {
        logger.error('Error al actualizar medico ', err);
        return res.status(400).json({ // Bad Request
          ok: false,
          mensaje: 'Error al actualizar medico',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado,
        usuarioLogueado: req.usuario
      });

    });

  });

});


/**
 * DELETE : Borrar medico
 */
app.delete('/:id', mdAut.verificarToken, (req, res) => {

  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

    if (err) {
      logger.error('Error al borrar medico ', err);
      return res.status(500).json({ // Internal Server Error
        ok: false,
        mensaje: 'Error al borrar medico',
        errors: err
      });
    }

    if (!medicoBorrado) {
      logger.error('No existe el medico ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'No existe el medico',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      medico: medicoBorrado,
      usuarioLogueado: req.usuario
    });

  });

});

module.exports = app;