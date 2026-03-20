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
    if (!source) return null

    const id = source[config.id]
    const title = source[config.text]

    if (id == null || title == null) return null
    
    return { id, title }
  }).filter(Boolean)
}

export const createUnidadeMap = (unidades) => {
  const mapa = new Map()
  if (!Array.isArray(unidades)) return mapa
  
  unidades.forEach(u => {
    if (u.obm?.id !== null && u.obm?.name) {
      mapa.set(u.obm.id, u.obm.name.trim().toUpperCase())
    }
  })
  return mapa
}

export const createDestinosMap = (destinos) => {
  const mapa = new Map()
  if (!Array.isArray(destinos)) return mapa

  destinos.forEach(d => {
    if (d.id !== null && d.target) {
      mapa.set(d.target.trim().toUpperCase(), d.id)
    }
  })
  return mapa
}