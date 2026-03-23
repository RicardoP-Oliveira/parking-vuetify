export function createListasService(deps) {
  const {
    UnidadeService,
    OrgaoService,
    DestinoService,
    TipoDocService,
    TratamentoService,
  } = deps

  return {
    getUnidades: UnidadeService.getTodos,
    getOrgaos: OrgaoService.getOrgaos,
    getDestinos: DestinoService.getTodos,
    getDocs: TipoDocService.getDocs,
    getTratos: TratamentoService.getTodos
  }
}