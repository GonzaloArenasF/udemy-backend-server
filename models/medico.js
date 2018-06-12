/**
 * Modelo para la tabla medico
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
  nombre : { type: String, required: [true, 'El nombre es obligatorio'] },
  img : { type: String, required: false },
  usuario : { type: Schema.Types.ObjectId, ref: 'Usuario' }, // Cuál usuario creó el registro
  hospital : { type: Schema.Types.ObjectId, ref: 'Hospital' } // Hopsital asignado
}, { collection: 'medicos' });

// Exportación
module.exports = mongoose.model('medico', medicoSchema);