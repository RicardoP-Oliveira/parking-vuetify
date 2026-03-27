// src/config/filtersConfig.js
export const getFiltersByTab = (tab) => {
  const commonFilters = {
    documento: { label: 'Documento', type: 'text', icon: 'mdi-file-documento' },
    condutor: { label: tab === 'VEICULO' ? 'Condutor' : 'Nome', type: 'text', icon: 'mdi-account-search' },
    dataInicio: { label: 'Data Inicial', type: 'date' },
    dataFim: { label: 'Data Final', type: 'date', dependsOn: 'dataInicio' },
    horaInicio: { label: 'Hora Inicial', type: 'time' },
    horaFim: { label: 'Hora Final', type: 'time', dependsOn: 'horaInicio' }
  }

  if (tab === 'VEICULO') {
    return {
      placa: { label: 'Placa', type: 'text', icon: 'mdi-car-back' },
      prefixo: { label: 'Prefixo', type: 'text', icon: 'mdi-car-info' },
      ...commonFilters
    }
  }
  
  return commonFilters
}

export const getAllFiltersSchema = () => {
  return {
    placa: null,
    prefixo: null,
    documento: null,
    condutor: null,
    dataInicio: null,
    dataFim: null,
    horaInicio: null,
    horaFim: null
  }
}