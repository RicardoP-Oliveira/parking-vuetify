export function gerarSigla(unidade = '') {

  if (/^(DBM|PABM|CBA)/i.test(unidade)) {
    return unidade.split(' -')[0].trim()
  }

  if (/^\d+\s*º.*\s(?:gb|gs|gm)/i.test(unidade)) {
    return unidade.split(' - ')[0].trim()
  }

  if (/odontocl/i.test(unidade)) {
    const ordinal = unidade.match(/^([0-9]+[ªº])/i)?.[1]
    return ordinal ? `${ordinal} Odonto` : 'Odontoclinica'
  }

  if (/policl/i.test(unidade)) {
    const ordinal = unidade.match(/^([0-9]+[ªº])/i)?.[1]
    return ordinal ? `${ordinal} Policlínica` : 'Policlínica'
  }

  if (unidade.includes(' - ')) {
    return unidade.replace(/^.* - /, '').trim()
  }

  return unidade
}

export function formarUnidades(dgpTraduzido = {}) {
  return [
    ...new Map(
      dgpTraduzido
        .filter(registro => registro.unidade)
        .map(registro => [
          registro.unidade,
          {
            sigla: registro.siglaUnidade,
            unidade: registro.unidade
          }
        ])
    ).values()
  ]
}

export function formarTratamento(dgpTraduzido = {}) {
  return [
    ...new Map(
      dgpTraduzido
        .filter(registro => registro.postoGrad)
        .map(registro => [
          registro.postoGrad,
          {
            postoGrad: registro.postoGrad
          }
        ])
    ).values()
  ]
}

export const unidadesConfig = {
  modelo: 'unidades',
  chave: 'sigla',
  camposComparar: ['unidade'],

  mapear: unidade => ({
    sigla: unidade.sigla,
    unidade: unidade.unidade
  })
}

export const tratamentosConfig = {
  modelo: 'tratamentos',
  chave: 'postoGrad',
  camposComparar: [],

  mapear: tratamento => ({
    postoGrad: tratamento.postoGrad
  })
}

export function criarUsuariosConfig({
  unidadesPorSigla,
  tratamentosPorPostoGrad
}) {
  return {
    modelo: 'usuarios',
    chave: 'documento',
    camposComparar: ['nome', 'unidade_id', 'tratamento_id'],


    mapear: usuario => {
      const unidade = unidadesPorSigla.get(usuario.siglaUnidade)
      const tratamento = tratamentosPorPostoGrad.get(usuario.postoGrad)

      if (!unidade || !tratamento) {
        throw new Error(
          [
            `Documento: ${usuario.documento}`,
            `siglaUnidade: "${usuario.siglaUnidade}", encontrada: ${Boolean(unidade)}`,
            `postoGrad: "${usuario.postoGrad}", encontrado: ${Boolean(tratamento)}`
          ].join(' | ')
        )
      }

      return {
        documento: usuario.documento,
        nome: usuario.nome,
        unidade_id: unidade.id,
        tratamento_id: tratamento.id,
        tipo_doc_id: 1,
        orgao_id: 1
      }
    }
  }
}

export function validarRegistros(registrosMapeados, existentes, config) {
  const existentesPorChave = new Map(
    existentes.map(item => [item[config.chave], item])
  )

  const resultado = {
    paraCriar: [],
    paraAtualizar: [],
    semAlteracao: []
  }

  for (const dados of registrosMapeados) {
    const chave = dados[config.chave]

    if (chave == null || String(chave).trim() === '') continue

    const existente = existentesPorChave.get(chave)

    if (!existente) {
      resultado.paraCriar.push(dados)
      continue
    }

    const mudou = config.camposComparar.some(campo =>
      existente[campo] !== dados[campo]
    )

    if (mudou) {
      resultado.paraAtualizar.push({
        where: { [config.chave]: chave },
        data: dados
      })
    } else {
      resultado.semAlteracao.push(existente)
    }
  }
  return resultado
}
