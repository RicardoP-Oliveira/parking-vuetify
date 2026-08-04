import { hasValue, buildNomeCompleto } from "../../../shared/utils/mapperUtils.mjs"

export const mapMovimentacaoResumoLista = movimentacao => {
  const dados = movimentacao.get({ dados: true })

  dados.e_nomeCompleto = buildNomeCompleto(
    dados.e_graduaAbrev,
    dados.e_siglaCurta,
    dados.e_condutor
  )

  dados.s_nomeCompleto = buildNomeCompleto(
    dados.s_graduaAbrev,
    dados.s_siglaCurta,
    dados.s_condutor
  )

  return dados
}

export const mapMovimentacaoResumoAberto = movimentacao => {
  const dados = movimentacao.get({ plain: true })

  dados.nomeCompleto = buildNomeCompleto(
    dados.graduaAbrev,
    dados.orgaoSigla,
    dados.nome
  )

  return dados
}

export const mapMovimentacaoCreatePayload = ({ tab, body }) => ({
  user_entrada_id: body.user_id,
  veiculo_id: body.veiculo_id || null,
  tipo: tab,
  destino_id: body.destino_id,
  entrada: new Date().toISOString()
})

export const mapMovimentacaoSaidaPayload = body => {
  const payload = {
    saida: new Date().toISOString()
  }

  if (hasValue(body.veiculo_id) && body.veiculo_id) {
    payload.user_saida_id = body.user_id
  }

  return payload
}