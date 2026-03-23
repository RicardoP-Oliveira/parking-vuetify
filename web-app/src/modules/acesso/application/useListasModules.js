import * as deps from '@/core/services'

import { createListasService } from '@/modules/shared/infra/listasServices'

export function useListasModules() {
  return createListasService({
    UnidadeService: deps.UnidadeService,
    OrgaoService: deps.OrgaoService,
    DestinoService: deps.DestinoService,
    TipoDocService: deps.TipoDocService,
    TratamentoService: deps.TratamentoService
  })
}