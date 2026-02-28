import { ref, computed, watch, onMounted } from 'vue'
import { useServices } from './useService'

const ACTIONS = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
}

export function usePedestreForm(props, emit, serviceMock = null) {
  const pedestre = useServices(serviceMock)

  /* ========================
     STATE
  ======================== */
  const documento = ref('')
  const nome = ref('')

  const user_id = ref(null)
  const idOrgao = ref(null)
  const idDoc = ref(null)
  const idUbm = ref(null)
  const idGradua = ref(null)
  const idDestino = ref(null)
 
  const isAction = ref(ACTIONS.ENTRADA)
  const formTouched = ref(false)
  const lastData = ref(null)

   /* ========================
     LISTAS
  ======================== */
  const listas = ref ({
    unidades: [],
    orgaos: [],
    destinos: [],
    documentos: [],
    tratamento: []
  })

  /* ========================
     COMPUTED
  ======================== */
  const showError = computed(() => {
    if (!formTouched.value) return false
    if (!documento.value) return true
    if (documento.value.length < 4) return true
    if (/^0+$/.test(documento.value)) return true
    return false
  })

  const errorMessage = computed(() => {
    if (!documento.value && formTouched.value) return '* Obrigatório'
    if (documento.value.length < 4) return '* Deve ter pelo menos 4 caracteres'
    if (/^0+$/.test(documento.value)) return '* O valor não pode ser apenas zeros'
    return ''
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
      } else {
        result[config.key] = []
      }
    })
    return result
  })

  /* ========================
     HELPERS
  ======================== */

  const limparForm = () => {
    nome.value = ''
    user_id.value = null
    idOrgao.value = null
    idDoc.value = null
    idUbm.value = null
    idGradua.value = null
    idDestino.value = null
    isAction.value = ACTIONS.ENTRADA
  }

  const setDataForm = (data = null) => {
    lastData.value = data
    if (!data) return
    const user = data.user ?? {}

    user_id.value ||= data.e_user_id ?? data.user_id
    idDoc.value ||=  data?.doc_id ?? data?.idDoc ?? null
    idOrgao.value ||= user.orgao_id ?? data.orgao_id ?? null
    idUbm.value ||= user.ubm_id ?? data.ubm_id ?? null
    idGradua.value ||= user.gradua_id ?? data.gradua_id ?? null
    nome.value ||= data.nGuerra || data.nome || ''
    
    resolverDestino(data)

  } 

    const resolverDestino = (data = null) => {
      const ubmIdBusca = data.ubm_id || data.user?.ubm_id
      let destinoEncontrado = null
      if (ubmIdBusca) {
        const nomeUbm = listas.value.unidades.find(u => u.obm.id === ubmIdBusca)?.obm?.name.toUpperCase()
        if (nomeUbm) {
          destinoEncontrado = listas.value.destinos.find(d => d.target?.toUpperCase() === nomeUbm)
        }
      }
      if (destinoEncontrado) {
        idDestino.value = destinoEncontrado.id
      } else {
        idDestino.value = data.destino_id || data.idDestino || null
      }

  //   if (data.ubm_id) {
  //     const destinoPorUbm = listas.value.destinos.find(d => 
  //       d.target?.toUpperCase() === listas.value.unidades.find(u => 
  //         u.obm.id === data.ubm_id)?.obm?.name?.toUpperCase()
  //       )
  //     if (destinoPorUbm) {
  //       idDestino.value = destinoPorUbm.id
  //       return
  //     }  
  //   }
  //   idDestino.value = null
    }

  /* ========================
     CORE LOGIC
  ======================== */
  let request_id = 0

  const buscarDados = async () => {
    if (!documento.value || documento.value.length < 4) return

    const currentRequest = ++request_id

    try {
      const [userRes, pedestreRes] = await Promise.all([
        pedestre.getUsuarioByDoc(documento.value),
        pedestre.getInfo({ident: documento.value, tab: props.tipo})
      ])

      if (currentRequest !== request_id) return

      limparForm()

      if (pedestreRes?.dados) {
        isAction.value = ACTIONS.SAIDA
        setDataForm(pedestreRes.dados)
        return
      }

      if (userRes?.dados) {
        isAction.value = ACTIONS.ENTRADA
        setDataForm(userRes.dados)
        return
      }

      isAction.value = ACTIONS.ENTRADA

    } catch (e) {
      console.error('[usePedestreForm] Erro ao buscar dados', e)
    }
  }

  /* ========================
     SALVAR
  ======================== */
  const salvar = async () => {
    formTouched.value = true
    
    if (!documento.value || !nome.value || !idDestino.value) return

    const payload = {
      user_id: user_id.value,
      idGradua: idGradua.value,
      idUbm: idUbm.value,
      idOrgao: idOrgao.value,
      idDoc: idDoc.value,
      idDestino: idDestino.value
    }
    try {
      console.log(payload)
      await pedestre.salvarDados({dados: payload, tab: props.tipo})
      close()
    } catch (e) {
      console.error('[usePedestreForm] Erro ao salvar', e)
    }
  }

  const close = () => {
    emit('closeModal', { from: 'infoPedestre' })
  }

  /* ========================
     WATCHERS
  ======================== */
  let debounceTimer

  watch(documento, () => {
    limparForm()
    lastData.value = null

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      buscarDados()
    }, 400)
  })

  watch(
    () => props.dialog,
    dialog => {
      if (dialog?.idPlaca) {
        formTouched.value = false
        documento.value = dialog.idPlaca
      }
    },
    { immediate: true }
  )

  watch(
    [() => listas.value.unidades, () => options.value.destinosOptions],
    () => {
      if (lastData.value && !idDestino.value) {
        setDataForm(lastData.value)
      }
  })

  /* ========================
     MOUNTED
  ======================== */
  onMounted(async () => {
    const [
      unidadesRes,
      orgaosRes,
      destinosRes,
      documentRes,
      hierarquiaRes
    ] = await Promise.all([
      pedestre.getUnidades(),
      pedestre.getOrgaos(),
      pedestre.getDestinos(),
      pedestre.getDocs(),
      pedestre.getTratos()
    ])

    listas.value ={
      documentos: documentRes?.dados || documentRes || [],
      tratamento: hierarquiaRes?.dados || hierarquiaRes || [],
      orgaos: orgaosRes?.dados || [],
      destinos: destinosRes?.dados || destinosRes || [],
      unidades: unidadesRes?.dados || []
    }
  })

  /* ========================
     EXPOSE
  ======================== */
  return {
    documento,
    nome,
    user_id,
    idOrgao,
    idUbm,
    idDoc,
    idGradua,
    idDestino,
    isAction,
    formTouched,

    docOptions: computed(() => options.value.docOptions),
    tratoOptions: computed(() => options.value.tratoOptions),
    orgaosOptions: computed(() => options.value.orgaosOptions),
    unidadesOptions: computed(()=> options.value.unidadesOptions),
    destinosOptions: computed(() => options.value.destinosOptions),

    showError,
    errorMessage,

    salvar,
    close
  }
}
