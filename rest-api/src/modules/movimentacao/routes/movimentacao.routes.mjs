import { Router } from "express"
import movimentacaoController from '../controller/index.mjs'

const routes = Router()

routes.get('/', movimentacaoController.index)
routes.get('/relatorio/pdf', movimentacaoController.relatorioPdf)
routes.patch('/saida', movimentacaoController.registrarSaida)
routes.get('/:identificador', movimentacaoController.show)
routes.post('/', movimentacaoController.store)

export default routes