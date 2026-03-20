import { createHttpClient } from "@/core/http/httpCliente"

export function useAcessoServices(rawServices) {
  const { withAuth } = createHttpClient()

  return {
    getPedestreByDoc: withAuth(rawServices.getPedestreByDoc),
    salvarPedestre: withAuth(rawServices.salvarPedestre),

    getUsuarioByDoc: withAuth(rawServices.getUsuarioByDoc),
    salvarUsuario: withAuth(rawServices.salvarUsuario),

    getCarroPlaca: withAuth(rawServices.getCarroPlaca),
    salvarCarro: withAuth(rawServices.salvarCarro),

    getInfo: withAuth(rawServices.getInfo),
    entrada: withAuth(rawServices.entrada),
    saida: withAuth(rawServices.saida) 
  }
}