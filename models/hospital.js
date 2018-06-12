/**
 * Modelo para la tabla hospital
 * @author Gonzalo A. Arenas Flores <gonzalo.arenas.flores@gmail.com>
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
  nombre : { type: String, required: [true, 'El nombre es obligatorio'] },
  img : { type: String, required: false },
  usuario : {
    type: Schema.Types.ObjectId,
    ref: 'usuario',
    required: [true, 'El usuario es obligatorio']
  } // Cuál usuario creó el registro
}, { collection: 'hospitales' });

// Exportación
module.exports = mongoose.model('hospital', hospitalSchema);