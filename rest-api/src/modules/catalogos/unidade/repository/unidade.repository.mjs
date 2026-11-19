import { buildNomeCompleto } from '../../../../shared/utils/mapperUtils.mjs'
import prisma from "../../../../shared/database/prisma.mjs"
class UnidadeRepository {
  async findAll() {
    return await prisma.unidades.findMany({
      orderBy: {
        id: 'asc'
      }
    })
  }

  async findByUnidade(unidade) {
    const unit = await prisma.unidades.findFirst({
      where: {
        sigla: {
          contains: unidade,
          mode: 'insensitive',
        }
      },
      include: {
        usuarios: {
          include: {
            tratamentos: true,
            orgaos: true,
            veiculos: true,
          }
        }
      }
    })

    return { 
      unidade: unit.sigla,
      usuarios: unit.usuarios.map(usuario => ({
        nome: buildNomeCompleto(
          usuario.tratamentos?.sigla,
          usuario.orgaos?.sigla_curta,
          usuario.nome
        ),
        rg: usuario.documento,
        veículo: usuario.veiculos
      }))
    }
  }
}

export default UnidadeRepository