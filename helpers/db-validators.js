
import Role from '../models/role.js';
import Usuario from '../models/usuario.js'

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol});
    if (!existeRol) {
      throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
  }

  //Verificar si el correo existe
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo: correo});
    if (existeEmail) {
      throw new Error(`El correo: ${ correo}, ya está registrado`);
      };
}

const existeUsuarioPorId = async(id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id: ${id}, no existe`)
  }

}

export {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId
}