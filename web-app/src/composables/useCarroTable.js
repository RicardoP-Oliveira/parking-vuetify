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

    // remove filtros vazios
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
  };

    const headerOrder = () => [
      'placa',
      'marcaModelo',
      'entrada',
      'destino',
      'saida',    
    ];

    const setColumns = () => [
        'placa',
        'marcaModelo',
        'entrada',
        'hEntrada',
        'eRg',
        'eCondutor',
        'saida',
        'hSaida',
        'sRg',
        'sCondutor',
        'destino',
    ]

    const setHeaderGroups = () => ({
         entrada: {
      title: 'Entrada',
      children: [
        { key: 'entrada', title: 'Data' },
        { key: 'hEntrada', title: 'Hora' },
        { key: 'eRg', title: 'Documento' },
        { key: 'eCondutor', title: 'Condutor' },
      ],
    },
    saida: {
      title: 'Saída',
      children: [
        { key: 'saida', title: 'Data' },
        { key: 'hSaida', title: 'Hora' },
        { key: 'sRg', title: 'Documento' },
        { key: 'sCondutor', title: 'Condutor' },
      ],
    },
  });

    return {
        loadCarData,
        headerOrder,
        setColumns,
        setHeaderGroups
    };
}