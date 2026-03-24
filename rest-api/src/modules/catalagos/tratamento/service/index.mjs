import tratamentoRepository from "../repository/index.mjs"
import createTratamentoService from "./tratamento.service.mjs"

const tratamentoService = createTratamentoService(tratamentoRepository)

export default tratamentoService