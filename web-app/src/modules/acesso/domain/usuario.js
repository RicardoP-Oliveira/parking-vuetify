import { calcularDestino } from "./destinos"

export function buildUsuarioData({
  user,
  isEntrada,
  mapaDestinos,
  mapUser,
  destinoAtual
}) {

  if (!user) return null

  const mapped = mapUser(user)

  if (!isEntrada || destinoAtual) {
    return {
      ...mapped,
      destino_id: destinoAtual ?? mapped.destino_id ?? null
    }
  }

  const destinoCalculado =  calcularDestino({
        data: user,
        isEntrada,
        mapaDestinos
      })

  return {
    ...mapped,
    destino_id: destinoCalculado ?? null
  }
}

export function applyUsuario(formData, dados) {
  if (!dados) return

  Object.assign(formData, dados)
}