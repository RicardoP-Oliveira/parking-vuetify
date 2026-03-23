import { ref, computed } from "vue"
import { 
  LISTAS_MAP,
  transformList,
  createDestinosOptions} from "@/core/config/listasConfig"

export function useListas(service) {
  const listas = ref({
    unidades: [],
    orgaos: [],
    destinos: [],
    tipo_documentos: [],
    tratamento: []
  })

  const fetchListas = async () => {
    const [u, o, d, td, t] = await Promise.all([
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
      tipo_documentos: td?.dados || [],
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

  const docOptions = computed(() => mapped.value.docOptions || [])
  const tratoOptions = computed(() => mapped.value.tratoOptions || [])
  const orgaosOptions = computed(() => mapped.value.orgaosOptions || [])
  const unidadesOptions = computed(() => mapped.value.unidadesOptions || [])
  const destinosOptions = computed(() => 
    createDestinosOptions(listas.value.destinos, listas.value.unidades)
  )

  return {
    listas,
    fetchListas,
    docOptions,
    tratoOptions,
    orgaosOptions,
    unidadesOptions,
    destinosOptions
  }
}