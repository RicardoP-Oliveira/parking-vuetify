export function createListasService(deps) {
  const {
    UnidadeService,
    OrgaoService,
    DestinoService,
    DocumentoService,
    TratamentoService,
  } = deps

  return {
    getUnidades: UnidadeService.getTodos,
    getOrgaos: OrgaoService.getOrgaos,
    getDestinos: DestinoService.getTodos,
    getDocs: DocumentoService.getTodos,
    getTratos: TratamentoService.getTodos
  }
}