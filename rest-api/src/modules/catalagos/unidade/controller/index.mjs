import unidadeService from '../service/index.mjs'
import createUnidadeController from './unidade.controller.mjs'

const unidadeController = createUnidadeController(unidadeService)

export default unidadeController