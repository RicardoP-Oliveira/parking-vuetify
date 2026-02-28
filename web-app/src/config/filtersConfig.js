// src/config/filtersConfig.js
export const getFiltersByTab = (tab) => {
  const commonFilters = {
    documento: { label: 'Documento', type: 'text', icon: 'mdi-file-documento' },
    condutor: { label: tab === 'carro' ? 'Condutor' : 'Nome', type: 'text', icon: 'mdi-account-search' },
    dataInicio: { label: 'Data Inicial', type: 'date' },
    dataFim: { label: 'Data Final', type: 'date', dependsOn: 'dataInicio' },
    horaInicio: { label: 'Hora Inicial', type: 'time' },
    horaFim: { label: 'Hora Final', type: 'time', dependsOn: 'horaInicio' }
  }

  if (tab === 'carro') {
    return {
      placa: { label: 'Placa', type: 'text', icon: 'mdi-car-back' },
      modelo: { label: 'Modelo', type: 'text', icon: 'mdi-car-info' },
      ...commonFilters
    }
  }
  
  return commonFilters
}

// export const getFiltersSchema = (tab) => {
//     const schema = getFiltersByTab(tab)
//     return Object.keys(schema).reduce((acc, key) => {
//       acc[key] = null
//       return acc
//     }, {})
//   }
export const getAllFiltersSchema = () => {
  return {
    placa: null,
    modelo: null,
    documento: null,
    condutor: null,
    dataInicio: null,
    dataFim: null,
    horaInicio: null,
    horaFim: null
  }
}