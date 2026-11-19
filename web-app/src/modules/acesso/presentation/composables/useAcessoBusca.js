import { FLUXO } from "../../domain/fluxo"
import { STATUS } from "./useAcessoMachine"

export function useAcessoBusca({
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
}) {
  const montarControllerCtx = () => ({
    state: { formData },
    actions: {
      setFluxo: (f) => {
        machine.fluxo = f
      },
      limparForm,
      abrirNovoCadastro,
      preencherUsuario
    },
    services: {
      getUser,
      buildUsuarioPayload: (user) =>
        buildUsuarioData({
          user,
          isEntrada: machine.fluxo !== FLUXO.SAIDA,
          mapaDestinos: destinosOptions,
          destinoAtual: formData.destino_id,
          mapUser
        })
    }
  })

  const buscarDados = async () => {
    const termo = isVeiculo.value
      ? (formData.placa || formData.prefixo)
      : formData.documento

    if (!termo || termo.length < 4) return
    if (termo === machine.lastTermo) return

    if (!send('BUSCAR')) return

    try {
      const resposta = await controller.buscar(
        termo,
        montarControllerCtx(),
        props.tipo
      )

      if (machine.status !== STATUS.CARREGANDO) return

      if (!resposta) {
        send('FALHA', { error: 'Nenhuma resposta do controller' })
        return
      }
      machine.fluxo = resposta.fluxo
      machine.lastTermo = termo
      send('BUSCA_SUCESSO')
      aplicarResultado(resposta.result)
    } catch (err) {
      if (machine.status !== STATUS.CARREGANDO) return
      console.error('Erro ao buscar:', err)
      send('FALHA', { error: err })
    }
  }

  return {
    buscarDados
  }
}