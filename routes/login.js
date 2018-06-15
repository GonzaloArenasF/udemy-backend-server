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

// Google
var GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client         = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Autenticación básica
 */
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
    let token = jwt.sign({ usuario: usuarioBD }, SEED , { expiresIn: '1h' });

    res.status(200).json({
      ok: true,
      usuario: usuarioBD,
      token: token
    });

  });

});

/**
 * Login con Google Sign In
 */

async function googleVerify(token) { // Promesa en ES6

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  return payload;

}

app.post( '/googlesignin', async (req, res) => {

  let token = req.body.token;

  let googleUser = await googleVerify( token )
    .catch (e => {
      return res.status(403).json({ // Forbidden
        ok      : false,
        mensaje : 'Token inválido'
      });
    });

  Usuario.findOne( {email: googleUser.email}, (err, usuarioBD) => {

    if (err) {
      return res.status(500).json({ // Internal Server Error
        ok      : false,
        mensaje : 'No se encontró un usuario asociado'
      });
    }

    if ( usuarioBD ) {

      if ( usuarioBD.googleSignIn === false ) {

        return res.status(400).json({ // Bad Request
          ok      : false,
          mensaje : 'Debe usar la autenticación básica'
        });
  
      } else {

        let token = jwt.sign({ usuario: usuarioBD }, SEED , { expiresIn: '1h' });
  
        res.status(200).json({
          ok: true,
          usuario: usuarioBD,
          token: token
        });
  
      }

    } else { // Usuario no existe 

      let usuario = new Usuario();

      usuario.nombre        = googleUser.name;
      usuario.email         = googleUser.email;
      usuario.img           = googleUser.picture;
      usuario.googleSignIn  = true;
      usuario.password      = 'xD';

      usuario.save( (err, usuarioRegistrado) => {

        if (err) {
          return res.status(500).json({ // Internal Server Error
            ok      : false,
            mensaje : 'No se pudo registrar el usuario',
            err     :err
          });
        }

        let token = jwt.sign({ usuario: usuarioRegistrado }, SEED , { expiresIn: '1h' });

        res.status(200).json({
          ok: true,
          usuario: usuarioRegistrado,
          token: token,
          mensaje: 'El usuario no estaba registrado por lo que se incorporó a la BD'
        });

      });

    }

  });

});

module.exports = app;