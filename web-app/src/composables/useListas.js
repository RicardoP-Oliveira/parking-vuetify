// src/composables/useListas.js
import { ref, computed } from "vue"

export function useListas(service) {
  const listas = ref ({
    unidades: [],
    orgaos: [],
    destinos: [],
    documentos: [],
    tratamento: []
  })

  const LISTAS_CONFIG = {
    documentos: { key: 'docOptions', id: 'id', text: 'sigla' },
    tratamento: { key: 'tratoOptions', id: 'id', text: 'abrev' },
    orgaos: { key: 'orgaosOptions', id: 'id', text: 'sigla', nested: 'orgao' },
    unidades: { key: 'unidadesOptions', id: 'id', text: 'name', nested: 'obm' },
    destinos: { key: 'destinosOptions', id: 'id', text: 'target' }
  }

  const options = computed(() => {
    const result = {}

    Object.keys(LISTAS_CONFIG).forEach(listkey => {
      const config = LISTAS_CONFIG[listkey];
      const rawData = listas.value[listkey] || []
    
      if (Array.isArray(rawData)) {
        result[config.key] = rawData.map(item => {
          const source = config.nested ? item[config.nested] : item

          return {
            id: source?.[config.id],
            title: source?.[config.text]
          }
        })
      }
    })
    return result
  })

  const fetchListas = async () => {
    const [u, o, d, dr, t] = await Promise.all([
      service.getUnidades(),
      service.getOrgaos(),
      service.getDestinos(),
      service.getDocs(),
      service.getTratos()
    ])
  
    listas.value = {
      unidades: u?.dados || [],
      orgaos: o?.dados || [],
      destinos: d || [],
      documentos: dr || [],
      tratamento: t || []
    }
  }

  return {
    listas,
    fetchListas,
    docOptions: computed(() => options.value.docOptions),
    tratoOptions: computed(() => options.value.tratoOptions),
    orgaosOptions: computed(() => options.value.orgaosOptions),
    unidadesOptions: computed(() => options.value.unidadesOptions),
    destinosOptions: computed(() => options.value.destinosOptions),
  }
}