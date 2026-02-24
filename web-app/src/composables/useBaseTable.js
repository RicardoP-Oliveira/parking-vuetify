import { ref, reactive, nextTick, computed, watch } from 'vue'

export function useBaseTable(props, emit) {
  // Estado inicial exatamente como no seu data()
  const ident = ref('')
  const identRef = ref(null)
  const pageSize = ref(50)
  const pageNow = ref(1)
  const serverItems = ref([])
  const totalItems = ref(0)
  const loading = ref(false)
  const generatedHeaders = ref([])
  
  const modal = reactive({
    isOpen: false,
    type: null,
  })

  const token = `Bearer ${localStorage.getItem('token')}`

  // Configurações estáticas (não precisam ser reativas)
  const columnsMap = {
    nome: { width: 450, align: 'center' },
    tipoDoc: { width: 130, align: 'center' },
    numDoc: { width: 160, align: 'center' },
    entrada: { width: 110 },
    hEntrada: { width: 90 },
    saida: { width: 110 },
    hSaida: { width: 90 },
    destino: { width: 110, align: 'center' }
  }

  const columnNameMap = {
    marcaModelo: 'Modelo',
    eRg: 'Documento',
    eCondutor: 'Condutor',
    sRg: 'Documento',
    sCondutor: 'Condutor',
    entrada: 'Data',
    saida: 'Data',
    hEntrada: 'Hora',
    hSaida: 'Hora',
    nome: 'Pedestre',
    tipoDoc: 'Tipo Documento',
    numDoc: 'Documento',
  }

  // Métodos de apoio
  const setFocus = () => {
    nextTick(() => {
      setTimeout(() => {
        if (identRef.value) identRef.value.focus()
      }, 170)
    })
  }

  const generateHeaders = () => {
    const order = props.getHeaderOrder()
    const groups = props.getHeaderGroups()
    const headers = []

    order.forEach((key) => {
      if (groups[key]) {
        const group = groups[key]
        headers.push({
          title: group.title,
          align: 'center',
          children: group.children.map((child) => {
            const col = columnsMap[child.key] ?? {}
            return {
              key: child.key,
              title: columnNameMap[child.key] ?? child.title ?? child.key,
              align: col.align ?? 'center',
              width: col.width ?? 100
            }
          })
        })
        return
      }

      const col = columnsMap[key] ?? {}
      headers.push({
        key,
        title: columnNameMap[key] ?? key,
        align: col.align ?? 'center',
        width: col.width ?? 100
      })
    })
    generatedHeaders.value = headers
  }
 let isFetching = false
  // A função principal (Mantendo o seu loop exato)
  const loadItems = async ({ page = pageNow.value, itemsPerPage = pageSize.value } = {}) => {
    if (isFetching) return;
    try {
      isFetching = true
      loading.value = true
      const res = await props.dataService(
        page,
        itemsPerPage,
        token,
        props.tab,
        props.filters
      )

      const displayColumns = props.getColumns()

      serverItems.value = res[0].dados.map((item) => {
        const filteredItem = {}
        displayColumns.forEach((column) => {
          switch (column) {
            case 'tipoDoc': filteredItem.tipoDoc = item.e_tipoDoc ?? ''; break
            case 'numDoc': filteredItem.numDoc = item.e_documento ?? ''; break
            case 'nome': filteredItem.nome = item.e_nomeCompleto; break
            case 'entrada':
              filteredItem.entrada = item.entrada ? new Date(item.entrada).toLocaleDateString() : ''; break
            case 'hEntrada': filteredItem.hEntrada = item.hEntrada ?? ''; break
            case 'saida':
              filteredItem.saida = item.saida ? new Date(item.saida).toLocaleDateString() : ' ___/___/___'; break
            case 'hSaida': filteredItem.hSaida = item.hSaida ?? '--:--:--'; break
            case 'eCondutor': filteredItem.eCondutor = item.e_nomeCompleto; break
            case 'sCondutor': filteredItem.sCondutor = item.s_nomeCompleto; break
            case 'eRg': filteredItem.eRg = item.e_documento ?? ''; break
            case 'sRg': filteredItem.sRg = item.s_documento ?? ''; break
            default: filteredItem[column] = item[column] ?? ''
          }
        })
        return filteredItem
      })

      totalItems.value = res[1]
      generateHeaders()
    } catch (error) {
      console.error('Erro ao carregar itens:', error)
    } finally {
      loading.value = false
      isFetching = false
    }
  }

  // Eventos de interface
  const onUpdateOptions = (options) => {
    pageNow.value = options.page
    pageSize.value = options.itemsPerPage
    loadItems({
      page: options.page,
      itemsPerPage: options.itemsPerPage
    })
    setFocus()
  }

  const selectModal = () => {
    if (!ident.value) {
      emit('show-snackbar', { message: 'Campo obrigatório.', color: 'error', timeout: 3000 })
      return
    }
    const ifPattern = /^[A-Z]{1,4}\d?-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}|^#\d*$/
    modal.isOpen = true
    modal.type = ifPattern.test(ident.value) ? 'carro' : 'pedestre'
  }

  const closeModal = (from) => {
    modal.isOpen = false
    nextTick(() => {
      ident.value = ''
      setFocus()
      // applyFiltersFromParent logic:
      if (pageNow.value === 1) loadItems({ page: 1 })
      else pageNow.value = 1
    })
    if (from) emit('changeTable', from)
  }

  // Watchers (Cuidado aqui: é onde a lentidão costuma nascer)
  watch(() => props.tab, () => {
    serverItems.value = []
    emit('update-btn')
    loadItems({ page: pageNow.value, itemsPerPage: pageSize.value })
    setTimeout(() => { setFocus() }, 300)
  })

  watch(ident, (v) => { if (v) ident.value = v.toUpperCase() })

  watch(() => props.filters, () => {
    console.log('watch')
    pageNow.value = 1
  }, { deep: true })

  // Computed para o maxlength (getLength no seu código original)
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
    generatedHeaders, modal, getLength, selectModal, closeModal, onUpdateOptions, 
    loadItems, setFocus, validateIdent: (v) => {
      const p = /^(?!0+\d?)([0-9]{1,11}$|^[A-Z]{1,4}\d?-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}|^#\d*$)/
      return v.length === 0 || p.test(v) || 'Identificador inválido'
    }
  }
}