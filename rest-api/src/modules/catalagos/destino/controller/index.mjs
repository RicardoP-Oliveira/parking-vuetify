import destinoService from '../service/index.mjs'
import createDestinoController from './destino.controller.mjs'

const destinoController = createDestinoController(destinoService)

export default destinoController