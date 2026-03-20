import PedestreService from '@/core/services/PedestreService'
import UserService from '@/core/services/UserServices'
import CarroService from '@/core/services/CarroService'
import CeicsService from '@/core/services/CeicsService'

import { createServices } from '@/modules/acesso/infra/createServices'
import { useAcessoServices } from '@/modules/acesso/application/useAcessoServices'

export function useServices() {
  const rawServices = createServices({
    PedestreService,
    UserService,
    CarroService,
    CeicsService
  })

  return useAcessoServices(rawServices)
}