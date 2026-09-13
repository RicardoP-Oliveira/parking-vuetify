export const buildMovimentacaoInclude = ({
  only = null,
  exclude = [],
} = {}) => {

  const includeDefinitions = {
    entradaUser: {
      entradaUser: {
        include: {
          orgaos: true,
          tratamentos: true,
          tipo_documentos: true,
        },
      },
    },

    saidaUser: {
      saidaUser: {
        include: {
          orgaos: true,
          tratamentos: true,
        },
      },
    },

    destino: {
      destino: {
        include: {
          unidades: true,
        },
      },
    },

    veiculo: {
      veiculos: {
        include: {
          usuarios: {
            include: {
              unidades: true,
              tipo_documentos: true,
              tratamentos: true,
              orgaos: true,
            },
          },
          orgaos: true,
        },
      },
    },
  }

  let keys = Object.keys(includeDefinitions)

  if (only?.length) {
    keys = keys.filter(key => only.includes(key))
  }

  if (exclude?.length) {
    keys = keys.filter(key => !exclude.includes(key))
  }

  return keys.reduce((acc, key) => {
    Object.assign(acc, includeDefinitions[key])
    return acc
  }, {})
}

export const buildMovimentacaoListInclude = filters => 
  buildMovimentacaoInclude({
    exclude: (filters.query || filters.tab) === 'VEICULO'
    ? []
    : ['veiculo'],
  })