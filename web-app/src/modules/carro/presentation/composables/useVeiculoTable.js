export function useVeiculoTable(VeiculoService) {
  const loadCarData = async (
    token,
    tab,
    filters
  ) => {
    const apiFilters = {
      documento: filters.documento,
      placa: filters.placa,
      condutor: filters.condutor,
      prefixo: filters.prefixo,
      dataInicio: filters.dataInicio
        ? filters.dataInicio.toISOString().split('T')[0]
        : null,
      dataFim: filters.dataFim
        ? filters.dataFim.toISOString().split('T')[0]
        : null,
      horaInicio: filters.horaInicio,
      horaFim: filters.horaFim,
    };

    Object.keys(apiFilters).forEach((key) => {
      if (apiFilters[key] === null || apiFilters[key] === '') {
        delete apiFilters[key];
      }
    });

    return VeiculoService.getTodos(
      token,
      tab,
      apiFilters
    )
  }

  return {
    loadCarData,
  }
}