import { nextTick } from 'vue'
import { FLUXO } from '../../domain/fluxo'

export function useAcessoDocumento({
  formData,
  machine,
  isCadastroNovo,
  getUser,
  preencherUsuario,
  limparUsuario,
  abrirNovoCadastro,
  send,
  isFormValid,
  controller
}) {
  const onDocEnter = async () => {
    const valor = formData.documento?.trim()
    if (!valor || valor.length < 4) return

    if (valor === machine.lastTermo && !isCadastroNovo.value) return

    const cadastroJaAberto = isCadastroNovo.value

    if (!cadastroJaAberto && !send('BUSCAR')) return

    try {
      const user = await getUser(valor)


      if (!user) {
        limparUsuario()
        abrirNovoCadastro()
        formData.documento = valor
        machine.lastTermo = valor
        return
      }

      if (!formData.veiculo_id) {
        formData.registro_id = null

        const ctx = {
          setFluxo: (fluxo) => { machine.fluxo = fluxo },
          services: { getUser, buscarServicos: controller.buscar },
          state: {},
          actions: {}
        }

        const resposta = await controller.buscar(valor, ctx, 'PEDESTRE')
        const dados = resposta?.result?.formPatch ?? null
        if (resposta?.fluxo === FLUXO.SAIDA && dados) {
          Object.assign(formData, {
            ...dados,
            destino: dados.destino?.sigla ?? dados.destino
          })
          machine.fluxo = resposta.fluxo
          machine.lastTermo = valor
          send('BUSCA_SUCESSO')
          return
        }
        if (dados?.registro_id) formData.registro_id = dados.registro_id
        if (resposta?.fluxo) machine.fluxo = resposta.fluxo
      }

      preencherUsuario(user)
      machine.lastTermo = valor
      send('BUSCA_SUCESSO')

      if (isFormValid.value) {
        await nextTick()
      }
    } catch (e) {
      console.error('Erro ao buscar documento:', e)
      send('FALHA', { error: e })
    }
  }

  return { onDocEnter }
}