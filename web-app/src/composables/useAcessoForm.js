// src/composables/useAcessoForm.js
import { ref, computed, onMounted, reactive, nextTick } from 'vue'
import { useServices } from './useService'
import { useListas } from './useListas'
import { createUnidadeMap, createDestinosMap } from '@/config/listasConfig'
import { ACTIONS } from '@/utils/constants'

const patternPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/
const cache = new Map()
const TTL = 1000 * 60 * 5

export function useAcessoForm(props, emit, modalRef) {
  const service = useServices()

  const buscarServicos = async (valor) => {

    const key = valor.trim().toUpperCase()

    if (cache.has(key)) {
      const entry = cache.get(key)
      if (Date.now() - entry.time < TTL) {
        return entry.promise
      }
      cache.delete(key)
    }
    
    const resultado = Promise.all([
    service.getInfo({ ident: key, tab: props.tipo }),
    isCarro.value
      ? service.getCarroPlaca(key)
      : service.getUsuarioByDoc(key)
    ]).catch(err => {
    cache.delete(key)
    throw err
    })

    if (cache.size > 50) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    cache.set(key, {
      promise: resultado,
      time: Date.now()
    })
    return resultado
  }

  // **** INTEGRANDO AS LISTAS ****
  const {
    listas, fetchListas, docOptions, tratoOptions, orgaosOptions, unidadesOptions, destinosOptions
  } = useListas(service)

  // ***** STATE *****
  const formDefault = {
    documento: '', nome: '', placa: '', modelo: '', user_id: null, carro_id: null, registro_id: null,
    doc_id: null, orgao_id: null, ubm_id: null, gradua_id: null, destino_id: null
  }

  const formData = reactive({ ...formDefault }) // Cria o objeto reativo
  const isAction = ref(ACTIONS.ENTRADA)
  const loading = ref(false)
  const isNovoCadastro = ref(false)
  const lastData = ref(null)
  let requestId = 0
  
  const mapaUnidades = computed(() => createUnidadeMap(listas.value?.unidades))
  const mapaDestinos = computed(() => createDestinosMap(listas.value?.destinos))
  const isCarro = computed(() => props.tipoForm === 'carro')

  /**   VALIDAÇÕES */
  const isFormValid = computed (() => {
    if (loading.value) return false
    const baseOk = !!formData.nome && !!formData.destino_id && formData.documento?.length > 3
    if (isCarro.value) {
      const placaOk = patternPlaca.test(formData.placa)
      return placaOk && baseOk
    }
    return baseOk
  })

  /** FUNÇÕES AUXILIARES */
  const mapUser = (user) => ({
    user_id: user.user_id,
    nome: user.nomeCompleto,
    ubm_id: user.ubm_id,
    orgao_id: user.orgao_id,
    gradua_id: user.gradua_id,
    documento: user.doc
  })

  const preencherUsuario = (user) => {
    if (!user) return

    Object.assign(formData, mapUser(user))

    isNovoCadastro.value = false
    resolverDestino(user)
  }
  
  const resolverDestino = (data = null) => {
    if (!data) return

    if (data.destino_id) {
      formData.destino_id = data.destino_id
      return
    }

    const ubmIdBusca = data.ubm_id || data.user?.ubm_id

    if (ubmIdBusca && mapaUnidades.value.size > 0 && mapaDestinos.value.size > 0) {
      const nomeUbm = mapaUnidades.value.get(ubmIdBusca)
      if (nomeUbm) {
        const idDestino = mapaDestinos.value.get(nomeUbm)
        if (idDestino) {
          formData.destino_id = idDestino
          return
        }
      }
    }
    formData.destino_id = null
  }

  const resolverFluxo = async ({ info, extra }) => {
    //SAÍDA
    if (info?.dados) {
      const saida = info.dados
      isAction.value = ACTIONS.SAIDA

      formData.registro_id = saida.id
      formData.destino_id = saida.destino_id

      if(isCarro.value) {
        formData.carro_id = saida.carro_id
        formData.modelo = saida.modelo
        formData.placa = saida.placa
      }

      await getUser(saida.documento, true)
      return
    }

    // ENTRADA
    if (extra?.dados) {
      const entrada = extra.dados
      isAction.value = ACTIONS.ENTRADA

      if (isCarro.value) {
        formData.modelo = entrada.marca
        formData.carro_id = entrada.id
        formData.placa = entrada.placa

        if(entrada.documento) {
          await getUser(entrada.documento)
        }
      } else {
        preencherUsuario(entrada)
      }
      return
    }
    isNovoCadastro.value = true
  }

  const limparForm = (preservar = null) => {
    const backup = preservar ? formData[preservar] : ''
    Object.assign(formData, { ...formDefault})
    if (preservar) formData[preservar] = backup
    isAction.value = ACTIONS.ENTRADA
    isNovoCadastro.value = false
  }

  const close = (from) => emit('closeModal', from)

  /** LÓGICA PRINCIPAL */
  const getUser = async (valor, isSaida = false) => {
    if (!valor || valor.length < 4) return
    loading.value = true
    try {
      const userRes = await service.getUsuarioByDoc(valor.trim())
      if (userRes?.dados) {
        preencherUsuario(userRes.dados)
        isNovoCadastro.value = false
        if (!isSaida) resolverDestino(userRes.dados)
      } else {
        isNovoCadastro.value = true
        formData.user_id = null
      }
    } finally { 
      loading.value = false
    }
  }

  const buscarDados = async () => {
    const termo = isCarro.value 
      ? formData.placa
      : formData.documento

    if (!termo || termo.length < 4 || termo === lastData.value) return

    const reqId = ++requestId
    loading.value = true

    try {
      const [infoRes, extraRes] = await buscarServicos(termo)

      if (reqId !== requestId) return
      lastData.value = termo
      limparForm(isCarro.value ? 'placa' : 'documento')

      await resolverFluxo({ info: infoRes, extra: extraRes })

    } finally {
      loading.value = false
    }
  }

  const salvar = async () => {
    loading.value = true
    try {
      const payload = { ...formData, tab: props.tipo }
      isAction.value === ACTIONS.SAIDA
        ? await service.saida({ registro_id: formData.registro_id,
          user_id: formData.user_id, carro_id: formData.carro_id })
        : await service.entrada({ dados: payload, tab: props.tipo })
        emit ('closeModal', props.tipo)
    } finally { loading.value = false }
  }

  /** CICLO DE VIDA */
  onMounted(async () => {
    await fetchListas()
    const inicial = props.dialog?.idPlaca || props.dialog?.documento
    if (inicial) {
      isCarro.value ? formData.placa = inicial : formData.documento = inicial
      await buscarDados()
    }
    if (isFormValid.value) {
      await nextTick()
        modalRef.value?.getConfirmButtonEl()?.focus()
    }
  })

  const onPlacaEnter = () => buscarDados()
  const onDocEnter = async () => {
    const valor = formData.documento?.trim()
    if (!valor || valor.length < 4) return

    if (valor === lastData.value) return

    await getUser(valor, isAction.value === ACTIONS.SAIDA)

    lastData.value = valor

    if (isFormValid.value)  {
      await nextTick()
      modalRef.value?.getConfirmButtonEl()?.focus()
    }
  }

  return {
    formData, isAction, loading, isNovoCadastro, isFormValid,
    docOptions, tratoOptions, orgaosOptions, unidadesOptions, destinosOptions,
    lastData, close, salvar, getUser, buscarDados, onPlacaEnter, onDocEnter
  }
}