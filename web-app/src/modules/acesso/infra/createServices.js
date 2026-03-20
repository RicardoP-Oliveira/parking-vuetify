export function createServices(deps) {
  const {
    PedestreService,
    UserService,
    CarroService,
    CeicsService
  } = deps

  return {
    getPedestreByDoc: PedestreService.getByDoc,
    salvarPedestre: PedestreService.adicionar,

    getUsuarioByDoc: UserService.getId,
    salvarUsuario: UserService.adicionar,

    getCarroPlaca: CarroService.getPlaca,
    salvarCarro: CarroService.adicionar,

    getInfo: CeicsService.getInfo,
    entrada: CeicsService.adicionar,
    saida: CeicsService.cadastrarSaida
  }
}