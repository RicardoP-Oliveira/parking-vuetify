import tipoDocService from '../service/index.mjs'
import createTipoDocController from './tipo.doc.controller.mjs'

const tipoDocController = createTipoDocController(tipoDocService)

export default tipoDocController