import { FLUXO } from "../../domain/fluxo"

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
    const termo = isVeiculo.value ? formData.placa : formData.documento

    if (!termo || termo.length < 4) return
    if (termo === machine.lastTermo) return

    send('BUSCAR')

    try {
      const resposta = await controller.buscar(
        termo,
        montarControllerCtx(),
        props.tipo
      )

      if (!resposta) {
        send('FALHA', { error: 'Nenhuma resposta do controller' })
        return
      }

      machine.fluxo = resposta.fluxo
      aplicarResultado(resposta.result)
      machine.lastTermo = termo
    } catch (err) {
      console.error('Erro ao buscar:', err)
      send('FALHA', { error: err })
    }
  }

  return {
    buscarDados
  }
}