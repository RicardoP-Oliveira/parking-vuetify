export function useAcessoResultado({
  formData,
  send,
  limparForm,
  abrirNovoCadastro
}) {
  const aplicarResultado = (result) => {
    if (!result) {
      send('FALHA', { error: 'Resultado vazio do fluxo' })
      return
    }

    if (result.action === 'abrir_novo_cadastro') {
      limparForm(result.preserveField)
      abrirNovoCadastro()
      return
    }

    if (result.formPatch) {
      Object.assign(formData, result.formPatch)
      send('BUSCA_SUCESSO')
    }
  }

  return {
    aplicarResultado
  }
}