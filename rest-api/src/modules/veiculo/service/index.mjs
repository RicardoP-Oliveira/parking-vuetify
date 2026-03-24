import veiculoRepository from '../repository/index.mjs'
import createVeiculoService from './veiculo.service.mjs'

const veiculoService = createVeiculoService(veiculoRepository)

export default veiculoService