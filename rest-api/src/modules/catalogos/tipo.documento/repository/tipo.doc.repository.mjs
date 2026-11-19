import prisma from "../../../../shared/database/prisma.mjs"
class TipoDocRepository {
  async findAll() {
    return await prisma.tipo_documentos.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }
}

export default TipoDocRepository