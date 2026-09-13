export const movimentacaoResumoSelect = {
  id: true,
  tipo: true,
  entrada: true,
  saida: true,
  destino_id: true,

  destino: {
    select: {
      unidades: {
        select: {
          sigla: true,
        },
      },
    },
  },

  entradaUser: {
    select: {
      nome: true,
      documento: true,

      tipo_documentos: {
        select: {
          tipo: true,
        },
      },

      tratamentos: {
        select: {
          sigla: true,
        },
      },

      orgaos: {
        select: {
          sigla_curta: true,
        },
      },
    },
  },

  saidaUser: {
    select: {
      nome: true,
      documento: true,

      tratamentos: {
        select: {
          sigla: true,
        },
      },

      orgaos: {
        select: {
          sigla_curta: true,
        },
      },
    },
  },

  veiculos: {
    select: {
      placa: true,
      marca: true,
      prefixo: true,
    },
  },
}