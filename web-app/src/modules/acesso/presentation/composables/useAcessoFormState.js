export function useAcessoFormState({ machine }) {
  const formDefault = {
    documento: '',
    nome: '',
    placa: null,
    marca: '',
    prefixo: '',
    registro_id: null,
    tipo_doc: '',
    destino: ''
  }

  const formData = reactive({ ...formDefault })

  const limparForm = (preservar = null) => {
    const backup = preservar ? formData[preservar] : null

    machine.lastTermo = ''

    Object.keys(formDefault).forEach((key) => {
      formData[key] = formDefault[key]
    })

    if (preservar) {
      formData[preservar] = backup
    }
  }

  const limparUsuario = () => {
    formData.placa = null
    formData.destino = ''
    formData.tipo_doc = ''
    formData.marca = ''
    formData.nome = ''
    formData.prefixo = ''
  }

  return {
    formData,
    limparForm,
    limparUsuario
  }
}