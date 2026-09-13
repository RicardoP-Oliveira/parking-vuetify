import prisma from "../../../../shared/database/prisma.mjs"

class TratamentoRepository {
  async findAll() {
    return prisma.tratamentos.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }
}

export default TratamentoRepository