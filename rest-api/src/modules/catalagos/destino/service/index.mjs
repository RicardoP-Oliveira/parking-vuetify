import destinoRepository from '../repository/index.mjs'
import createDestinoService from './destino.service.mjs'

const destinoService = createDestinoService(destinoRepository)

export default destinoService
