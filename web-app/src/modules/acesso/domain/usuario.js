import { calcularDestino } from "./destinos"

export function buildUsuarioData({
  user,
  isEntrada,
  mapaUnidades,
  mapaDestinos,
  mapUser,
  destinoAtual
}) {
  if (!user) return null

  const mapped = mapUser(user)

  const destinoCalculado = isEntrada && !destinoAtual
    ? calcularDestino({
        data: user,
        isEntrada,
        mapaUnidades,
        mapaDestinos
      })
    : null

  return {
    ...mapped,
    destino_id: destinoAtual ?? destinoCalculado ?? mapped.destino_id ?? null
  }
}

export function applyUsuario(formData, dados) {
  if (!dados) return

  Object.assign(formData, dados)
}