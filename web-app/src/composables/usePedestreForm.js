import { ref, computed, watch, onMounted } from 'vue'
import { useServices } from './useService'
import { normalizeText, toUpperSafe } from '@/js/maxMin'

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
  const destino = ref('')


  const userId = ref(null)
  const idOrgao = ref(null)
  const idDoc = ref(null)
  const idUbm = ref(null)
  const idGradua = ref(null)
 
  const isAction = ref(ACTIONS.ENTRADA)
  const formTouched = ref(false)
  const lastData = ref(null)

   /* ========================
     LISTAS
  ======================== */
  const unidades = ref([])
  const orgaos = ref([])
  const destinoOptions = ref([])
  const docRef = ref([])
  const hierarquia = ref([])

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

  const docOptions = computed(() =>
    docRef.value.map(d => ({ id: d.id, sigla: d.sigla, name: d.nome }))
  )

  const tratoOptions = computed(() =>
    hierarquia.value.map(t => ({ id: t.id, abrev: t.abrev }))
  )

  const orgaosOptions = computed(() =>
    orgaos.value.map(o => ({ id: o.orgao.id, orgao: o.orgao.sigla }))
  )

  const unidadesOptions = computed(() =>
    unidades.value.map(u => ({ id: u.obm.id, name: u.obm.name }))
  )

  /* ========================
     HELPERS
  ======================== */

  const limparForm = () => {
    nome.value = ''
    destino.value = ''
    userId.value = null
    idOrgao.value = null
    idDoc.value = null
    idUbm.value = null
    idGradua.value = null
    isAction.value = ACTIONS.ENTRADA
  }

  const setDataForm = (data = null) => {
    lastData.value = data
    if (!data) return

    const user = data.user ?? {}

    userId.value ||= data.id ?? data.userId
    idDoc.value ||=  data?.docId ?? data?.idDoc ?? null
    idOrgao.value ||= user.orgaoId ?? data.orgaoId ?? null
    idUbm.value ||= user.ubmId ?? data.ubmId ?? null
    idGradua.value ||= user.graduaId ?? data.graduaId ?? null
    nome.value ||= data.nGuerra || data.nome || ''
    
    resolverDestino(data)

  } 

  const resolverDestino = (data = null) => {
    if (!data.ubmId) return;

    const nomeUbm = unidades.value
      .find(u => u.obm.id === data?.ubmId)
      ?.obm?.name
      ?.toUpperCase();

    if (nomeUbm && destinoOptions.value.includes(nomeUbm)) {
      destino.value = nomeUbm;
    } else {
      destino.value = data.destino ?? ''
    }
  }

  /* ========================
     CORE LOGIC
  ======================== */
  let requestId = 0

  const buscarDados = async () => {
    if (!documento.value || documento.value.length < 4) return

    const currentRequest = ++requestId

    try {
      const [userRes, pedestreRes] = await Promise.all([
        pedestre.getUsuarioByDoc(documento.value),
        pedestre.getInfo({ident: documento.value, tab: props.tipo})
      ])

      if (currentRequest !== requestId) return

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
    
    if (!documento.value || !nome.value || !destino.value) return

    const payload = {
      documento: normalizeText(documento.value),
      destino: normalizeText(destino.value),
      nGuerra: nome.value,
      userId: userId.value,
      idGradua: idGradua.value,
      idUbm: idUbm.value,
      idOrgao: idOrgao.value,
      idDoc: idDoc.value,
    }
    try {
      await pedestre.salvarPedestre(payload)
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

  watch([unidades, destinoOptions], () => {
    if (lastData.value && !destino.value) {
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

    unidades.value = unidadesRes?.dados || []
    orgaos.value = orgaosRes?.dados || []
    destinoOptions.value = (destinosRes || []).map(d => d.target)
    docRef.value = documentRes || []
    hierarquia.value = hierarquiaRes || []
  })

  /* ========================
     EXPOSE
  ======================== */
  return {
    documento,
    nome,
    userId,
    idOrgao,
    idUbm,
    idDoc,
    idGradua,
    destino,
    isAction,
    formTouched,

    docOptions,
    tratoOptions,
    orgaosOptions,
    unidadesOptions,
    destinoOptions,

    showError,
    errorMessage,

    salvar,
    close
  }
}
