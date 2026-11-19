import orgaoService from '../service/index.mjs'
import createOrgaoController from './orgao.controller.mjs'

const orgaoController = createOrgaoController(orgaoService)

export default orgaoController