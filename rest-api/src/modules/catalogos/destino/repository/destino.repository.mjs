import prisma from '../../../../shared/database/prisma.mjs'

class DestinoRepository {
  async findAll() {
    const destinos = await prisma.destinos.findMany({
      where: { 
        ativo: 
        true
      },
      include: {
        unidades: {
          select: {
            sigla: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    })

    return destinos.map(destino => ({
      ...destino,
      unidade: destino.unidades.sigla
    }))
  }
}
export default DestinoRepository