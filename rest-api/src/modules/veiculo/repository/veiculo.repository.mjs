import prisma from '../../../shared/database/prisma.mjs'

const includeBase = {
  usuarios: {
    include: {
      unidades: true,
      tipo_documentos: true,
      tratamentos: true,
      orgaos: true,
    },
  },
  orgaos: true,
}

class VeiculoRepository {
  async count() {
    return prisma.veiculos.count()
  }

  async findAndCountAll({ page, perPage }) {
    const skip = (page - 1) * perPage
    const [count, rows] = await Promise.all([
      prisma.veiculos.count(),
      prisma.veiculos.findMany({
        orderBy: {
          id: 'asc',
        }, 
        skip,
        take: perPage,
        include: {
          usuarios: {
            include: {
              unidades: {
                select: {
                  sigla: true,
                },
              },
              tipo_documentos: true,
            },
          },
          orgaos: true,
        },
      }),
    ])
      
    return { 
      count,
      rows
    }
  }

  async findByPlaca(placa) {
    return prisma.veiculos.findUnique({
      where: {
        placa,
      },
      include: includeBase,
    })
  }

  async findResumoByIdentificador(identificador) {
    const veiculo = await prisma.veiculos.findFirst({
      where: {
        OR: [
          { placa: { 
              equals: identificador,
              mode: 'insensitive', 
            } 
          },
          { marca: { 
              contains: identificador,
              mode: 'insensitive'
            }
          },
          { prefixo: { 
              contains: identificador,
              mode: 'insensitive'
            }
          },
        ]
      },
      include: includeBase,
    })

    return veiculo
  }

  async findByPk(id) {
    return prisma.veiculos.findUnique({
      where: {
        id: BigInt(id),
      },
      include: includeBase,
    })
  }

  async create(payload) {
    return prisma.veiculos.create({
      data: payload,
    })
  }

  async updateById(id, payload) {
    return prisma.veiculos.update({
      where: {
        id: BigInt(id),
      },
      data: payload,
      include: includeBase,
    })
  }

  async destroy(id) {
    return prisma.veiculos.delete({
      where: {
        id: BigInt(id),
      },
    })
  }
}

export default VeiculoRepository