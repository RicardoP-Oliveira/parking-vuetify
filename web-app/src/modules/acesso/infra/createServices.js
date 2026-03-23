export function createServices(deps) {
  const {
    UsuarioService,
    VeiculoService,
    MovimentacaoService
  } = deps

  return {
    getUsuarioByDoc: UsuarioService.getId,
    salvarUsuario: UsuarioService.adicionar,

    getVeiculoPlaca: VeiculoService.getPlaca,
    salvarVeiculo: VeiculoService.adicionar,

    getInfo: MovimentacaoService.getInfo,
    entrada: MovimentacaoService.adicionar,
    saida: MovimentacaoService.cadastrarSaida
  }
}