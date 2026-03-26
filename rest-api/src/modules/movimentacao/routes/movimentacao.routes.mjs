import { Router } from "express"
import movimentacaoController from '../controller/index.mjs'

const routes = Router()

routes.get('/', movimentacaoController.index)
routes.patch('/saida', movimentacaoController.resgistrarSaida)
routes.get('/:identificador', movimentacaoController.show)
routes.post('/', movimentacaoController.store)

export default routes