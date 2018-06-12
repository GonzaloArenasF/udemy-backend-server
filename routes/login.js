/**
 * Definición de rutas de login
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var express = require('express');
var logger  = require('winston');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');

var app  = express();
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

  let body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

    if (err) {
      logger.error('Error al buscar usuarios: ', err);
      return res.status(500).json({ // Internal Server Error
        ok: false,
        mensaje: 'Error al buscar usuarios',
        errors: err
      });
    }

    if (!usuarioBD || !bcrypt.compareSync(body.password, usuarioBD.password)) {
      logger.error('Credenciales incorrectas: ', err);
      return res.status(400).json({ // Bad request
        ok: false,
        mensaje: 'Credenciales incorrectas',
        errors: err
      });
    }

    usuarioBD.password = 'xD'; // Omitimos el despliegue de la passsword

    // Token
    let token = jwt.sign({
      usuario: usuarioBD
      }, SEED , { expiresIn: '1h' }
    );

    res.status(200).json({
      ok: true,
      usuario: usuarioBD,
      token: token
    });

  });

});

module.exports = app;