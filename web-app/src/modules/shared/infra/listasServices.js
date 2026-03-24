export function createListasService(deps) {
  const {
    UnidadeService,
    OrgaoService,
    DestinoService,
    TipoDocService,
    TratamentoService,
  } = deps

  const parse = async (request) => {
    const res = await request()

    if (!res || res.erro) {
      console.error(res?.msg)
      return []
    }
    return res.dados || []
  }

  return {
    getDestinos: () => parse (() => DestinoService.getTodos()),
    getUnidades: () => parse(() => UnidadeService.getTodos()),
    getDocs: () => parse(() => TipoDocService.getDocs()),
    getOrgaos: () => parse(() => OrgaoService.getOrgaos()),
    getTratos: () => parse(() => TratamentoService.getTodos())
  }
}