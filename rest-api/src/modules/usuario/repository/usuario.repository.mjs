import prisma from "../../../shared/database/prisma.mjs"

const usuarioInclude = {
    unidades: true,
    orgaos: true,
    tipo_documentos: true,
    tratamentos: true,
    veiculos: true,
}

class UsuarioRepository {

  async count() {
    return prisma.usuarios.count()
  }

  async findAndCountAll({ page, perPage }) {
    const skip = (page - 1) * perPage
    const [count, rows] = await Promise.all([
      prisma.usuarios.count(),
      prisma.usuarios.findMany({
        orderBy: {
          id: 'asc'
        },
        skip,
        take: perPage,
        include: usuarioInclude
      })
    ])
    return { count, rows }
  }

  async findResumoByDocumento(documento) {
    const user = await prisma.usuarios.findUnique({
      where: { 
        documento
      },
      include: usuarioInclude
    })

    if (!user) {
      return null
    }
    
    return {
      user_id: user.id,
      doc: user.documento,
      nome: user.nome,

      tratamento_id: user.tratamento_id,
      unidade_id: user.unidade_id,
      orgao_id: user.orgao_id,
      tipo_doc_id: user.tipo_doc_id,

      graduaAbrev: user.tratamentos?.sigla,
      orgaoSigla: user.orgaos?.sigla_curta,
      siglaUbm: user.unidades?.sigla,
      tipo_doc: user.tipo_documentos?.tipo
    }
  }

  async findByDocumento(documento) {
   return prisma.usuarios.findUnique({
      where: { 
        documento
      },
      include: usuarioInclude
    })
  }

  async findByPk(id) {
    return prisma.usuarios.findUnique({
      where: { 
        id: BigInt(id) },
      include: usuarioInclude
    })
  }

  async create(payload) {
    return prisma.usuarios.create({
      data: payload,
      include: usuarioInclude
    })
  }

  async updateById(id, payload) {
    await prisma.usuarios.update({
      where: { 
        id: BigInt(id)
      },
      data: payload
    })

    return this.findByPk(id)
  }

  async destroy(user) {
    return prisma.usuarios.delete({
      where: { 
        id: BigInt(user.id)
      }
    })
  }
}
export default  UsuarioRepository