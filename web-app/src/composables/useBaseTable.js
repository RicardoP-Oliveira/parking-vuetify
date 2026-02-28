import { ref, reactive, nextTick, computed, watch, onUnmounted } from 'vue'
import { getTableConfig } from '@/config/headersConfig'


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

  const modal = reactive({ isOpen: false, type: null })

  const token = `Bearer ${localStorage.getItem('token')}`

  // Foco
  let focusTimer = null
  const setFocus = () => {
    nextTick(() => {
      if (focusTimer) clearTimeout(focusTimer);

      focusTimer = setTimeout(() => {
        // Busca o elemento real da classe v-field__input dentro do seu componente
        const el = identRef.value?.$el?.querySelector('.v-field__input');

        if (el) {
          console.log('✅ Aplicando foco forçado para vencer o bloqueio de autofocus');
          el.focus();
          el.select();
        }
      }, 150); // Pequeno atraso adicional dentro do ciclo de renderização
    });
  }

  // VALIDAÇÃO DE ENTRADA DE DADOS
  const validarIdentidade = (valor) =>{
    const sequenciaRepetida = /0{4,}/
    const antiga = /^[A-Z]{3}\d{4}$/i
    const mercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/i
    const prefixo = /^[A-Z0-9]{1,4}-\d{3}$/i
    const documento = /^\d+$/
    const eValido =  antiga.test(valor) || mercosul.test(valor) || prefixo.test(valor) || documento.test(valor)
    if (!valor) return { valido: false, msg: 'Campo obrigatório!' }
    if (valor.length <4) return { valido: false, msg: 'O campo deve ter pelo menos 4 caracteres!' }
    if (sequenciaRepetida.test(valor)) return { valido: false, msg: 'Sequências repetidas nao permitida.' }
    if (!eValido) {
      return {  valido: false, msg: 'Placa ou Prefixo inválido.' }
    } else {
      return { valido: true, msg: '' }
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
    const check = validarIdentidade(ident.value)
    if (!check.valido) {
      emit('show-snackbar', { 
        message: check.msg, 
        color: 'warning',
        timeout: 3000 })
      return
    }
    const ifPattern = /^[A-Z]{1,4}\d?-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}|^#\d*$/
    modal.isOpen = true
    modal.type = ifPattern.test(ident.value) ? 'carro' : 'pedestre'
  }

  const closeModal = (from) => {
    modal.isOpen = false
    ident.value = ''
    setTimeout(() => {
      if (from && from !== props.tab) {
        emit('changeTable', from)
        return
      } else {
      loadItems({ page: 1 })
      setFocus()
      }
    }, 400)
  }
    

  watch(() => props.tab, (newValue, oldValue) => {
    if (newValue !== oldValue) serverItems.value = []
    console.log('O Watcher')
  })

  watch(ident, (v) => { if (v) ident.value = v.toUpperCase() })

  watch(() => props.filters, () => {    
    pageNow.value = 1;
    loadItems();
  }, { deep: true });
  // Computed para maxlength
  const getLength = computed(() => {
    const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/
    const vtrRegex = /^[A-Z]{1,4}\d?-\d{3}$/
    const docRegex = /^\d{1,11}$/
    if (placaRegex.test(ident.value)) return 7
    if (vtrRegex.test(ident.value)) return ident.value.length
    if (docRegex.test(ident.value)) return 11
    return 10
  })

  return {
    ident, identRef, loading, pageNow, pageSize, serverItems, totalItems,
    generatedHeaders, modal, getLength, selectModal, closeModal,
    onUpdateOptions, loadItems, setFocus,
    validateIdent: (v) => {
      const p = /^(?!0+\d?)([0-9]{1,11}$|^[A-Z]{1,4}\d?-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}|^#\d*$)/
      return v.length === 0 || p.test(v) || 'Identificador inválido'
    }
  }

  onUnmounted(() => {
    if (focusTimer) clearTimeout(focusTimer)
  })
}