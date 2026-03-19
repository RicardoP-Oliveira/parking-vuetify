import PedestreService from '@/services/PedestreService'
import UserService from '@/services/UserServices'
import UbmService from '@/services/UnidadeServices'
import OrgaoService from '@/services/OrgaoServices'
import TargetService from '@/services/DestinoService' 
import DocumentService from '@/services/DocumentoService'
import HierarquiaService from '@/services/TratamentoService.mjs'
import CeicsService from '@/services/CeicsServices'
import CarroSevice from '@/services/CarroService'

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

    storeUsuario: (documento) => 
      UserService.adicionar(documento, token),

    /* ========================
        CARRO
    =========================*/
    getCarroPlaca: (placa) => 
      CarroSevice.getPlaca(placa, token),

    storeCarro: (placa) => 
      CarroSevice.adicionar(placa, token),

    /* ========================
       CEICS
    ======================== */
    getInfo: (value) =>
      CeicsService.getInfo(value, token),

    saida: (value) =>
      CeicsService.cadastrarSaida(value, token),

    entrada: (value) =>
      CeicsService.adicionar(value, token),
    
    
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
