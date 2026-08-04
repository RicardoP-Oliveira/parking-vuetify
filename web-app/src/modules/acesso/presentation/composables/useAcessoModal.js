// src/modules/acesso/presentation/composables/useAcessoModal.js
import { computed, nextTick } from 'vue'
import { useServices } from '@/modules/acesso/application/useServices'
import { useListasModules } from '../../application/useListasModules'
import { useListas } from '@/modules/shared/composables/useListas'
import { useAcessoController } from '@/modules/acesso/application/useAcessoController'
import { useAcessoFormState, useAcessoUsuario, useAcessoCadastroNovo,
         useAcessoResultado, useAcessoBusca, useAcessoSalvar, useAcessoUiState,
         useAcessoDocumento, useAcessoMachine, useAcessoLifecycle 
        } from '@/modules/acesso/presentation/composables'
import { buildUsuarioData, applyUsuario } from '@/modules/acesso/domain/usuario'
import { useCache } from '@/modules/acesso/application/useCache'
import { mapUser } from '@/modules/acesso/domain/mappers'

const patternPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/

export function useAcessoModal(props, emit, modalRef) {
  const listaService = useListasModules()
  const service = useServices()
  const { buscarServicos, getUser } = useCache(service)
  const { fetchListas, destinosOptions, unidadesOptions } = useListas(listaService)

  const { machine, send, isCadastroNovo, isBusy, isErro } = useAcessoMachine()
  const { formData,limparForm ,limparUsuario} = useAcessoFormState()

  const isVeiculo = computed(() => props.tipoForm === 'VEICULO')

  const contexto = computed(() => ({
    veiculoCadastrado: !!formData.veiculo_id,
    veiculo_id: formData.veiculo_id,
    usuarioCadastrado: !!formData.user_id,
    user_id: formData.user_id,
    isVeiculo: isVeiculo.value
  }))

  const controller = useAcessoController({
    service: { buscarServicos },
    isVeiculo: isVeiculo.value
  })

  const { preencherUsuario } = useAcessoUsuario({
    formData,
    machine,
    destinosOptions,
    mapUser,
    applyUsuario,
    buildUsuarioData
  })

  const { abrirNovoCadastro, cancelarCadastro } = useAcessoCadastroNovo({
    contexto,
    send
  })

  const { aplicarResultado } = useAcessoResultado({
    formData,
    send,
    limparForm,
    abrirNovoCadastro
  })

  const { buscarDados } = useAcessoBusca({
    props,
    formData,
    machine,
    isVeiculo,
    controller,
    getUser,
    destinosOptions,
    mapUser,
    limparForm,
    abrirNovoCadastro,
    preencherUsuario,
    aplicarResultado,
    send,
    buildUsuarioData
  })

  const { salvar } = useAcessoSalvar({
    service,
    formData,
    machine,
    props,
    emit,
    send
  })

  const {
    confirmText,
    isSaida,
    isReadOnly,
    loading,
    isFormValid
  } = useAcessoUiState({
    machine,
    formData,
    isVeiculo,
    isBusy
  })

  const  { onDocEnter } = useAcessoDocumento({
    formData,
    machine,
    isCadastroNovo,
    getUser,
    preencherUsuario,
    limparUsuario,
    abrirNovoCadastro,
    send,
    isFormValid,
    modalRef
  })

  const onPlacaEnter = () => buscarDados()

  const voltarParaAcesso = async (dadosCadastro) => {
    if (!dadosCadastro.finalizar) {
      send('VOLTAR_ACESSO')
      return
    }

    formData.user_id = dadosCadastro.user_id
    formData.veiculo_id = dadosCadastro.veiculo_id
    formData.destino_id = dadosCadastro.destino_id
    formData.prefixo = dadosCadastro.prefixo

    const user = await getUser(dadosCadastro.documento)
    if (user) {
      preencherUsuario(user, { preservarDestino: true})
    }

    await nextTick()
    await salvar()
  }

  const close = (from) => emit('closeModal', from)

  useAcessoLifecycle({
    fetchListas,
    props,
    isVeiculo,
    formData,
    send,
    buscarDados,
    isFormValid,
    modalRef
  })

  return {
    state: {
      formData,
      loading,
      isCadastroNovo,
      isFormValid,
      isSaida,
      isReadOnly,
      contexto,
      machine,
      isErro
    },
    ui: {
      confirmText,
      destinosOptions,
      unidadesOptions,
      modoCadastro: computed(() => machine.modoCadastro),
      isVeiculo
    },
    actions: {
      close,
      salvar,
      buscarDados,
      onPlacaEnter,
      onDocEnter,
      cancelarCadastro,
      voltarParaAcesso,
      send
    }
  }
}