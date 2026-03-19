import { ref, computed } from "vue"
import { LISTAS_MAP, transformList } from "@/config/listasConfig"

export function useListas(service) {
  const listas = ref({
    unidades: [],
    orgaos: [],
    destinos: [],
    documentos: [],
    tratamento: []
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

  const mapped = computed(() => {
    const result = {}
    for (const [key, config] of Object.entries(LISTAS_MAP)) {
      result[config.key] = transformList(listas.value[key], config)
    }
    return result
  })

  return {
    listas,
    fetchListas,
    ...mapped.value
  }
}