import veiculoService from '../service/index.mjs'
import createVeiculoController from './veiculo.controller.mjs'

const veiculoController = createVeiculoController(veiculoService)

export default veiculoController