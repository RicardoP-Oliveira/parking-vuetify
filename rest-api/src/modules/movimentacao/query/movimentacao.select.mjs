export const movimentacaoResumoSelect = {
  id: true,
  tipo: true,
  entrada: true,
  saida: true,

  user_entrada: true,
  documento_entrada: true,
  user_saida: true,
  documento_saida: true,
  destino: true,

  entradaUser: {
    select: {
      documento: true,
      nome: true,
      tipo_documentos: { select: { tipo: true } },
    },
  },

  saidaUser: {
    select: {
      nome: true,
      documento: true,
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