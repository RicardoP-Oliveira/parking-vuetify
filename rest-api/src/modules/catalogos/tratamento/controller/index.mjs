import tratamentoService from "../service/index.mjs"
import createTratamentoController from "./tratamento.controller.mjs"

const tratamentoController = createTratamentoController(tratamentoService)

export default tratamentoController