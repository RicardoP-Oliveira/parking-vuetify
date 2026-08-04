import createMovimentacaoService from "./movimentacao.service.mjs"
import movimentacaoRepository from "../repository/index.mjs"

const movimentacaoService = createMovimentacaoService(movimentacaoRepository)

export default movimentacaoService