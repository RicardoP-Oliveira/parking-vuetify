// src/composables/useAcessoForm.js
import { ref, computed, onMounted, reactive, nextTick, watch } from 'vue'
import { useServices } from '@/modules/acesso/application/useServices'
import { useListasModules } from '../../application/useListasModules'
import { useListas } from '@/modules/shared/composables/useListas'
import { useAcessoController } from '@/modules/acesso/application/useAcessoController'
import { buildUsuarioData, applyUsuario } from '@/modules/acesso/domain/usuario'
import { createUnidadeMap, createDestinosMap } from '@/core/config/listasConfig'
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
    listas, fetchListas, destinosOptions
  } = useListas(listaService)

  // ***** STATE *****
  const formDefault = {
    documento: '', nome: '', placa: '', marca: '', user_id: null, carro_id: null, registro_id: null,
    doc_id: null, orgao_id: null, ubm_id: null, gradua_id: null, destino_id: null
  }

  const formData = reactive({ ...formDefault }) // Cria o objeto reativo
  const fluxoAtual = ref(null)
  const isNovoCadastro = ref(false)
  const lastData = ref(null)
  
  const mapaUnidades = computed(() => createUnidadeMap(listas.value?.unidades))
  const mapaDestinos = computed(() => createDestinosMap(listas.value?.destinos))
  const isCarro = computed(() => props.tipoForm === 'carro')
  const confirmText = computed(() => {
    return fluxoAtual.value === FLUXO.SAIDA
      ? 'SAÍDA'
      : 'ENTRADA'
  })
  
  const controller = useAcessoController({
    service: { buscarServicos },
    isCarro: isCarro.value
  })

  const { loading: loadingBusca } = controller
  const loadingSalvar = ref(false)

  const loading = computed(() => loadingBusca.value || loadingSalvar.value)

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

  const preencherUsuario = (user) => {
    const dados = buildUsuarioData({
      user,
      isEntrada: fluxoAtual.value !== FLUXO.SAIDA,
      mapaUnidades: mapaUnidades.value,
      mapaDestinos: mapaDestinos.value,
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
    fluxoAtual.value = null
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

  const buscarDados = async () => {
    const termo = isCarro.value 
      ? formData.placa
      : formData.documento

    if (!termo || termo.length < 4) return
    if (termo === lastData.value) return
    
    try {
      await controller.buscar(termo, {
        formData,
        limparForm,
        preencherUsuario,
        setFluxo: (f) => fluxoAtual.value = f
      }, props.tipo)

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
        await service.saida({
          registro_id: formData.registro_id,
          user_id: formData.user_id,
          carro_id: formData.carro_id
        })
      } else {
        await service.entrada({
          dados: payload,
          tab: props.tipo
        }) 
      }
      emit('closeModal', props.tipo)
    } catch (e) {
      console.error('Erro ao salvar:', e)
    }
  }

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

    if (valor === lastData.value && !isNovoCadastro.value) return

    const user = await getUser(valor)
    if (user) {
      preencherUsuario(user)
      isNovoCadastro.value = false
    } else {
      limparUsuario()
      isNovoCadastro.value = true
    }
    lastData.value = valor

    if (isFormValid.value)  {
      await nextTick()
      modalRef.value?.getConfirmButtonEl()?.focus()
    }
  }

  const close = (from) => emit('closeModal', from)

  watch(() => formData.destino_id, async (val) => {
    if (!val) return
    await nextTick()
    modalRef.value?.getConfirmButtonEl()?.focus()
  })

  return {
    formData,
    loading,
    isNovoCadastro,
    isFormValid,
    destinosOptions,
    lastData,
    confirmText,
    close,
    salvar,
    buscarDados,
    onPlacaEnter,
    onDocEnter
  }
}