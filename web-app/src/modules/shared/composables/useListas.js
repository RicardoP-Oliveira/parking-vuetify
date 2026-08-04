import { ref, computed } from "vue"

export function useListas(service) {
  const listas = ref({
    unidades: [],
    orgaos: [],
    destinos: [],
    tipo_documentos: [],
    tratamentos: []
  })

  const fetchListas = async () => {
    const [u, o, d, td, t] = await Promise.all([
      service.getUnidades(),
      service.getOrgaos(),
      service.getDestinos(),
      service.getDocs(),
      service.getTratos(),
    ])
    
    listas.value = {
      unidades: u || [],
      orgaos: o || [],
      destinos: d || [],
      tipo_documentos: td || [],
      tratamentos: t || []
    }
  }

  const docOptions = computed(() => listas.value.tipo_documentos || [])
  const orgaosOptions = computed(() => listas.value.orgaos || [])
  const unidadesOptions = computed(() => listas.value.unidades || [])
  const destinosOptions = computed(() => listas.value.destinos || [])
  const tratoOptions = computed(() => listas.value.tratamentos || [])
  return {
    listas,
    fetchListas,
    docOptions,
    orgaosOptions,
    unidadesOptions,
    destinosOptions,
    tratoOptions
  }
}