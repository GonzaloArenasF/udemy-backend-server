/**
 * Modelo para la tabla usuario
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var mongoose        = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// Validaciones
var rolesValidos = {
  values: [ 'ADMIN', 'USER' ],
  message: '{VALUE} no es un role válido'
};

var usuarioSchema = new Schema({
  nombre : { type: String, required: [true, 'El nombre es obligatorio'] },
  email : { type: String, unique: true, required: [true, 'El email es obligatorio'] },
  password : { type: String, required: [true, 'La password es obligatorio'] },
  img : { type: String },
  role : { type: String, required: true, default: 'USER', enum: rolesValidos }
});

// Mensajes para validar unicidad
usuarioSchema.plugin( uniqueValidator, {
  message: '{PATH} debe ser único'
} );

// Exportación
module.exports = mongoose.model('usuario', usuarioSchema);