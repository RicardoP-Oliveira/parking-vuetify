import { calcularDestino } from "@/utils/constants"

export function buildUsuarioData({
  user,
  isEntrada,
  mapaUnidades,
  mapaDestinos,
  mapUser
}) {
  if (!user) return null

  const mapped = mapUser(user)

  let destinoCalculado = null

  if (isEntrada) {
    destinoCalculado = calcularDestino({
      data: user,
      isEntrada,
      mapaUnidades,
      mapaDestinos
    })
  }

  return {
    ...mapped,
    destino_id: destinoCalculado ?? mapped.destino_id ?? null
  }
}

export function applyUsuario(formData, dados) {
  if (!dados) return

  Object.assign(formData, dados)
}