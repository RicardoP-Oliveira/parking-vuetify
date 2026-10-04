// scr/modules/shared/composables/useCadastro.js
import { ref, watch } from 'vue'

const PATTERNS = {
  PLACA_ANTIGA: /^[A-Z]{3}\d{4}$/,
  PLACA_MERCOSUL: /^[A-Z]{3}\d[A-Z]\d{2}$/,
  PREFIXO: /^[A-Z][A-Z0-9]{1,3}-\d{3}$/,
  DOCUMENTO: /^\d{4,11}$/
}

export function useCadastro({ formData, onPlacaEnter, onDocEnter, limparForm }) {
  const ident = ref('')
  const erroIdent = ref('')
  const novoTipo = ref({})

  const validarIdentidade = (valor) => {
    if (!valor) return { valido: false, msg: 'Campo obrigatório!' }
    const v = String(valor || '').toUpperCase().trim()
    if (v.length < 4) return { valido: false, msg: 'Mínimo de 4 caracteres.' }
    if (/^0+$/.test(v)) return { valido: false, msg: 'Sequência inválida' }

    const check =
      PATTERNS.PLACA_ANTIGA.test(v) ||
      PATTERNS.PLACA_MERCOSUL.test(v) ||
      PATTERNS.PREFIXO.test(v) ||
      PATTERNS.DOCUMENTO.test(v)

    return {
      valido: check,
      msg: check ? '' : 'Formato inválido!'
    }
  }

  const detectarTipo = (valor) => {
    const v = String(valor || '').toUpperCase().trim()
    // const ehVeiculo =
    if (PATTERNS.PLACA_ANTIGA.test(v) ||
      PATTERNS.PLACA_MERCOSUL.test(v)) {
      return { tipo: 'VEICULO', model: 'PLACA' }
    }
    if (PATTERNS.PREFIXO.test(v)) {
      return { tipo: 'VEICULO', model: 'PREFIXO' }
    }
    return { tipo: 'PEDESTRE', model: 'DOCUMENTO' }
  }

  let ultimoProcessado = ''
  const identValid = ref(false)

  function enviarIdent() {
    if (!ident.value) return
    if (ident.value === ultimoProcessado) return
    const result = validarIdentidade(ident.value)
    if (result && !result.valido) {
      erroIdent.value = result.msg
      identValid.value = false
      return
    }

    erroIdent.value = ''
    identValid.value = true
    ultimoProcessado = ident.value

    novoTipo.value = detectarTipo(ident.value)

    if (novoTipo.value.tipo === 'VEICULO') {
      formData.placa = ident.value
      onPlacaEnter()
    } else {
      formData.documento = ident.value
      onDocEnter()
    }
  }

  function limparIdent() {
    ident.value = ''
    erroIdent.value = ''
    ultimoProcessado = ''
    novoTipo.value = {}
    identValid.value = false
    limparForm()
  }

  watch(ident, (v) => {
    if (v) {
      ident.value = v.toUpperCase()
    } else {
      ultimoProcessado = ''
      identValid.value = false
    }
  })


  return {
    ident,
    erroIdent,
    identValid,
    novoTipo,
    validarIdentidade,
    detectarTipo,
    enviarIdent,
    limparIdent
  }
}
