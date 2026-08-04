import { FLUXO } from "../../domain/fluxo"

export function useAcessoUsuario({
  formData,
  machine,
  destinosOptions,
  mapUser,
  applyUsuario,
  buildUsuarioData
}) {
  const preencherUsuario = (user, options = {}) => {
  const dados = buildUsuarioData({
    user,
    isEntrada: machine.fluxo !== FLUXO.SAIDA,
    mapaDestinos: destinosOptions,
    destinoAtual: formData.destino_id,
    mapUser,
    preservarDestino: options.preservarDestino ?? false
  })

  applyUsuario(formData, dados)
  }

  return {
    preencherUsuario
  }
}