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
        tipo_documento: movimentacao.entradaUser.tipo_documentos,

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
        tipo_documento: movimentacao.saidaUser.tipo_documentos,
 
      nomeCompleto: buildNomeCompleto(
          movimentacao.saidaUser.tratamentos?.sigla,
          movimentacao.saidaUser.orgaos?.sigla_curta,
          movimentacao.saidaUser.nome,
        ),
      }
      : null,

  destino:
    movimentacao.destinos
      ? {
        ...movimentacao.destinos,
        unidade: movimentacao.destinos.unidades,
      }
      : null,

  veiculo:
    movimentacao.veiculos
      ? movimentacao.veiculos
      : null,
  }
}