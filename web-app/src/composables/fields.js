// src/composables/fields.js
export function getCarroFields() {
  return [
    { key: 'documento', label: 'Documento', type: 'text', vModel: 'documento', required: true },
    { key: 'placa', label: 'Placa', type: 'text', vModel: 'placa', clearable: true },
    { key: 'modelo', label: 'Modelo', type: 'text', vModel: 'modelo', disabled: true },
    { key: 'destino', label: 'Destino', type: 'select', vModel: 'destino', options: [] }, // você adiciona destinoOptions
  ];
}

export function getPedestreFields() {
  return [
    { key: 'documento', label: 'Documento', type: 'text', vModel: 'documento', required: true },
    { key: 'tipoDoc', label: 'Tipo Doc', type: 'select', vModel: 'idDoc', options: [] },
    { key: 'orgao', label: 'Órgão', type: 'select', vModel: 'idOrgao', options: [] },
    { key: 'nome', label: 'Nome', type: 'text', vModel: 'nome', required: true },
    { key: 'ubm', label: 'UBM', type: 'select', vModel: 'idUbm', options: [] },
    { key: 'destino', label: 'Destino', type: 'select', vModel: 'destino', options: [] },
  ];
}
