// composables/useCarroForm.js

import { ref, computed, watch, onMounted } from 'vue'
import { useServices } from './useService'
import { consoleError } from 'vuetify/lib/util/console.mjs'

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
    const condutorResolved = ref('')
    const destino = ref('')
    const modelo = ref('')
    const ubmId = ref(null)
    const orgaoId = ref(null)
    const carroId = ref(null)
    const id = ref(null)
    const condutorId = ref('')
  
    const obm = ref('')
    const orgao = ref('')

    const search = ref('')
   
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
    const isCondutor = computed(() => true)//nGuerraPattern.test(condutor.value))
    const isValidForm = computed(() => isValidPlaca.value && isCondutor.value)

    /* ========================
     HELPERS
  ======================== */
  const clearPlaca = () => {
    placa.value = ''
  }

  const getLength = () => (pattern.test(placa.value) ? 7 : undefined)

  // const getOwner = value => {
  //   if (value?.userId) {
  //     const orgao = value.user?.orgaoU?.sigla || ''
  //     const gradua = value.user?.gradua || ''
  //     const name = value.user?.nGuerra || ''
  //     proprietario.value = `${gradua} ${orgao} ${name}`.trim()
  //   } else if (value?.orgaoId) {
  //     proprietario.value = value.orgao?.orgao || 'Desconhecido'
  //   } else {
  //     proprietario.value = 'NFPA'
  //   }
  // }

  const resolveNome = (data) => [
    data.graduaAbrev, data.orgaoSigla, data?.nome
  ].filter(Boolean).join(' ')


   const resolverDestino = (data = null) => {
    if (!data.ubmId) return;

    const nomesUbm = unidades.value
      .find(u => u.obm.id === data?.ubmId)
      ?.obm?.name
      ?.toUpperCase();

    if (nomesUbm && destinoOptions.value.includes(nomesUbm)) {
      destino.value = nomesUbm;
    } else {
      destino.value = data.destino ?? ''
    }
  }



  /* ========================
     CORE LOGIC
  ======================== */
  let currentRequest = 0

  const processResults = (infoRes, parkingRes) => {
    // ==================
    // CASO 1 - VEÍCULO JÁ DENTRO (SAÍDA)
    // ==================
    if (!parkingRes.erro && parkingRes.dados) {
      isAction.value = ACTIONS.SAIDA

      const dados = parkingRes.dados

      obm.value = dados.e_obm
      documento.value = dados.e_documento
      // condutorResolved.value = dados.e_nomeCompleto
      // condutor.value = dados.e_condutor
      placa.value = dados.carroPlaca
      modelo.value = dados.carroMarca
      destino.value = dados.destino
      condutorId.value = dados.e_condutorId
      carroId.value = dados.carroId
      id.value = dados.id

      return
    }

    // ==================
    // CASO 2 - ENTRADA COM DADOS
    // ==================
    if (!infoRes.erro && infoRes.dados) {
      isAction.value = ACTIONS.ENTRADA

      const dados = infoRes.dados

      obm.value = dados.nomeUbm
      documento.value = dados.documento
      // condutorResolved.value = dados.nomeCompleto
      // condutor.value = dados.nome
      placa.value = dados.placa
      modelo.value = dados.marca
      carroId.value = dados.id
      resolverDestino(dados)

      return
    }

    // ==================
    // CASO 3 - VISITANTE / NÃO ENCONTRADO
    // ==================
    if (infoRes.visitor) {
      isAction.value = ACTIONS.ENTRADA
      placa.value = search.value
      return
    }
  }


  const getDados = async () => {
    const requestId = ++currentRequest
    try {
      search.value = ifPattern.test(search.value)
        ? search.value.substring(1)
        : search.value

      const infoRes = await service.getInfo(search.value)

      const buscaPlaca = !isNaN(search.value) || infoRes.erro
      ? search.value
      : infoRes.visitor
        ? search.value
        : infoRes.dados?.placa || ''

      const parkingRes = await service.getParking(buscaPlaca)

      if (requestId !== currentRequest) return
      
      processResults(infoRes, parkingRes)

    } catch (e) {
      console.error('[useCarroForm] Erro ao buscar dados', e)
    }
  }

  const getUser = async value => {
    try {
      const res = await service.getUsuarioByDoc(value.trim())
      if (!res.erro && res.dados) {

        const user = res.dados

        condutorResolved.value = user.nomeCompleto
        obm.value = user.nomeUbm
        condutorId.value = user.id
        resolverDestino(user)

      }
    } catch (e) {
      console.error('[useCarroForm] Erro ao buscar usuário', e)
    }
  }

  const salvar = async () => {
    if (!placa.value) return

    const payload = {
      destino: destino.value,
      userId: condutorId.value,
      carroId: carroId.value,
      id: id.value,
    }

    try {
      await service.salvarCarro(payload)
      close()
    } catch (e) {
      console.error('[useCarroForm] Erro ao salvar', e)
    }
  }

  const close = () => {
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
  ),
  
  watch(documento, (newVal, oldVal) =>{
    if (newVal && newVal.trim().length >= 4) {
      getUser(newVal.trim())
    }
  })

  /* ========================
     MOUNTED
  ======================== */
  onMounted(async () => {
    const [
      uniddadeRes,
      destinoRes,
      hierarquiaRes
    ] = await Promise.all([
      service.getUnidades(),
      service.getDestinos(),
      service.getTratos()
    ])
    unidades.value = uniddadeRes.dados || []
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
    condutorResolved,
    destino,
    modelo,
    ubmId,
    orgaoId,
    destinoOptions,
      
    
    obm,

    isValidForm,
    clearPlaca,
    getLength,

    validatePlaca,
    validCondutor,

    getUser,
    salvar,
    close
  }
}   