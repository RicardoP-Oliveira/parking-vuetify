// src/config/listasConfig.js
export const LISTAS_MAP = {
  tipo_documentos: { key: 'docOptions', id: 'id', text: 'tipo' },
  tratamento: { key: 'tratoOptions', id: 'id', text: 'sigla' },
  orgaos:     { key: 'orgaosOptions', id: 'id', text: 'sigla', nested: 'orgao' },
  unidades:   { key: 'unidadesOptions', id: 'id', text: 'sigla', nested: 'obm' },
  destinos:   { key: 'destinosOptions', id: 'id', text: 'unidade_id' }
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
    if (u.obm?.id !== null && u.obm?.sigla) {
      mapa.set(u.obm.id, u.obm.sigla.trim().toUpperCase())
    }
  })

  return mapa
}

export const createDestinosMap = (destinos, unidades) => {
  const mapa = new Map()
  if (!Array.isArray(destinos) || !Array(unidades)) return mapa

  const unidadeMap = createUnidadeMap(unidades)

  destinos.forEach(d => {
    const sigla = unidadeMap.get(String(d.unidade_id))
    if (d.id != null && sigla) {
      mapa.set(sigla, d.id)
    }
  })
  return mapa
}

export const createDestinosOptions = (destinos, unidades) => {
  if (!Array.isArray(destinos) || !Array.isArray(unidades)) return []

  const unidadeMap = new Map()

  unidades.forEach(u => {
    if (u.obm?.id != null && u.obm?.sigla) {
      unidadeMap.set(String(u.obm.id), u.obm.sigla.trim().toUpperCase())
    }
  })

  return destinos
    .map(d => {
      const sigla = unidadeMap.get(String(d.unidade_id))

      if (d.id == null || !sigla) return null

      return {
        id: d.id,        
        title: sigla     
      }
    })
    .filter(Boolean)
}