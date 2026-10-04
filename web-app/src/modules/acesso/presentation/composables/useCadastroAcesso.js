// src/modules/acesso/presentation/composables/useAcessoModal.js
import { computed, nextTick, ref } from 'vue'
import { useServices } from '@/modules/acesso/application/useServices'
import { useListasModules } from '../../application/useListasModules'
import { useListas } from '@/modules/shared/composables/useListas'
import { useAcessoController } from '@/modules/acesso/application/useAcessoController'
import {
  useAcessoFormState, useAcessoUsuario, useAcessoCadastroNovo,
  useAcessoResultado, useAcessoBusca, useAcessoSalvar, useAcessoUiState,
  useAcessoDocumento, useAcessoMachine, useAcessoLifecycle
} from '@/modules/acesso/presentation/composables'
import { buildUsuarioData, applyUsuario } from '@/modules/acesso/domain/usuario'
import { useCache } from '@/modules/acesso/application/useCache'
import { mapUser } from '@/modules/acesso/domain/mappers'

export function useCadastroAcesso(props, emit, modalRef = ref(null)) {
  const listaService = useListasModules()
  const service = useServices()
  const { buscarServicos, getUser } = useCache(service)
  const { fetchListas, destinosOptions, unidadesOptions } = useListas(listaService)

  const { machine, send, isCadastroNovo, isBusy, isErro } = useAcessoMachine()
  const { formData, limparForm, limparUsuario } = useAcessoFormState({ machine })

  const isVeiculo = computed(() => props.tipoForm === 'VEICULO')

  const contexto = computed(() => ({
    veiculoCadastrado: !!formData.veiculo_id,
    usuarioCadastrado: !!formData.documento_entrada,
    tipo_doc: formData.tipo_doc,
    isVeiculo: isVeiculo.value
  }))

  const controller = useAcessoController({
    service: { buscarServicos },
    isVeiculo
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

  const { onDocEnter } = (useAcessoDocumento({
    formData,
    machine,
    isCadastroNovo,
    controller,
    contexto,
    getUser,
    buscarServicos,
    preencherUsuario,
    limparUsuario,
    abrirNovoCadastro,
    send,
    isFormValid,
  }))

  const onPlacaEnter = () => buscarDados()

  const voltarParaAcesso = async (dadosCadastro) => {
    if (!dadosCadastro.finalizar) {
      send('VOLTAR_ACESSO')
      return
    }

    formData.placa = dadosCadastro.placa
    formData.destino = dadosCadastro.destino
    formData.prefixo = dadosCadastro.prefixo

    const user = await getUser(dadosCadastro.documento)
    if (user) {
      preencherUsuario(user, { preservarDestino: true })
    }

    await nextTick()
    await salvar()
  }

  useAcessoLifecycle({
    fetchListas,
    props,
    isVeiculo,
    formData,
    send,
    buscarDados,
    isFormValid,
  })

  return {
    state: {
      formData,
      modalRef,
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
      limparForm,
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