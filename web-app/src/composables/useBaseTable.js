import { ref, reactive, nextTick, computed, watch, onUnmounted } from 'vue'
import { getTableConfig } from '@/config/headersConfig'

const PATTERNS = {
    PLACA_ANTIGA: /^[A-Z]{3}\d{4}$/,
    PLACA_MERCOSUL: /^[A-Z]{3}\d[A-Z]\d{2}$/,
    PREFIXO: /^[A-Z][A-Z0-9]{1,3}-\d{3}$/,
    DOCUMENTO: /^\d{4,11}$/
  }

export function useBaseTable(props, emit) {
  // Estado inicial
  const ident = ref('')
  const identRef = ref(null)
  const pageSize = ref(50)
  const pageNow = ref(1)
  const serverItems = ref([])
  const totalItems = ref(0)
  const loading = ref(false)
  const generatedHeaders = ref([])

  let debounceTimer = null

  const modal = reactive({ isOpen: false, type: null })

  const token = `Bearer ${localStorage.getItem('token')}`

  // Foco
  let focusTimer = null
  const setFocus = (force = false) => {
    nextTick(() => {
      if (focusTimer) clearTimeout(focusTimer)

      focusTimer = setTimeout(() => {
        if (!force) {
          const activeEl = document.activeElement
          const isUserTypingElsewhere = ['INPUT', 'SELECT', 'TEXTAREA'].includes(activeEl?.tagName)
          if (isUserTypingElsewhere && !identRef.value?.$el.contains(activeEl)) return
        }
        const el = identRef.value?.$el?.querySelector('.v-field__input');

        if (el) {
          el.focus();
          el.select();
        }
      }, 150); 
    });
  }

  // VALIDAÇÃO DE ENTRADA DE DADOS
  const validarIdentidade = (valor) =>{


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

  // Geração de headers
  const generateHeaders = () => {
    const { style, structure } = getTableConfig(props.tab)
    const headers = []

    structure.order.forEach((key) => {
      // Colunas agrupadas
      if (structure.groups && structure.groups[key]) {
        const group = structure.groups[key]
        headers.push({
          title: group.title,
          align: 'center',
          children: group.children.map((child) => {
            const col = style[child.key] || {}
            return {
              key: child.key,
              title: col.title || child.key,
              align: col.align || 'center',
              width: col.width || 100
            }
          })
        })
      } else {
        // Coluna simples
        const col = style[key] || {}
        headers.push({
          key,
          title: col.title || key,
          align: col.align || 'center',
          width: col.width || 100
        })
      }
    })
    generatedHeaders.value = headers
  }

  // Controle de fetch
  const loadItems = async (options = {}) => {
    if (loading.value) return
    loading.value = true
    const { structure } = getTableConfig(props.tab)
    const allActiveKeys = structure.order.flatMap(key => 
    structure.groups[key] ? structure.groups[key].children.map(c => c.key) : key)

    try {
      const res = await props.dataService(
        options.page || pageNow.value,
        options.itemsPerPage || pageSize.value,
        token,
        props.tab,
        props.filters)
      const responseData = (res && res[0]) ? res[0] : {}
      const totalCount = (res && res[1]) ? res[1] : {}
      const listaCrua = Array.isArray(responseData.dados) ? responseData.dados : []

      generateHeaders()

      serverItems.value = listaCrua.map(item => {
        const filteredItem = {}
        allActiveKeys.forEach(column => {
          switch(column) {
            case 'nome': filteredItem.nome = item.e_nomeCompleto; break
            case 'entrada': filteredItem.entrada = item.entrada ? new Date(item.entrada).toLocaleDateString() : ''; break
            case 'hEntrada': filteredItem.hEntrada = item.hEntrada ?? ''; break
            case 'saida': filteredItem.saida = item.saida ? new Date(item.saida).toLocaleDateString() : ' ___/___/___'; break
            case 'hSaida': filteredItem.hSaida = item.hSaida ?? '--:--:--'; break
            case 's_condutor': filteredItem.s_condutor = item.s_condutor; break
            default: filteredItem[column] = item[column] ?? ''
          }
        })
        return filteredItem
      })

      totalItems.value = Number(totalCount) || 0
      
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
    } finally {
      loading.value = false
      setFocus()
    }
  }

  // Atualização da tabela
  const onUpdateOptions = (options) => {
    if (pageNow.value === options.page && pageSize.value === options.itemsPerPage && serverItems.value.length > 0) return
    pageNow.value = options.page
    pageSize.value = options.itemsPerPage
    loadItems({ page: options.page, itemsPerPage: options.itemsPerPage })
  }

  // Modal
  const selectModal = () => {
    const result = validarIdentidade(ident.value)
    if (!result.valido) {
      emit('show-snackbar', { 
        message: result.msg, 
        color: 'warning',
        timeout: 3000 })
      return
    }
    modal.isOpen = true
    modal.type = PATTERNS.PREFIXO.test(ident.value) || PATTERNS.PLACA_ANTIGA.test(ident.value)
     || PATTERNS.PLACA_MERCOSUL.test(ident.value)
     ? 'carro' : 'pedestre'
  }

  const closeModal = (from) => {
    modal.isOpen = false
    ident.value = ''
    setTimeout(() => {
      if (from && from !== props.tab) {
        emit('changeTable', from)
        return
      } else {
        pageNow.value = 1
        loadItems({ page: pageNow.value })
        setFocus()
      }
    }, 400)
  }
    

  watch(() => props.tab, (newValue, oldValue) => {
    if (newValue !== oldValue) serverItems.value = []
  })

  watch(ident, (v) => { if (v) ident.value = v.toUpperCase() })

  watch(() => props.filters, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() =>{
      pageNow.value = 1
      loadItems()
  }, 500)       
  }, { deep: true })

  const getLength = computed(() => {
    const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/
    const vtrRegex = /^[A-Z]{1,4}\d?-\d{3}$/
    const docRegex = /^\d{1,11}$/
    if (placaRegex.test(ident.value)) return 7
    if (vtrRegex.test(ident.value)) return ident.value.length
    if (docRegex.test(ident.value)) return 11
    return 10
  })

  onUnmounted(() => {
    if (focusTimer) clearTimeout(focusTimer)
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    ident, identRef, loading, pageNow, pageSize, serverItems, totalItems,
    generatedHeaders, modal, getLength, selectModal, closeModal,
    onUpdateOptions, loadItems, setFocus, validarIdentidade
  }
}