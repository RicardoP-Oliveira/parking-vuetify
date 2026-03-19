export const FLUXO = {
    SAIDA: 'saida',
    ENTRADA_USUARIO: 'entrada_usuario',
    ENTRADA_CARRO_USUARIO: 'entrada_com_usuario',
    CARRO_SEM_CONDUTOR: 'carro_sem_condutor',
    NOVO: 'novo'
  }

export function detectarFluxo({ info, extra, isCarro }) {
    if (info?.dados) return FLUXO.SAIDA

    if (extra?.dados) {
      if (isCarro) {
        return extra.dados.documento
          ? FLUXO.ENTRADA_CARRO_USUARIO
          : FLUXO.CARRO_SEM_CONDUTOR
      }
      return FLUXO.ENTRADA_USUARIO
    }
    return FLUXO.NOVO
  }