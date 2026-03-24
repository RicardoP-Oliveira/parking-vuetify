// src/composables/useAcessoForm.js
import { ref, computed, onMounted, reactive, nextTick, watch } from 'vue'
import { useServices } from '@/modules/acesso/application/useServices'
import { useListasModules } from '../../application/useListasModules'
import { useListas } from '@/modules/shared/composables/useListas'
import { useAcessoController } from '@/modules/acesso/application/useAcessoController'
import { buildUsuarioData, applyUsuario } from '@/modules/acesso/domain/usuario'
import { useCache } from '@/modules/acesso/application/useCache'
import { mapUser } from '@/modules/acesso/domain/mappers'
import { FLUXO } from '@/modules/acesso/domain/fluxo'

const patternPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/

export function useAcessoForm(props, emit, modalRef) {
  const listaService = useListasModules()
  const service = useServices()

  const { buscarServicos, getUser } = useCache(service)
  
  // **** INTEGRANDO AS LISTAS ****
  const {
    listas,
    fetchListas,
    destinosOptions,
    unidadesOptions,
  } = useListas(listaService)

  // ***** STATE *****
  const formDefault = {
    documento: '',
    nome: '',
    placa: '',
    marca: '',
    user_id: null,
    veiculo_id: null,
    registro_id: null,
    doc_id: null,
    orgao_id: null,
    ubm_id: null,
    gradua_id: null,
    destino_id: null
  }

  const formData = reactive({ ...formDefault }) // Cria o objeto reativo
  const fluxoAtual = ref(null)
  const isNovoCadastro = ref(false)
  const lastData = ref(null)
  const modoCadastro = ref(null)
  
  const isCarro = computed(() => props.tipoForm === 'VEICULO')
  
  const confirmText = computed(() => 
    fluxoAtual.value === FLUXO.SAIDA ? 'SAÍDA' : 'ENTRADA'
  )

  const isSaida = computed(() => fluxoAtual.value === FLUXO.SAIDA)
  const buscando = computed(() => loading.value)
  const isReadOnly = computed(() => isSaida.value)
  const contexto = computed(() => ({
    carroCadastrado: !!formData.veiculo_id,
    veiculo_id: formData.veiculo_id,
    usuarioCadastrado: !!formData.user_id,
    user_id: formData.user_id,
    isCarro: isCarro.value
  }))
  
  const controller = useAcessoController({
    service: { buscarServicos },
    isCarro: isCarro.value
  })

  const { loading } = controller

  /**   VALIDAÇÕES */
  const isFormValid = computed (() => {
    if (loading.value) return false
    const baseOk = 
      !!formData.nome && 
      !!formData.destino_id && 
      formData.documento?.length > 3

    if (isCarro.value) {
      return patternPlaca.test(formData.placa) && baseOk
    }
    return baseOk
  })

  const preencherUsuario = (user) => {
    const dados = buildUsuarioData({
      user,
      isEntrada: fluxoAtual.value !== FLUXO.SAIDA,
      mapaDestinos: destinosOptions,
      destinoAtual: formData.destino_id,
      mapUser
    })
    applyUsuario(formData, dados)
    isNovoCadastro.value = false
  }

  const limparForm = (preservar = null) => {
    const backup = preservar ? formData[preservar] : null
    Object.keys(formDefault).forEach(key => {
      formData[key] = formDefault[key]
    })
    if (preservar) formData[preservar] = backup
    isNovoCadastro.value = false
  }

  const limparUsuario = () => {
    formData.user_id = null
    formData.nome = ''
    formData.orgao_id = null
    formData.gradua_id = null
    formData.ubm_id = null
    formData.destino_id = null
  }

  const close = (from) => emit('closeModal', from)

  const buscarDados = async () => {
    const termo =  isCarro.value ? formData.placa : formData.documento

    if (!termo || termo.length < 4) return
    if (termo === lastData.value) return
    
    try {
      await controller.buscar(
        termo, 
        {
          formData,
          limparForm,
          preencherUsuario,
          getUser,
          setFluxo: (f) => {
            fluxoAtual.value = f
          },
          abrirNovoCadastro
        },
        props.tipo
      )

      lastData.value = termo
    } catch (err) {
      console.error('Erro ao buscar:', err)
    }
  }

  const salvar = async () => {
    loading.value = true
    try {
      const payload = { ...formData, tab: props.tipo }
      if (fluxoAtual.value === FLUXO.SAIDA) {
        await service.saida(payload)
      } else {
        await service.entrada({
          dados: payload,
          tab: props.tipo
        }) 
      }
      emit('closeModal', props.tipo)
    } catch (e) {
      console.error('Erro ao salvar:', e)
    } finally {
      loading.value = false
    }
  }

  const onPlacaEnter = () => buscarDados()

  const onDocEnter = async () => {
    const valor = formData.documento?.trim()
    if (!valor || valor.length < 4) return

    if (valor === lastData.value && !isNovoCadastro.value) return

    const user = await getUser(valor)
    if (user) {
      preencherUsuario(user)
    } else {
      limparUsuario()
      abrirNovoCadastro()
    }
    lastData.value = valor

    if (isFormValid.value)  {
      await nextTick()
      modalRef.value?.getConfirmButtonEl()?.focus()
    }
  }

  const abrirNovoCadastro = () => {
    if (contexto.value.isCarro && contexto.value.carroCadastrado) {
      modoCadastro.value = 'condutor'
    } else if (contexto.value.isCarro) {
      modoCadastro.value = 'completo'
    } else {
      modoCadastro.value = null
    }
    isNovoCadastro.value = true
  }

  const cancelarCadastro = () => {
    isNovoCadastro.value = false
  }

  const voltarParaAcesso = async (dadosCadastro) => {
    if (dadosCadastro.finalizar) {
      formData.user_id = dadosCadastro.user_id
      formData.veiculo_id = dadosCadastro.veiculo_id
      formData.destino_id = dadosCadastro.destino_id
      
      const user = await getUser(dadosCadastro.documento)
      if (user) {
        preencherUsuario(user)
      }
      
      await nextTick()
      await salvar()
    }
  }

  onMounted(async () => {
    await fetchListas()

    if (props.dialog?.novoCadastro) {
      if (isCarro.value) {
        formData.placa = props.dialog?.idPlaca || ''
        modoCadastro.value = 'completo'
      } else {
        formData.documento = props.dialog?.documento || ''
      }
      isNovoCadastro.value = true
      return
    }

    const inicial = props.dialog?.idPlaca || props.dialog?.documento

    if (inicial) {
      if (isCarro.value) {
        formData.placa = inicial
      } else {
        formData.documento = inicial
      }
      await buscarDados()
    }

    if (isFormValid.value) {
      await nextTick()
        modalRef.value?.getConfirmButtonEl()?.focus()
    }
  })

  watch(
    () => formData.destino_id,
    async (val) => {
      if (!val) return
      await nextTick()
      modalRef.value?.getConfirmButtonEl()?.focus()
    }
  )

  return {
    state: {
      formData,
      loading,
      isNovoCadastro,
      isFormValid,
      isSaida,
      isReadOnly,
      contexto,
      lastData
    },
    ui: {
      confirmText,
      destinosOptions,
      unidadesOptions,
      modoCadastro,
      isCarro
    },
    actions: {
      close,
      salvar,
      buscarDados,
      onPlacaEnter,
      onDocEnter,
      cancelarCadastro,
      voltarParaAcesso
    }    
  }
}