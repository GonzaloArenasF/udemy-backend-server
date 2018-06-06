/**
 * Definición de rutas de usuarios
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var express = require('express');
var logger  = require('winston');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');

var app  = express();

var mdAut = require('../middlewares/autenticacion');

var Usuario = require('../models/usuario');

/**
 * GET : Listar todos los usuarios
 */
app.get( '/', (req, res, next) => {

  Usuario.find({}, 'nombre email img role')
    .exec(
      (err, usuarios) => {

      if (err) {
        logger.error('Error al rescatar usuarios: ', err);
        return res.status(500).json({ // Internal Server Error
          ok: false,
          mensaje: 'Error al rescatar usuarios',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        usuarios: usuarios
      });

  });

});

/**
 * POST: Insertar usuarios
 */
app.post( '/', mdAut.verificarToken, (req, res) => {

  var body = req.body;

  var usuario = new Usuario({
    nombre    : body.nombre,
    email     : body.email,
    password  : bcrypt.hashSync(body.password, 10),
    img       : body.img,
    role      : body.role,
  });

  usuario.save( (err, usuarioGuardado) => {

    if (err) {
      logger.error('Error al crear usuarios ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuarioLogueado: req.usuario
    });
    
  });

});

/**
 * PUT : Actualizar usuarios
 */
app.put( '/:id', mdAut.verificarToken, (req, res) => {

  var id    = req.params.id;
  var body  = req.body;

  Usuario.findById( id, (err, usuario) => {

    if (err) {
      logger.error('Error al buscar usuario ', err);
      return res.status(500).json({ // Internal Server Error
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if ( !usuario ) {
      logger.error('El usuario no existe ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'El usuario no existe',
        errors: err
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save( (err, usuarioGuardado) => {

      if (err) {
        logger.error('Error al actualizar usuario ', err);
        return res.status(400).json({ // Bad Request
          ok: false,
          mensaje: 'Error al actualizar usuario',
          errors: err
        });
      }

      usuario.password = 'xD';

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado,
        usuarioLogueado: req.usuario
      });

    });

  });

});


/**
 * DELETE : Borrar usuarios
 */
app.delete('/:id', mdAut.verificarToken, (req, res) => {

  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    if (err) {
      logger.error('Error al borrar usuario ', err);
      return res.status(500).json({ // Internal Server Error
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }

    if (!usuarioBorrado) {
      logger.error('No existe el usuario ', err);
      return res.status(400).json({ // Bad Request
        ok: false,
        mensaje: 'No existe el usuario',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado,
      usuarioLogueado: req.usuario
    });

  });

});

module.exports = app;