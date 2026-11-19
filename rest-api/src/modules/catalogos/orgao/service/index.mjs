import orgaoRepository from '../repository/index.mjs'
import createOrgaoService from './orgao.service.mjs'

const orgaoService = createOrgaoService(orgaoRepository)

export default orgaoService