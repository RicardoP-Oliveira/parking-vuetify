import { nextTick } from 'vue'

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
  modalRef
}) {
  const onDocEnter = async () => {
    const valor = formData.documento?.trim()
    if (!valor || valor.length < 4) return

    if (valor === machine.lastTermo && !isCadastroNovo.value) return

    send('BUSCAR')

    try {
      const user = await getUser(valor)

      if (user) {
        preencherUsuario(user)
        machine.lastTermo = valor
        send('BUSCA_SUCESSO')
      } else {
        limparUsuario()
        abrirNovoCadastro()
        machine.lastTermo = valor
      }

      if (isFormValid.value) {
        await nextTick()
        modalRef.value?.getConfirmButtonEl()?.focus()
      }
    } catch (e) {
      console.error('Erro ao buscar documento:', e)
      send('FALHA', { error: e })
    }
  }

  return {
    onDocEnter
  }
}