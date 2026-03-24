import UsuarioService from '@/core/services/UsuarioServices'
import VeiculoService from '@/core/services/VeiculoService'
import MovimentacaoService from '@/core/services/MovimentacaoService'

import { createServices } from '@/modules/acesso/infra/createServices'
import { useAcessoServices } from '@/modules/acesso/application/useAcessoServices'

export function useServices() {
  const rawServices = createServices({
    UsuarioService,
    VeiculoService,
    MovimentacaoService
  })

  return useAcessoServices(rawServices)
}