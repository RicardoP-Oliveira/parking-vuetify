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

  const mapped = mapUser(user)

  if (!isEntrada) {
    return {
      ...mapped,
      destino_id: destinoAtual ?? mapped.destino_id ?? null
    }
  }

  if (preservarDestino && destinoAtual) {
    return {
      ...mapped,
      destino_id: destinoAtual
    }
  }

  const destinoCalculado =  calcularDestino({
        data: user,
        isEntrada,
        mapaDestinos
      })

  return {
    ...mapped,
    destino_id: destinoCalculado ?? mapped.destino_id ?? null
  }
}

export function applyUsuario(formData, dados) {
  if (!dados) return

  Object.assign(formData, dados)
}