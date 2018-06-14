/**
 * Definición de rutas
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var express     = require('express');
var fileUpload  = require('express-fileupload');
var fs          = require('fs');
var logger      = require('winston');

var mdAut = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

/**
 * Uploads de imágenes
 */
app.use(fileUpload());
app.put( '/:coleccion/:id', mdAut.verificarToken, (req, res, next) => {

  var coleccion = req.params.coleccion;
  var id        = req.params.id;

  if (!req.files) {
    return res.status(400).json({ // Bad Request
      ok: false,
      mensaje: 'No se han recibido archivos',
      errors: err
    });
  }

  let archivo             = req.files.imagen;
  let arrNombreArchivo    = archivo.name.split('.');
  let extension           = arrNombreArchivo[ arrNombreArchivo.length -1 ];
  let mimetype            = archivo.mimetype; 
  let tiposValidos        = ['image/jpeg'];

  //
  // Validar archivo
  //
  if (tiposValidos.indexOf( mimetype ) < 0) {
    return res.status(400).json({ // Bad Request
      ok: false,
      mensaje: 'No se acepta el tipo de archivo',
      errors: {
        mensaje: 'Los válidos son los siguientes: ' + tiposValidos.join(', ')
      }
    });
  }

  //
  // Mover el archivo desde TMP al directorio de imágenes
  //
  let nuevoNombreArchivo  = id + '-' + new Date().getMilliseconds() + '.' + extension;
  let pathDestinoImagen   = './uploads/' + coleccion + '/' + nuevoNombreArchivo;
  let coleccionesValidas  = [ 'hospital', 'medico', 'usuario' ];

  if (coleccionesValidas.indexOf( coleccion ) < 0) {
    return res.status(400).json({ // Bad Request
      ok: false,
      mensaje: 'La colección no es válida',
      errors: {
        mensaje: 'Los válidos son los siguientes: ' + coleccionesValidas.join(', ')
      }
    });
  }

  archivo.mv( pathDestinoImagen, err => {

    if (err) {
      return res.status(500).json({ // Internal Server Error
        ok: false,
        mensaje: 'No se pudo mover el archivo al sistema',
        errors: err
      });
    }

  });

  registrarImagen( coleccion, id, nuevoNombreArchivo, res, req );

});

/**
 * Guarado de la imagen
 * @param {*} coleccion 
 * @param {*} id 
 * @param {*} nuevoNombreArchivo 
 * @param {*} res 
 */
function registrarImagen ( coleccion, id, nuevoNombreArchivo, res, req ) {

  switch (coleccion) {

    case 'hospital': 

      Hospital.findById( id, (err, hospital) => {

        // Eliminación de la imagen anterior
        if (hospital.img) {
          let archivoAnterior = './uploads/hospital/' + hospital.img;
          if (fs.existsSync( archivoAnterior )) {
            fs.unlink( archivoAnterior, (err, res) => {});
          }
        }

        // Mover nueva imagen
        hospital.img = nuevoNombreArchivo;
        hospital.save( (err, hospitalActualizado) =>  {

          res.status( 200 ).json({
            ok: true,
            mensaje: 'Imagen actualizada',
            hospital: hospitalActualizado,
            usuarioLogueado: req.usuario // Indica el usuario que realizó la operación
          });

        })

      });
    
    break;
    
    case 'medico':
    
      Medico.findById( id, (err, medico) => {

        // Eliminación de la imagen anterior
        if (medico.img) {
          let archivoAnterior = './uploads/medico/' + medico.img;
          if (fs.existsSync( archivoAnterior )) {
            fs.unlink( archivoAnterior, (err, res) => {});
          }
        }

        // Mover nueva imagen
        medico.img = nuevoNombreArchivo;
        medico.save( (err, medicoActualizado) =>  {

          res.status( 200 ).json({
            ok: true,
            mensaje: 'Imagen actualizada',
            medico: medicoActualizado,
            usuarioLogueado: req.usuario // Indica el usuario que realizó la operación
          });

        })

      });

    break;
    
    case 'usuario':
    
      Usuario.findById( id, (err, usuario) => {

        // Eliminación de la imagen anterior
        if (usuario.img) {
          let archivoAnterior = './uploads/usuario/' + usuario.img;
          if (fs.existsSync( archivoAnterior )) {
            fs.unlink( archivoAnterior, (err, res) => {});
          }
        }

        // Mover nueva imagen
        usuario.img = nuevoNombreArchivo;
        usuario.save( (err, usuarioActualizado) =>  {

          usuarioActualizado.password = 'xD';

          res.status( 200 ).json({
            ok: true,
            mensaje: 'Imagen actualizada',
            usuario: usuarioActualizado,
            usuarioLogueado: req.usuario // Indica el usuario que realizó la operación
          });

        })

      });

    break;

  }

}

module.exports = app;