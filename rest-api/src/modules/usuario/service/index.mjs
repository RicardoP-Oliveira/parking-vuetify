import usuarioRepository from '../repository/index.mjs'
import createUsuarioService from './usuario.service.mjs'

const usuarioService = createUsuarioService(usuarioRepository)

export default usuarioService