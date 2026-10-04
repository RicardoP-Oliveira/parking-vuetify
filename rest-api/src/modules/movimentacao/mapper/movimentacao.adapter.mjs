import { buildNomeCompleto } from '../../../shared/utils/mapperUtils.mjs'

export const adaptMovimentacao = movimentacao => {
  if (!movimentacao) return null

  return {
    ...movimentacao,

    entradaUser:
      movimentacao.entradaUser
        ? {
          ...movimentacao.entradaUser,
          orgao: movimentacao.entradaUser.orgaos,
          tratamento: movimentacao.entradaUser.tratamentos,

          nomeCompleto: buildNomeCompleto(
            movimentacao.entradaUser.tratamentos?.sigla,
            movimentacao.entradaUser.orgaos?.sigla_curta,
            movimentacao.entradaUser.nome,
          ),
        }
        : null,

    saidaUser:
      movimentacao.saidaUser
        ? {
          ...movimentacao.saidaUser,
          orgao: movimentacao.saidaUser.orgaos,
          tratamento: movimentacao.saidaUser.tratamentos,

          nomeCompleto: buildNomeCompleto(
            movimentacao.saidaUser.tratamentos?.sigla,
            movimentacao.saidaUser.orgaos?.sigla_curta,
            movimentacao.saidaUser.nome,
          ),
        }
        : null,
  }
}