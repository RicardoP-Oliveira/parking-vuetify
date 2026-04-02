export function useAcessoCadastroNovo({contexto, send}) {
  const abrirNovoCadastro = () => {
    let modo = 'pedestre'

    if (contexto.value.isVeiculo && contexto.value.veiculoCadastrado) {
      modo = 'condutor'
    } else if (contexto.value.isVeiculo) {
      modo = 'completo'
    }
    send('ABRIR_CADASTRO_NOVO', { modoCadastro: modo })
  }

  const cancelarCadastro = () => {
    send('CANCELAR_CADASTRO')
  }

  return {
    abrirNovoCadastro,
    cancelarCadastro
  }
}