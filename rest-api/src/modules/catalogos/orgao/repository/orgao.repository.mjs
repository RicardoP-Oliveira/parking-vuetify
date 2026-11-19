import prisma from "../../../../shared/database/prisma.mjs"

class OrgaoRepository {
  async findAll() {
    return prisma.orgaos.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }
}

export default OrgaoRepository