// composables/useCarroForm.js

import { ref, computed, watch, onMounted } from 'vue'
import { useServices } from './useService'

const ACTIONS = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída'
}

export function useCarroForm(props, emit, serviceMock = null) {
    const service = useServices(serviceMock)

    /* ======================
        STATE
    ======================= */
    const isDialog = ref(false)
    const isAction = ref(ACTIONS.ENTRADA)

    const placa = ref('')
    const documento = ref('')
    const condutor = ref('')
    const destino = ref('')
    const modelo = ref('')
    const idUbm = ref(null)
    const idOrgao = ref(null)
  
    const obm = ref('')
    const orgao = ref('')

    const search = ref('')
    const form = ref({})

    const pattern = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/
    const nGuerraPattern = /^((?:\dº )?[aA-zZÀ-ÿ.()ª]+(?: [aA-zZÀ-ÿ.()ª]+)*)$/
    const ifPattern = /^#\d*$/

    const unidades = ref([])
    const orgaos = ref([])
    const destinoOptions = ref([])
    const docRef = ref([])
    const hierarquia = ref([])

    const lastData = ref(null)

     /* ======================
        COMPUTED
    ======================= */
    const isValidPlaca = computed(() => pattern.test(placa.value))
    const isCondutor = computed(() => nGuerraPattern.test(condutor.value))
    const isValidForm =computed(() => isValidPlaca.value && isCondutor.value)
    const orgaoMap = computed(() =>
        Object.fromEntries(
            orgaos.value.map(o => [o.sigla, o.id])
        )
    )

    const tratoOptions = computed(() =>
      hierarquia.value.map(t => ({ id: t.id, abrev: t.abrev }))
    )

    /* ========================
     HELPERS
  ======================== */
  const convertToUpper = () => {
    placa.value = placa.value?.toUpperCase() || ''
  }

  const clearPlaca = () => {
    placa.value = ''
  }

  const getLength = () => (pattern.test(placa.value) ? 7 : undefined)

  const getOwner = value => {
    if (value?.userId) {
      const orgao = value.user?.orgaoU?.sigla || ''
      const gradua = value.user?.gradua || ''
      const name = value.user?.nGuerra || ''
      proprietario.value = `${gradua} ${orgao} ${name}`.trim()
    } else if (value?.orgaoId) {
      proprietario.value = value.orgao?.orgao || 'Desconhecido'
    } else {
      proprietario.value = 'NFPA'
    }
  }

  const mapOrgaoSigla = sigla =>
   sigla in ORGAO_MAP ? ORGAO_MAP[sigla] : ''

  /* ========================
     CORE LOGIC
  ======================== */
  const getSearchPlaca = infoRes => {
    if (isNaN(search.value) || infoRes.erro) return search.value
    return infoRes.visitor ? search.value : infoRes.dados?.placa || ''
  }

  const processInfo = res => {
    console.log('carros ',res)
    placa.value ||= res.placa
    modelo.value ||= `${res.marca} ${res.modelo}`
    documento.value = res.user?.documento || ''
    // getOwner(res)
    if (documento.value) getUser(documento.value)
    //gradua.value = res.user.gradua
    orgao.value = res.user.orgaoU.sigla
  }

  const setParkingData = (dados, info) => {
    placa.value = dados.placa
    condutor.value = dados.eCondutor
    documento.value = dados.eRg
    modelo.value = dados.marcaModelo
    if (!info.visitor) getOwner(info.dados)
    getUser(documento.value)
  }

  const processResults = (infoRes, parkingRes) => {
    if (!parkingRes.erro && parkingRes.dados) {
      isAction.value = 'Saída'
      setParkingData(parkingRes.dados, infoRes)
    } else if (!infoRes.erro && infoRes.dados) {
      isAction.value = 'Entrada'
      processInfo(infoRes.dados)
    } else if (infoRes.visitor) {
      isAction.value = 'Entrada'
      placa.value = search.value
      getOwner(null)
    } else {
      isAction.value = 'Entrada'
      modelo.value = search.value
      getOwner(null)
    }
  }

  const getDados = async () => {
    try {
      search.value = ifPattern.test(search.value)
        ? search.value.substring(1)
        : search.value

      const infoRes = await service.getInfo(search.value)
      const searchPlaca = getSearchPlaca(infoRes)
      const parkingRes = await service.getParking(searchPlaca)
      processResults(infoRes, parkingRes)
    } catch (e) {
      console.error('[useCarroForm] Erro ao buscar dados', e)
    }
  }

  const getUser = async value => {
    try {
      const res = await service.getUsuarioByDoc(value.trim())
      if (!res.erro && res.dados) {
        const sigla = res.dados.orgaoU.sigla
        const siglaFix =
          sigla === 'CBMERJ' ? 'BM' : sigla === 'PMERJ' ? 'PM' : ''

        condutor.value = siglaFix
          ? `${res.dados.gradua} ${siglaFix} ${res.dados.nGuerra}`
          : `${res.dados.gradua} ${res.dados.nGuerra}`

        destino.value = destinoOptions.value.includes(res.dados.ubm.name)
          ? res.dados.ubm.name
          : 'CEICS'

        obm.value = res.dados.ubm.name
      } else {
        condutor.value = ''
      }
    } catch (e) {
      console.error('[useCarroForm] Erro ao buscar usuário', e)
      condutor.value = ''
    }
  }

  const salvar = async () => {
    if (!placa.value) return

    form.value = {
      placa: placa.value.toUpperCase().trim(),
      documento: documento.value.trim(),
      marcaModelo: modelo.value?.toUpperCase().trim(),
      condutor: condutor.value.trim(),
      destino: destino.value.toUpperCase().trim(),
      //owner: proprietario.value.toUpperCase().trim(),
      // gradua: gradua.value.toUpperCase().trim(),
      orgao: orgao.value.toUpperCase().trim()
    }

    console.log(form.value)

    try {
      //await service.salvarCarro(form.value)
      close()
    } catch (e) {
      console.error('[useCarroForm] Erro ao salvar', e)
    }
  }

  const close = () => {
    isDialog.value = false
    emit('closeModal', { from: 'infoModal' })
  }

  const validatePlaca = v =>
  pattern.test(v) || 'Placa inválida'

  const validCondutor = v =>
  nGuerraPattern.test(v) || 'Não satisfaz às exigências'

  /* ========================
     WATCHERS
  ======================== */
  watch(
    () => props.dialog,
    dialog => {
      if (dialog?.isDialog) {
        isDialog.value = true
        search.value = dialog.idPlaca || ''
        getDados()
      }
    },
    { immediate: true }
  )

  /* ========================
     MOUNTED
  ======================== */
  onMounted(async () => {
    const [
        destinoRes,
        hierarquiaRes
    ] = await Promise.all([
        service.getDestinos(),
        service.getTratos()
    ])

    destinoOptions.value = (destinoRes || []).map(d => d.target)
    hierarquia.value= hierarquiaRes || []
  })



  /* ========================
     EXPOSE
  ======================== */
  return {
    isDialog,
    isAction,

    placa,
    documento,
    condutor,
    destino,
    modelo,
    destinoOptions,
      
    
    obm,

    isValidForm,
    convertToUpper,
    clearPlaca,
    getLength,

    validatePlaca,
    validCondutor,

    getUser,
    salvar,
    close
  }
}   

