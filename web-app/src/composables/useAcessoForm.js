// src/composables/useAcessoForm.js
import { ref, computed, watch, onMounted } from 'vue'
import { useServices } from './useService'

const ACTIONS = { ENTRADA: 'Entrada', SAIDA: 'Saída' }

export function useAcessoForm(props, emit) {
  const service = useServices()

  // ***** STATE *****
  const documento = ref('')
  const nome = ref('')
  const placa = ref('')
  const modelo = ref('')
  const ubm = ref('')
  const tipo_doc = ref('')
  const isAction = ref(ACTIONS.ENTRADA)
  const formTouched = ref(false)
  const loading = ref(false)
  const lastData = ref(null)

  // **** Referências ****
  const user_id = ref(null)
  const carro_id = ref(null)
  const registro_id = ref(null)
  const doc_id = ref(null)
  const orgao_id = ref(null)
  const ubm_id = ref(null)
  const gradua_id = ref (null)
  const destino_id = ref(null)

  // **** Listas ****
  const listas = ref ({
    unidades: [],
    orgaos: [],
    destinos: [],
    documentos: [],
    tratamento: []
  })

  // **** CONTROLES ****
  let debounceTimer = null

  // **** Getters de Opções (COMPUTED) ****

  // 1. Define  o mapeamento das listas
  const LISTAS_CONFIG = {
    documentos: { key: 'docOptions', id: 'id', text: 'sigla' },
    tratamento: { key: 'tratoOptions', id: 'id', text: 'abrev' },
    orgaos: { key: 'orgaosOptions', id: 'id', text: 'sigla', nested: 'orgao' },
    unidades: { key: 'unidadesOptions', id: 'id', text: 'name', nested: 'obm' },
    destinos: { key: 'destinosOptions', id: 'id', text: 'target' }
  }

  // 2. Cria uma lógica dinâmica
  const labelDocumento = computed (() => {
    return tipo_doc.value
      ? `Documento/${tipo_doc.value}`
      : ''
  })
  const options = computed(() => {
    const result = {}

    Object.keys(LISTAS_CONFIG).forEach(listkey => {
      const config = LISTAS_CONFIG[listkey];
      const rawData = listas.value[listkey] || []
    
      if (Array.isArray(rawData)) {
        result[config.key] = rawData.map(item => {
          const source = config.nested ? item[config.nested] : item

          return {
            id: source?.[config.id],
            title: source?.[config.text]
          }
        })
      } else {
        result[config.key] = []
      }
    })
    return result
  })

  // **** VALIDAÇÕES ****
  const patternPlaca = /^[A-z]{3}[0-9][A-Z0-9][0-9]{2}$/
  const isValidCarroForm = computed(() => patternPlaca.test(placa.value)
    && (nome.value))
  const showError = computed(() => formTouched.value && (!documento.value || documento.value.length < 4))

  // **** APOIO ****
  const limparForm = () => {
    nome.value = ''
    placa.value = ''
    modelo.value = ''
    tipo_doc.value = ''
    destino_id.value = null
    user_id.value = null
    carro_id.value = null
    registro_id.value = null
    doc_id.value = null
    orgao_id.value = null
    ubm_id.value = null
    gradua_id.value = null
    isAction.value = ACTIONS.ENTRADA
  }

  const resolverDestino = (data = null) => {
    const ubmIdBusca = data.ubm_id || data.user?.ubm_id
    let destinoEncontrado = null
    if (ubmIdBusca) {
      const nomeUbm = listas.value.unidades.find(u => u.obm.id === ubmIdBusca)?.obm?.name.toUpperCase()
      if (nomeUbm) {
        destinoEncontrado = listas.value.destinos.find(d => d.target?.toUpperCase() === nomeUbm)
      }
    }
    if (destinoEncontrado) {
      destino_id.value = destinoEncontrado.id
    } else {
      destino_id.value = data.destino_id ||  10
    }
  }

  const getUser = async (valor) => {
    if (!valor) return
    try {
      const userRes = await service.getUsuarioByDoc(valor.trim())

      if (!userRes.erro && userRes.dados) {
        const user = userRes.dados
        tipo_doc.value = user.tipo_doc || ''
        nome.value = user.nomeCompleto
        ubm.value = user.nomeUbm
        user_id.value = user.user_id
        resolverDestino(user)
      } else {
        console.log('Usuário não cadastrado')
      }
    } catch (e) {
      console.error('Erro ao buscar usuário:', e.message)
    }
  }

  // **** LÓGICA (BUSCA) ****
  let requestId = 0
  const buscarDados = async (id) => {
    const valBusca = props.tipoForm === 'carro' ? placa.value : documento.value
    if (!valBusca || valBusca.length < 4) return
    if (lastData.value === valBusca) return
    const currentReq = ++requestId
    loading.value = true
    try {
      if (props.tipoForm === 'carro'){
        const cleanPlaca = valBusca.replace('#', '').toUpperCase()
        const [carroRes, ceicsRes] = await Promise.all([
          service.getCarroPlaca(cleanPlaca),
          service.getInfo({ ident: cleanPlaca, tab: props.tipo})
        ])
        const valorPreservado = valBusca
        if (currentReq !== requestId) return
        limparForm()
        lastData.value = valorPreservado
        if(ceicsRes?.dados) {
          isAction.value = ACTIONS.SAIDA
          documento.value = ceicsRes.dados.documento
          placa.value = ceicsRes.dados.placa
          modelo.value = ceicsRes.dados.modelo
          destino_id.value = ceicsRes.dados.destino_id
          registro_id.value = ceicsRes.dados.id
          carro_id.value = ceicsRes.dados.carro_id
        } else if (carroRes?.dados) {
          isAction.value = ACTIONS.ENTRADA
          documento.value = carroRes.dados.documento
          placa.value = carroRes.dados.placa
          modelo.value = carroRes.dados.marca
          carro_id.value = carroRes.dados.id
          user_id.value = carroRes.dados.user_id
          resolverDestino(carroRes.dados)
        } else {
          placa.value = cleanPlaca
        }
      } else {
        const [userRes, pedestreRes] = await Promise.all([
          service.getUsuarioByDoc(documento.value),
          service.getInfo({ ident: documento.value, tab: props.tipo })
        ])
        if (currentReq !== requestId) return
        limparForm()
        const dados = pedestreRes?.dados || userRes?.dados
        if (dados) {
          isAction.value = pedestreRes?.dados ? ACTIONS.SAIDA : ACTIONS.ENTRADA
          tipo_doc.value = dados.tipo_doc || ''
          doc_id.value = dados.doc_id 
          ubm_id.value = dados.ubm_id || ''
          orgao_id.value = dados.orgao_id
          gradua_id.value = dados.gradua_id
          user_id.value = dados.user_id
          registro_id.value =  dados.id || ''
          resolverDestino(dados)
        }
      }
    } finally { loading.value = false }
  }

  // ***** REGISTRAR *****
  const salvar = async () => {
    formTouched.value = true
    const payload = { 
      user_id: user_id.value,
      destino_id: destino_id.value,
      ...(props.tipo === 'carro' && { carro_id: carro_id.value })
    }
    try {
      if (isAction.value === ACTIONS.SAIDA && registro_id.value) {
        payload.registro_id = registro_id.value
        await service.saida( payload )
      } else {
        await service.entrada({ dados: payload, tab: props.tipo})
      }
    } catch (error) {
      console.error("Erro ao processar operações:", error)
    } finally {
      loading.value = false
    }
    close(props.tipo)   
  }

  const close = (from) => {
    emit('closeModal', from)
  }

  //**** WATCHERS / MOUNTED *****
  watch(documento, (newVal) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    nome.value = ''
    destino_id.value = null
    if (!newVal || newVal.length < 4) return
    debounceTimer = setTimeout(() => getUser(newVal), 300)
  })

  watch(placa, (newVal, oldVal) => {
    if (newVal === oldVal) return
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => buscarDados(), 300)
  })

  onMounted(async () => {
    const [u, o, d, dr, t] = await Promise.all([
      service.getUnidades(),
      service.getOrgaos(),
      service.getDestinos(),
      service.getDocs(),
      service.getTratos()
    ])

    listas.value = {
      unidades: u?.dados || [],
      orgaos: o?.dados || [],
      destinos: d || [],
      documentos: dr || [],
      tratamento: t || []
    }
 
    const idInicial = props.dialog?.idPlaca || props.dialog?.documento
    if (props.tipoForm === 'carro') {
      placa.value = idInicial
    } else {
      documento.value = idInicial
    }
    await buscarDados()
  })

  const isReadOnly = computed(() => isAction.value === ACTIONS.SAIDA && props.tipoForm === 'pedestre')

  return {
    documento, nome, placa, modelo, isAction, formTouched, loading, ubm,
    doc_id, ubm_id, orgao_id, gradua_id, destino_id, tipo_doc, labelDocumento,
    isReadOnly,
    docOptions: computed(() => options.value.docOptions),
    tratoOptions: computed(() => options.value.tratoOptions),
    orgaosOptions: computed(() => options.value.orgaosOptions),
    unidadesOptions: computed(() => options.value.unidadesOptions),
    destinosOptions: computed(() => options.value.destinosOptions),
    isValidCarroForm, showError, salvar, close, patternPlaca, getUser
  }
  
}