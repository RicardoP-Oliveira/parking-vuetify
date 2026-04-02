export function useAcessoFormState() {
  const formDefault = {
    documento: '',
    nome: '',
    placa: '',
    marca: '',
    prefixo: '',
    user_id: null,
    veiculo_id: null,
    registro_id: null,
    tipo_doc_id: null,
    orgao_id: null,
    unidade_id: null,
    tratamento_id: null,
    destino_id: null
  }

  const formData = reactive({ ...formDefault })

  const limparForm = (preservar = null) => {
    const backup = preservar ? formData[preservar] : null

    Object.keys(formDefault).forEach((key) => {
      formData[key] = formDefault[key]
    })

    if (preservar) {
      formData[preservar] = backup
    }
  }

  const limparUsuario = () => {
    formData.user_id = null
    formData.nome = ''
    formData.prefixo = ''
    formData.orgao_id = null
    formData.tratamento_id = null
    formData.unidade_id = null
    formData.destino_id = null
  }

  return {
    formData,
    limparForm,
    limparUsuario
  }
}