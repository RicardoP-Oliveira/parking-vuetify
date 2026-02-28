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
    const condutorResolved = ref('')
    const destino = ref('')
    const modelo = ref('')
    const ubm_id = ref(null)
    const orgao_id = ref(null)
    const carro_id = ref(null)
    const id = ref(null)
    const condutor_id = ref('')
  
    const obm = ref('')
    const tab = ref('')

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
  //   if (value?.user_id) {
  //     const orgao = value.user?.orgaoU?.sigla || ''
  //     const gradua = value.user?.gradua || ''
  //     const name = value.user?.nGuerra || ''
  //     proprietario.value = `${gradua} ${orgao} ${name}`.trim()
  //   } else if (value?.orgao_id) {
  //     proprietario.value = value.orgao?.orgao || 'Desconhecido'
  //   } else {
  //     proprietario.value = 'NFPA'
  //   }
  // }


   const resolverDestino = (data = null) => {
    if (!data.ubm_id) return;

  

    const nomesUbm = unidades.value
      .find(u => u.obm.id === data?.ubm_id)
      ?.obm?.name
      ?.toUpperCase();

    if (nomesUbm && destinoOptions.value.includes(nomesUbm)) {
      destino.value = nomesUbm;
    } else {
      destino.value = data.destino
    }
  }



  /* ========================
     CORE LOGIC
  ======================== */
  let currentRequest = 0

  const processResults = (carroRes, parkingRes) => {

    // ==================
    // CASO 1 - VEÍCULO JÁ DENTRO (SAÍDA)
    // ==================
    if (!parkingRes.erro && parkingRes.dados) {
      isAction.value = ACTIONS.SAIDA

      const dados = parkingRes.dados

      obm.value = dados.e_obm
      documento.value = dados.documento
      // condutorResolved.value = dados.e_nomeCompleto
      // condutor.value = dados.e_condutor
      placa.value = dados.placa
      modelo.value = dados.modelo
      destino.value = resolverDestino(dados)
      condutor_id.value = dados.e_condutor_id
      carro_id.value = dados.carro_id
      id.value = dados.id

      return
    }

    // ==================
    // CASO 2 - ENTRADA COM DADOS
    // ==================
    if (!carroRes.erro && carroRes.dados) {
      isAction.value = ACTIONS.ENTRADA

      const dados = carroRes.dados

      obm.value = dados.nomeUbm
      documento.value = dados.documento
      // condutorResolved.value = dados.nomeCompleto
      // condutor.value = dados.nome
      placa.value = dados.placa
      modelo.value = dados.marca
      carro_id.value = dados.id
      resolverDestino(dados)
      tab.value = 'carro'

      return
    }
    
    // ==================
    // CASO 3 - VISITANTE / NÃO ENCONTRADO
    // ==================
    if (carroRes.visitor) {
      isAction.value = ACTIONS.ENTRADA
      placa.value = search.value
      return
    }
  }


  const getDados = async () => {
    const request_id = ++currentRequest

    try {
      const [carroRes, parkingRes] = await Promise.all([
        service.getCarroPlaca(search.value),
        service.getInfo({ ident: search.value, tab: props.tipo })
      ])

      // search.value = ifPattern.test(search.value)
      //   ? search.value.substring(1)
      //   : search.value 

      // const carroRes = await service.getCarroPlaca(search.value)
      
      // const buscaPlaca  = search.value

      // const buscaPlaca = !isNaN(search.value) || carroRes.erro
      // ? search.value
      // : carroRes.visitor
      //   ? search.value
      //   : carroRes.dados?.placa || ''

      //   console.log('Busncando por:',buscaPlaca)

      // const parkingRes = await service.getInfo({ ident: buscaPlaca, tab: props.tipo })

      if (request_id !== currentRequest) return

      processResults(carroRes, parkingRes)

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
        condutor_id.value = user.id
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
      user_id: condutor_id.value,
      carro_id: carro_id.value,
      id: id.value,
      tipo: 'carro',
    }
    
    try {
      await service.salvarDados(payload)
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
    ubm_id,
    orgao_id,
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