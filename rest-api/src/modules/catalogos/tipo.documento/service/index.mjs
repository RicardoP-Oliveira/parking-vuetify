import tipoDocRepository from "../repository/index.mjs"
import createTipoDocService from "./tipo.doc.service.mjs"

const tipoDocService = createTipoDocService(tipoDocRepository)

export default tipoDocService