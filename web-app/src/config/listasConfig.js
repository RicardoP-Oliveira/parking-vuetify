// src/config/listasConfig.js
export const LISTAS_MAP = {
  documentos: { key: 'docOptions', id: 'id', text: 'sigla' },
  tratamento: { key: 'tratoOptions', id: 'id', text: 'abrev' },
  orgaos:     { key: 'orgaosOptions', id: 'id', text: 'sigla', nested: 'orgao' },
  unidades:   { key: 'unidadesOptions', id: 'id', text: 'name', nested: 'obm' },
  destinos:   { key: 'destinosOptions', id: 'id', text: 'target' }
}

export const transformList = (rawData, config) => {
  if (!Array.isArray(rawData)) return []
  
  return rawData.map(item => {
    const source = config.nested ? item[config.nested] : item
    return {
      id: source?.[config.id],
      title: source?.[config.text]
    }
  })
}

export const createUnidadeMap = (unidades) => {
  const mapa = new Map()
  if (!Array.isArray(unidades)) return mapa
  
  unidades.forEach(u => {
    if (u.obm?.id) {
      mapa.set(u.obm.id, u.obm.name.trim().toUpperCase())
    }
  })
  return mapa
}

export const createDestinosMap = (destinos) => {
  const mapa = new Map()
  if (!Array.isArray(destinos)) return mapa

  destinos.forEach(d => {
    if (d.target) {
      mapa.set(d.target.trim().toUpperCase(), d.id)
    }
  })
  return mapa
}