import { creataHttpClient } from "@/core/http/httpCliente"

export function useAcessoServices(rawServices) {
  const { withAuth } = creataHttpClient()

  return {
    getPedestreByDoc: withAuth(rawServices.getPedestreByDoc),
    salvarPedestre: withAuth(rawServices.salvarPedestre),

    getUsuarioByDoc: withAuth(rawServices.getUsuarioByDoc),
    salvarUsuario: withAuth(rawServices.salvarUsuario),

    getCarroPlaca: withAuth(rawServices.getCarroPlaca),
    salvarCarro: withAuth(rawServices.salvarCarro),

    getNaUBM: withAuth(rawServices.getNaUBM),
    entrada: withAuth(rawServices.entrada),
    saida: withAuth(rawServices.saida) 
  }
}