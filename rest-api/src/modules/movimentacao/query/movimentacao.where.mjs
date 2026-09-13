const buildInsensitiveContains = value => ({
  contains: value,
  mode: 'insensitive',
})


export const buildMovimentacaoWhere = ({
  placa,
  documento,
  prefixo,
  condutor,
  query,
  tab,
  identificador,
  emAberto = false,
} = {}) => {

  const conditions = []

  const tipo = query || tab
  const busca = identificador?.trim()


  if (tipo) {
    conditions.push({
      tipo,
    })
  }


  if (emAberto) {
    conditions.push({
      saida: null,
    })
  }


  if (placa) {
    conditions.push({
      veiculo: {
        placas: buildInsensitiveContains(placa),
      },
    })
  }


  if (prefixo) {
    conditions.push({
      veiculos: {
        prefixo: buildInsensitiveContains(prefixo),
      },
    })
  }


  if (documento) {
    conditions.push({
      OR: [
        {
          entradaUser: {
            documento: buildInsensitiveContains(documento),
          },
        },
        {
          saidaUser: {
            documento: buildInsensitiveContains(documento),
          },
        },
      ],
    })
  }


  if (condutor) {
    conditions.push({
      OR: [
        {
          entradaUser: {
            nome: buildInsensitiveContains(condutor),
          },
        },
        {
          saidaUser: {
            nome: buildInsensitiveContains(condutor),
          },
        },
      ],
    })
  }


  if (busca) {
    conditions.push({
      OR: [
        {
          entradaUser: {
            documento: busca,
          },
        },
        {
          veiculos: {
            placa: buildInsensitiveContains(busca),
          },
        },
        {
          veiculos: {
            prefixo: buildInsensitiveContains(busca),
          },
        },
      ],
    })
  }


  return conditions.length
    ? {
        AND: conditions,
      }
    : {}
}