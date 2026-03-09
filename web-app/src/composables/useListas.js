// src/composables/useListas.js
import { ref, computed } from "vue"
import { LISTAS_MAP, transformList } from "@/config/listasConfig"

export function useListas(service) {
  const listas = ref ({
    unidades: [],
    orgaos: [],
    destinos: [],
    documentos: [],
    tratamento: []
  })

  const mappedOptions = computed(() => {
    const result = {}
    for (const [listKey, config] of Object.entries(LISTAS_MAP)) {
      result[config.key] = transformList(listas.value[listKey], config)
    }
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
    docOptions: computed(() => mappedOptions.value.docOptions),
    tratoOptions: computed(() => mappedOptions.value.tratoOptions),
    orgaosOptions: computed(() => mappedOptions.value.orgaosOptions),
    unidadesOptions: computed(() => mappedOptions.value.unidadesOptions),
    destinosOptions: computed(() => mappedOptions.value.destinosOptions),
  }
}