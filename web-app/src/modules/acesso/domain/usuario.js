import { calcularDestino } from "./destinos"

export function buildUsuarioData({
  user,
  isEntrada,
  mapaDestinos,
  mapUser,
  destinoAtual,
  preservarDestino = false
}) {

  if (!user) return null

  const campoUsuario = isEntrada ? 'documento_entrada' : 'documento_saida'
  const mapped = mapUser(user, campoUsuario)

  if (!isEntrada) {
    return {
      ...mapped,
      destino: destinoAtual ?? mapped.destino ?? null
    }
  }

  if (preservarDestino && destinoAtual) {
    return {
      ...mapped,
      destino: destinoAtual
    }
  }

  const destinoCalculado = calcularDestino({
    data: user,
    isEntrada,
    mapaDestinos
  })

  return {
    ...mapped,
    destino: destinoCalculado ?? mapped.destino ?? null
  }
}

export function applyUsuario(formData, dados) {
  if (!dados) return

  Object.assign(formData, dados)
}