import PedestreService from '@/services/PedestreService'
import UserService from '@/services/UserServices'
import UbmService from '@/services/UbmServices'
import OrgaoService from '@/services/OrgaoServices'
import TargetService from '@/services/TargetService' 
import DocumentService from '@/services/DocumentService'
import HierarquiaService from '@/services/HierarquiaService.mjs'

export function useServices(mock = null) {
  // 🔹 Permite injetar mock (testes)
  if (mock) return mock

  const token = `Bearer ${localStorage.getItem('token')}`

  return {
    /* ========================
       PEDRESTRE
    ======================== */
    getPedestreByDoc: (documento) =>
      PedestreService.getByDoc(documento, token),

    salvarPedestre: (payload) =>
      PedestreService.adicionar(payload, token),

    /* ========================
       USUÁRIO
    ======================== */
    getUsuarioByDoc: (documento) =>
      UserService.getId(documento, token),

    /* ========================
       LOOKUPS
    ======================== */
    getUnidades: () =>
      UbmService.getTodos(),

    getOrgaos: () =>
      OrgaoService.getOrgaos(),

    getDestinos: () =>
      TargetService.getTodos(),

    getDocs: () =>
      DocumentService.getTodos(),

    getTratos: () =>
      HierarquiaService.getTodos(),
  }
}
