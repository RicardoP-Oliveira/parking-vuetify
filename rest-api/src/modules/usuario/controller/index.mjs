import usuarioService from '../service/index.mjs'
import createUsuarioController from './usuario.controller.mjs'

const usuarioController = createUsuarioController(usuarioService)

export default usuarioController