export function createServices(deps) {
  const {
    UsuarioService,
    VeiculoService,
    MovimentacaoService
  } = deps

  return {
    getUsuarioByDoc: UsuarioService.getByDocumento,
    salvarUsuario: UsuarioService.adicionar,

    getVeiculoPlaca: VeiculoService.getPlaca,
    salvarVeiculo: VeiculoService.adicionar,

    getInfo: MovimentacaoService.getInfo,
    entrada: MovimentacaoService.adicionar,
    saida: MovimentacaoService.cadastrarSaida
  }
}