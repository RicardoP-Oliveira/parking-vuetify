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
      destinoAtual: formData.destino,
      mapUser,
      preservarDestino: options.preservarDestino ?? false
    })

    if (!dados) return
    applyUsuario(formData, dados)
  }

  return {
    preencherUsuario
  }
}