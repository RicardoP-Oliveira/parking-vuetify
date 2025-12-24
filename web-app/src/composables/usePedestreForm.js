import { ref, computed, watch, onMounted } from 'vue'
import { useServices } from './useService'

const ACTIONS = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída'
}

export function usePedestreForm(props, emit, serviceMock = null) {
  const pedestre = useServices(serviceMock)

  /* ========================
     STATE
  ======================== */
  const documento = ref('')
  const tipoDoc = ref('')
  const idOrgao = ref('')
  const trato = ref('')
  const nome = ref('')
  const idUbm = ref('')
  const destino = ref('')
  const orgaoSigla = ref('')
  const isAction = ref(ACTIONS.ENTRADA)
  const formTouched = ref(false)

  const unidades = ref([])
  const orgaos = ref([])
  const destinoOptions = ref([])
  const docRef = ref([])
  const hierarquia = ref([])

  const lastData = ref(null)

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
    docRef.value.map(d => ({ sigla: d.sigla, name: d.nome }))
  )

  const tratoOptions = computed(() =>
    hierarquia.value.map(t => ({ abrev: t.abrev }))
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
  const convertToUpper = () => {
    nome.value = nome.value?.toUpperCase() || ''
  }

  const limparForm = () => {
    tipoDoc.value = ''
    idOrgao.value = ''
    trato.value = ''
    nome.value = ''
    idUbm.value = ''
    destino.value = ''
    orgaoSigla.value = ''
    isAction.value = ACTIONS.ENTRADA
  }

  const mountRegex = (text = '') => {
    const termos = ['CBMERJ', 'PMERJ', 'EB', 'MB', 'FAB']
    const split = text.trim().split(/\s+/)

    if (!split.length) return {}

    if (termos.some(t => split.includes(t))) {
      return {
        trato: split[0],
        orgao:
          split[1] === 'CBMERJ'
            ? 'BM'
            : split[1] === 'PMERJ'
            ? 'PM'
            : split[1],
        name: split.slice(2).join(' ')
      }
    }

    return {
      trato: split[0],
      name: split.slice(1).join(' '),
      ubm: 'VISITANTE'
    }
  }

  const setDataForm = (data, regex = {}) => {
    lastData.value = data

    if (!tipoDoc.value && (data.tDoc || data.tipo_doc)) {
      tipoDoc.value = data.tDoc || data.tipo_doc
    }

    if (!idOrgao.value && data.orgaoId) {
      idOrgao.value = data.orgaoId
    }

    if (!trato.value) {
      trato.value = regex.trato || data.gradua || ''
    }

    if (!nome.value) {
      nome.value = regex.name || data.nGuerra || ''
    }

    if (!idUbm.value) {
      idUbm.value = regex.ubm || data.ubmId || ''
    }

    if (!unidades.value.length || !destinoOptions.value.length) return

    if (!destino.value) {
      const nomeUbm = (
        unidades.value.find(u => u.obm.id === idUbm.value)?.obm.name || ''
      ).toUpperCase()

      const destinosNormalizados = destinoOptions.value.map(d =>
        d.toUpperCase()
      )

      destino.value = destinosNormalizados.includes(nomeUbm)
        ? nomeUbm
        : data.destino || 'CEICS'
    }

    if (!orgaoSigla.value) {
      orgaoSigla.value =
        data.orgaoU?.sigla === 'CBMERJ'
          ? 'BM'
          : data.orgaoU?.sigla === 'PMERJ'
          ? 'PM'
          : data.orgaoU?.sigla || ''
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
      isAction.value = ACTIONS.ENTRADA

      const [userRes, pedestreRes] = await Promise.all([
        pedestre.getUsuarioByDoc(documento.value),
        pedestre.getPedestreByDoc(documento.value)
      ])

      if (currentRequest !== requestId) return

      if (!userRes?.erro && userRes?.dados) {
        setDataForm(userRes.dados)
      }

      if (!pedestreRes?.erro && pedestreRes?.dados) {
        isAction.value = ACTIONS.SAIDA
        const regex = mountRegex(pedestreRes.dados.name)
        setDataForm(pedestreRes.dados, regex)
      }
    } catch (e) {
      console.error('[usePedestreForm] Erro ao buscar dados', e)
    }
  }

  const salvar = async () => {
    formTouched.value = true
    if (!nome.value || !destino.value) return

    const payload = {
      nDoc: documento.value.trim(),
      tDoc: tipoDoc.value,
      name: [trato.value, orgaoSigla.value, nome.value]
        .filter(Boolean)
        .join(' '),
      destino: destino.value.toUpperCase()
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
    tipoDoc,
    idOrgao,
    trato,
    nome,
    idUbm,
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

    convertToUpper,
    salvar,
    close
  }
}
