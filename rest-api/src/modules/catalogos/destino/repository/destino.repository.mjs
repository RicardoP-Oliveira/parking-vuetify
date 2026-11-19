import prisma from '../../../../shared/database/prisma.mjs'

class DestinoRepository {
  async findAll() {
    return prisma.destinos.findMany({
      orderBy: { id: 'asc' }
    })
  }
}
export default DestinoRepository