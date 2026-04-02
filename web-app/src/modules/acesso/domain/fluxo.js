export const FLUXO = {
    SAIDA: 'saida',
    ENTRADA_USUARIO: 'entrada_usuario',
    ENTRADA_CARRO_USUARIO: 'entrada_com_usuario',
    CARRO_SEM_CONDUTOR: 'carro_sem_condutor',
    NOVO: 'novo'
  }

export function detectarFluxo({ info, extra, isVeiculo }) {
  const temSaida = !!info?.dados
  const temEntrada = !!extra?.dados
  const temCondutor = !!extra?.dados?.documento
    
  if (temSaida) {
    return FLUXO.SAIDA
  }

  if (temEntrada) {
    if (!isVeiculo) {
      return FLUXO.ENTRADA_USUARIO
    }
    
    return temCondutor
      ? FLUXO.ENTRADA_CARRO_USUARIO
      : FLUXO.CARRO_SEM_CONDUTOR
  }
    return FLUXO.NOVO
}