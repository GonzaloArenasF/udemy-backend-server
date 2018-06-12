/**
 * Modelo para la tabla medico
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
  nombre : { type: String, required: [true, 'El nombre es obligatorio'] },
  img : { type: String, required: false },
  usuario : { // Cuál usuario creó el registro
    type: Schema.Types.ObjectId,
    ref: 'usuario',
    required: [true, 'El usuario es obligatorio']
  },
  hospital : { // Hopsital asignado
    type: Schema.Types.ObjectId,
    ref: 'hospital',
    required: [true, 'El hospital es obligatorio']
  }
}, { collection: 'medicos' });

// Exportación
module.exports = mongoose.model('medico', medicoSchema);