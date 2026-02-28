// scr/composables/useCarroTable.js
export function useCarroTable(carroService) {
  const loadCarData = async (
    page,
    itemsPerPage,
    token,
    tab,
    filters
  ) => {
    const apiFilters = {
      documento: filters.documento,
      placa: filters.placa,
      condutor: filters.condutor,
      modelo: filters.modelo,
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

    return carroService.getTodos(
      page,
      itemsPerPage,
      token,
      tab,
      apiFilters
    )
  }

  return {
    loadCarData,
  }
}