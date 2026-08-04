import { createHttpClient } from "@/core/http/httpCliente"

export function useAcessoServices(rawServices) {
  const { withAuth } = createHttpClient()

  return {
    getUsuarioByDoc: withAuth(rawServices.getUsuarioByDoc),
    salvarUsuario: withAuth(rawServices.salvarUsuario),

    getVeiculoPlaca: withAuth(rawServices.getVeiculoPlaca),
    salvarVeiculo: withAuth(rawServices.salvarVeiculo),

    getInfo: withAuth(rawServices.getInfo),
    entrada: withAuth(rawServices.entrada),
    saida: withAuth(rawServices.saida) 
  }
}