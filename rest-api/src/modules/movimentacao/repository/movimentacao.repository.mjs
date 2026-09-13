import prisma from '../../../shared/database/prisma.mjs';
import {
  buildMovimentacaoWhere,
  buildMovimentacaoInclude,
  buildMovimentacaoListInclude,
  movimentacaoResumoSelect,
} from '../query/index.mjs';


class MovimentacaoRepository {
  async count(filters = {}) {
    return prisma.movimentacoes.count({
      where: buildMovimentacaoWhere(filters),
    });
  }

  async findAll(filters = {}) {
    return prisma.movimentacoes.findMany({
      where: buildMovimentacaoWhere(filters),
      select: movimentacaoResumoSelect,
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async findAndCountAll({ page = 1, perPage = 10, ...filters }) {
    const where = buildMovimentacaoWhere(filters)
    
    const [count, rows] = await prisma.$transaction([
      prisma.movimentacoes.count({ where }),
      prisma.movimentacoes.findMany({
        where,
        select: movimentacaoResumoSelect,
        skip: (Number(page) - 1) * Number(perPage),
        take: Number(perPage),
        orderBy: {
          updated_at: 'desc',
        },
      }),
    ]);

    return { count, rows };
  }

  async findResumoByIdentificador({ identificador, tab }) {

    return prisma.movimentacoes.findFirst({
      where: buildMovimentacaoWhere({
        identificador,
        tab,
        emAberto: true,
      }),
      include: buildMovimentacaoInclude({
        only: ['entradaUser', 'destino', 'veiculo'],
      }),
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async findByPk(id) {
    return prisma.movimentacoes.findUnique({
      where: { id: BigInt(id) },
      include: buildMovimentacaoInclude(),
    });
  }

  async updateById(id, payload) {
    return prisma.movimentacoes.update({
      where: { id: BigInt(id) },
      data: payload,
      include: buildMovimentacaoInclude(),
    });
  }

  async create(payload) {
    return prisma.movimentacoes.create({
      data: payload,
      include: buildMovimentacaoInclude(),
    });
  }
}

export default MovimentacaoRepository;