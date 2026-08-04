import createMovimentacaoController from "./movimentacao.controller.mjs"
import movimentacaoService from '../service/index.mjs'

const movimentacaoController = createMovimentacaoController(movimentacaoService)

export default movimentacaoController