import unidadeRepository from '../repository/index.mjs'
import createUnidadeService from './unidade.service.mjs'

const unidadeService = createUnidadeService(unidadeRepository)

export default unidadeService