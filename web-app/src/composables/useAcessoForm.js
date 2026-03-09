// src/composables/useAcessoForm.js
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useServices } from './useService'
import { useListas } from './useListas'
import { createUnidadeMap, createDestinosMap } from '@/config/listasConfig'
import { ACTIONS } from '@/utils/constants'

const patternPlaca = /^[A-z]{3}[0-9][A-Z0-9][0-9]{2}$/

export function useAcessoForm(props, emit) {
  const service = useServices()

  // **** INTEGRANDO AS LISTAS ****
  const {
    listas,
    fetchListas,
    docOptions,
    tratoOptions,
    orgaosOptions,
    unidadesOptions,
    destinosOptions
  } = useListas(service)

  // ***** STATE *****
  const formDefault = {
    documento: '',
    nome: '',
    placa: '',
    modelo: '',
    ubm: '',
    tipo_doc: '',
    user_id: null,
    carro_id: null,
    registro_id: null,
    doc_id: null,
    orgao_id: null,
    ubm_id: null,
    gradua_id: null,
    destino_id: null
  }

  const formData = reactive({ ...formDefault }) // Cria o objeto reativo
  
  const isAction = ref(ACTIONS.ENTRADA)
  const formTouched = ref(false)
  const loading = ref(false)
  const lastData = ref(null)
  const isNovoCadastro = ref(false)

  // **** CONTROLES ****
  let debouncePlaca = null
  let debounceDoc = null
  let requestId = 0
  let isAutofilling = false

  // **** MAPAS PERFORMÁTICOS ****
  const mapaUnidades = computed(() => createUnidadeMap(listas.value?.unidades))
  const mapaDestinos = computed(() => createDestinosMap(listas.value?.destinos))

  // **** VALIDAÇÕES ****
  const isValidCarroForm = computed(() => patternPlaca.test(formData.placa)
    && (formData.nome))
  const showError = computed(() => formTouched.value && (!formData.documento || formData.documento.length < 4))
  const isValidPedestreForm = computed(() => {
    return formData.documento?.length >= 4 && !!formData.nome && !!formData.destino_id
  })
  const isFormValid = computed(() => {
    return props.tipoForm === 'carro'
      ? isValidCarroForm.value && !!formData.destino_id
      : isValidPedestreForm.value
  })


  // **** APOIO ****
  const limparForm = () => {
    Object.assign(formData, formDefault)
    isAction.value = ACTIONS.ENTRADA
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
    formData.destino_id = data.destino_id || null
  }

  const getUser = async (valor, isSaida = false) => {

    if (!valor) return
    try {
      const userRes = await service.getUsuarioByDoc(valor.trim())

      if (!userRes.erro && userRes.dados) {
        const user = userRes.dados
        formData.tipo_doc = user.tipo_doc || ''
        formData.nome = user.nomeCompleto
        formData.ubm = user.nomeUbm
        formData.user_id = user.user_id

        if (!isSaida) {
          resolverDestino(user)
        }
        
      } else {
        isNovoCadastro.value = true
      }
    } catch (e) {
      console.error('Erro ao buscar usuário:', e.message)
    }
  }

  // **** LÓGICA (BUSCA) ****
  const buscarDados = async (id) => {
    const valBusca = props.tipoForm === 'carro' ? formData.placa : formData.documento
    if (!valBusca || valBusca.length < 4) return
    // if (lastData.value === valBusca) return
    const currentReq = ++requestId
    loading.value = true
    try {
      if (props.tipoForm === 'carro'){
        const cleanPlaca = valBusca.replace('#', '').toUpperCase()
        const [carroRes, ceicsRes] = await Promise.all([
          service.getCarroPlaca(cleanPlaca),
          service.getInfo({ ident: cleanPlaca, tab: props.tipo})
        ])

        const valorPreservado = valBusca
        if (currentReq !== requestId) return
        isAutofilling = true
        limparForm()
        lastData.value = valorPreservado
        if(ceicsRes?.dados) {
          isAction.value = ACTIONS.SAIDA
          formData.documento = ceicsRes.dados.documento
          formData.placa = ceicsRes.dados.placa
          formData.modelo = ceicsRes.dados.modelo
          formData.registro_id = ceicsRes.dados.id
          formData.destino_id = ceicsRes.dados.destino_id
          formData.carro_id = ceicsRes.dados.carro_id
          await getUser(ceicsRes.dados.documento, true)
        } else if (carroRes?.dados) {
          isAction.value = ACTIONS.ENTRADA
          formData.documento = carroRes.dados.documento
          formData.placa = carroRes.dados.placa
          formData.modelo = carroRes.dados.marca
          formData.carro_id = carroRes.dados.id
          formData.user_id = carroRes.dados.user_id
        } else {
          isNovoCadastro.value = true
          formData.placa = cleanPlaca
        }
      } else {
        const [userRes, pedestreRes] = await Promise.all([
          service.getUsuarioByDoc(valBusca),
          service.getInfo({ ident: valBusca, tab: props.tipo })
        ])

        const valorPreservado = valBusca
        if (currentReq !== requestId) return
        isAutofilling = true
        limparForm()
        lastData.value = valorPreservado

        formData.documento = valBusca

        if (pedestreRes?.dados) {
          isAction.value = ACTIONS.SAIDA
          const dadosCeics = pedestreRes.dados
          formData.registro_id = dadosCeics.id
          formData.destino_id = dadosCeics.destino_id
          formData.user_id = dadosCeics.user_id

          await getUser(valorPreservado, true)
        } else if (userRes?.dados) {
          isAction.value = ACTIONS.ENTRADA
          const dadosUser = userRes.dados
          formData.tipo_doc = dadosUser.tipo_doc
          formData.doc_id = dadosUser.doc_id
          formData.ubm_id = dadosUser.ubm_id
          formData.orgao_id = dadosUser.orgao_id
          formData.gradua_id = dadosUser.gradua_id
          formData.user_id = dadosUser.user_id
          formData.nome = dadosUser.nomeCompleto
          formData.ubm = dadosUser.nomeUbm

          resolverDestino(dadosUser)
        } else {
          isNovoCadastro.value = true
        }
      }
      lastData.value = valBusca
    } catch (error) {
      console.error('Erro na busca de dados:', error)
    } finally { 
      isAutofilling = false
      loading.value = false 
    }
  }

  // ***** REGISTRAR *****
  const salvar = async () => {
    formTouched.value = true
    const payload = { 
      user_id: formData.user_id,
      destino_id: formData.destino_id,
      ...(props.tipo === 'carro' && { carro_id: formData.carro_id })
    }
    try {
      if (isAction.value === ACTIONS.SAIDA && formData.registro_id) {
        payload.registro_id = formData.registro_id
        await service.saida( payload )
      } else {
        await service.entrada({ dados: payload, tab: props.tipo})
      }
    } catch (error) {
      console.error("Erro ao processar operações:", error)
    } finally {
      loading.value = false
    }
    close(props.tipo)   
  }

  const close = (from) => {
    emit('closeModal', from)
  }

  //**** WATCHERS / MOUNTED *****
  watch(() => [formData.documento, formData.placa],
    ([newDoc, newPlaca], [oldDoc, oldPlaca]) => {
    if (isAutofilling) return
    if (newDoc !== oldDoc) {
      if (debounceDoc) clearTimeout(debounceDoc)
      if (isAction.value !== ACTIONS.SAIDA) {
       formData.destino_id = null
       if (newDoc && newDoc.length >= 4) {
        if (props.tipoForm === 'pedestre') {
           debounceDoc = setTimeout(() => buscarDados(), 500) 
        } else {
          debounceDoc = setTimeout(() => getUser(newDoc), 500) 
        }
       }
      }
    }

    if (newPlaca !== oldPlaca) {
      if (debouncePlaca) clearTimeout(debouncePlaca)
      
      if (newPlaca && newPlaca.length >= 7) {
        debouncePlaca = setTimeout(() => buscarDados(), 500)
      }
    }
  })

  onMounted(async () => {
    await fetchListas()
 
    const idInicial = props.dialog?.idPlaca || props.dialog?.documento
    if (idInicial) {
      if (props.tipoForm === 'carro') {
        formData.placa = idInicial
        isAutofilling = false
      } else {
        formData.documento = idInicial
        isAutofilling = false 
      }
    }
  })

  const isReadOnly = computed(() => isAction.value === ACTIONS.SAIDA && props.tipoForm === 'pedestre')

  return {
    formData,
    isAction, formTouched, loading, isNovoCadastro,
    isReadOnly, isFormValid, isValidCarroForm, isValidPedestreForm,
    docOptions, tratoOptions, orgaosOptions, unidadesOptions, destinosOptions,
    showError, salvar, close, patternPlaca, getUser, buscarDados
  }
  
}